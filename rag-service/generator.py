import json
import os
import re
import time
import urllib.error
import urllib.request


DEFAULT_MODEL = "gemini-2.5-flash"
GEMINI_COOLDOWN_SECONDS = int(os.getenv("GEMINI_COOLDOWN_SECONDS", "60"))
_gemini_blocked_until = 0.0


def _first_sentence(text):
    cleaned = " ".join((text or "").split()).strip()
    if not cleaned:
        return ""

    parts = re.split(r"(?<=[.!?])\s+", cleaned)
    return parts[0].strip() if parts else cleaned


def _generic_low_risk_answer(question):
    lowered = (question or "").lower()

    if "vitamin c" in lowered or "ascorbic" in lowered:
        return (
            "Vitamin C is a common vitamin and antioxidant. "
            "It helps the body make collagen, supports immune function, and helps absorb iron. "
            "It is found in citrus fruits, guava, berries, peppers, and supplements. "
            "If you need the right dose or have kidney disease, pregnancy, or other health conditions, "
            "please ask a pharmacist or clinician."
        )

    if "vitamin" in lowered or "supplement" in lowered:
        return (
            "This sounds like a general vitamin or supplement question. "
            "In general, vitamins help the body work normally, but the right choice and dose depend on age, diet, and health conditions. "
            "For exact dosing, interactions, pregnancy, or child use, please check with a pharmacist or clinician."
        )

    return ""


def _build_fallback_answer(question, documents):
    if not documents:
        generic = _generic_low_risk_answer(question)
        if generic:
            return generic

        return (
            "I could not find reliable matching context in the current medical knowledge base. "
            "If this is a common low-risk question, I can still give a brief general overview. "
            "Please ask about a specific medicine or consult a pharmacist or clinician."
        )

    primary = documents[0]
    source = primary.get("name") or primary.get("source") or "the retrieved medical source"
    snippet = primary.get("snippet") or primary.get("text") or ""
    sentence = _first_sentence(snippet)

    if sentence:
        return (
            f"Based on the retrieved context, {source} says: {sentence} "
            "Please verify this with a pharmacist or clinician before acting on it."
        )

    return (
        f"Based on the retrieved context, {source} is the best available match, "
        "but the details are limited. Please verify this with a pharmacist or clinician."
    )


def _extract_text(payload):
    candidates = payload.get("candidates") or []
    for candidate in candidates:
        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        text_parts = []
        for part in parts:
            if isinstance(part, dict):
                part_text = part.get("text", "")
                if part_text:
                    text_parts.append(part_text)
        text = "\n".join(text_parts).strip()
        if text:
            return text

    return ""


def _call_gemini(prompt, api_key, model, temperature=0.2, max_output_tokens=512):
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )

    body = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt,
                    }
                ],
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.95,
            "maxOutputTokens": max_output_tokens,
        },
    }

    request = urllib.request.Request(
        endpoint,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.loads(response.read().decode("utf-8"))

    answer = _extract_text(payload)
    if not answer:
        raise RuntimeError("Gemini returned an empty response.")

    return answer.strip()


def _read_http_error_details(exc):
    body = ""
    try:
        raw = exc.read()
        if raw:
            body = raw.decode("utf-8", errors="replace")
    except Exception:
        body = ""

    if body:
        return f"{exc.code}: {body}"

    return f"{exc.code}: {exc.reason}"


def generate_answer(prompt, question, documents):
    global _gemini_blocked_until

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL

    if not api_key:
        return {
            "answer": _build_fallback_answer(question, documents),
            "provider": "fallback",
            "model": model,
        }

    now = time.monotonic()
    if now < _gemini_blocked_until:
        return {
            "answer": _build_fallback_answer(question, documents),
            "provider": "fallback",
            "model": model,
            "error": "Gemini cooldown active after rate limit",
        }

    try:
        answer = _call_gemini(prompt, api_key, model)
        _gemini_blocked_until = 0.0
        return {
            "answer": answer,
            "provider": "gemini",
            "model": model,
        }
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, RuntimeError, json.JSONDecodeError) as exc:
        error_message = str(exc)
        if isinstance(exc, urllib.error.HTTPError) and exc.code == 429:
            _gemini_blocked_until = time.monotonic() + GEMINI_COOLDOWN_SECONDS
            error_message = _read_http_error_details(exc)

        print(f"Gemini generation failed, using fallback answer: {error_message}")
        return {
            "answer": _build_fallback_answer(question, documents),
            "provider": "fallback",
            "model": model,
            "error": error_message,
        }
