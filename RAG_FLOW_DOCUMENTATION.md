# PharmaHub RAG (Retrieval-Augmented Generation) Flow - Detailed Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE (React)                       │
│              MedicalAssistant.jsx Component                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP POST /api/medicalassistant/chat
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND NODE.JS SERVER                          │
│          medicalAssistantController.js                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Safety Check (Emergency Keywords)                    │  │
│  │ 2. Redis Cache Lookup                                   │  │
│  │ 3. RAG Retrieval & Composition                          │  │
│  │ 4. Redis Cache Store                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐
    │   Safety    │   │ Retrieval   │   │  Redis Cache    │
    │   Check     │   │   Engine    │   │  (1 hour TTL)   │
    └─────────────┘   └─────────────┘   └─────────────────┘
           │                  │
           └──────────┬───────┘
                      ▼
         ┌─────────────────────────┐
         │  Response to Frontend    │
         │  {                       │
         │    answer,               │
         │    citations,            │
         │    riskLevel,            │
         │    needsUrgentCare       │
         │  }                       │
         └─────────────────────────┘
```

---

## 📊 Detailed Flow: Query Processing Pipeline

### **Phase 1: Frontend Request**
**File:** `frontend/src/pages/MedicalAssistant.jsx`
- User types medical question in React component
- Sends HTTP POST request to backend: `/api/medicalassistant/chat`
- Payload: `{ message: "What medicine for fever?" }`

---

### **Phase 2: Backend Request Handling**
**File:** `backend/controllers/medicalAssistantController.js`

#### Step 2.1: Input Validation
```javascript
const { message } = req.body;
if (!message || !message.trim()) {
  return res.status(400).json({ error: "Message is required" });
}
```
- Validates that message exists and is not empty
- Normalizes whitespace

#### Step 2.2: Safety Triage Check
```javascript
const safety = checkSafety(normalized);
if (!safety.safe) {
  // Return emergency warning
}
```
- Calls `safety.js` to check for emergency keywords
- If dangerous keywords detected (chest pain, stroke, etc.), immediately returns emergency warning
- Prevents the system from giving medical advice for urgent situations

#### Step 2.3: Cache Lookup
```javascript
const hash = crypto.createHash("sha256").update(normalized.toLowerCase()).digest("hex");
const cacheKey = `medassist:${hash}`;
const cached = await redisClient.get(cacheKey);
```
- Creates SHA256 hash of normalized question
- Looks up in Redis cache with 1-hour TTL
- If found, returns cached response immediately (faster response)
- Reduces redundant computations

#### Step 2.4: RAG Retrieval (if not cached)
```javascript
const retrieval = composeMedicalReply(normalized);
```
- Calls retrieval engine with user's question
- Retrieves relevant medicine information
- Composes structured response

#### Step 2.5: Cache Storage
```javascript
await redisClient.set(cacheKey, JSON.stringify(responsePayload), { EX: 3600 });
```
- Stores response in Redis with 1-hour expiration
- Future identical questions return cached results

---

### **Phase 3: Safety Check**
**File:** `backend/services/rag/safety.js`

#### Purpose:
Identify emergency keywords to prevent inappropriate medical guidance

#### Emergency Keywords Detected:
- "chest pain", "difficulty breathing", "stroke", "seizure"
- "heavy bleeding", "unconscious", "suicidal"
- "allergic reaction"

#### Response:
If emergency detected:
```javascript
{
  safe: false,
  riskLevel: "high",
  needsUrgentCare: true,
  answer: "Your symptoms may indicate a medical emergency. 
           Please seek immediate medical care..."
}
```

---

### **Phase 4: RAG Retrieval & Response Composition**
**File:** `backend/services/rag/retrieval.js`

#### Sub-components:

**4.1: medicineKnowledge.js - Knowledge Base**
```javascript
const medicineKnowledge = [
  {
    id: 1,
    name: "Dolo 650",
    uses: "Used for fever and mild pain.",
    dosage: "Take one tablet every 6 hours if needed.",
    sideEffects: ["Nausea", "Dizziness"],
    warnings: ["Do not exceed recommended dosage."]
  },
  // ... more medicines
]
```
- Static in-memory knowledge base of medicines
- Contains: name, uses, dosage, side effects, warnings
- Acts as the retrieval source for the RAG system

**4.2: Text Processing Functions**

**a) Normalize Function**
```javascript
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")      // Remove special chars
    .replace(/\s+/g, " ")              // Normalize whitespace
    .trim();
}
```
- Converts text to lowercase
- Removes special characters and punctuation
- Standardizes whitespace

**b) Tokenize Function**
```javascript
function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((word) => word && !stopWords.has(word));
}
```
- Splits normalized text into words
- Removes stop words (a, the, for, with, and, etc.)
- Returns meaningful keywords only

**c) Build Candidate Function**
```javascript
function buildCandidate(item) {
  const text = [item.name, item.uses, item.dosage, 
                item.sideEffects.join(", "), 
                item.warnings.join(", ")].join(" \n ");
  return {
    id: item.id,
    name: item.name,
    summary: text,
    tokens: new Set(tokenize(text)),  // Pre-tokenized for fast matching
    uses: item.uses,
    dosage: item.dosage,
    // ...
  };
}
```
- Converts each medicine to searchable candidate
- Pre-processes tokens for fast matching
- Combines all relevant fields

**4.3: Scoring & Retrieval Algorithm**

**a) Score Candidates**
```javascript
function scoreCandidate(questionTokens, candidate) {
  let score = 0;
  
  // Match each token: +1 point
  for (const token of questionTokens) {
    if (candidate.tokens.has(token)) {
      score += 1;
    }
  }
  
  // Medicine name match: +4 bonus points
  const normalizedName = normalize(candidate.name);
  if (questionTokens.has(normalizedName)) {
    score += 4;
  }
  
  return score;
}
```
- Keyword matching algorithm
- Exact medicine name matches score higher (+4)
- Individual keyword matches score (+1 each)

**b) Make Snippet**
```javascript
function makeSnippet(candidate, questionTokens) {
  const lines = candidate.summary.split("\n");
  
  // Rank each line by relevance
  const ranked = lines
    .map((line) => ({
      line: line.trim(),
      lineScore: countMatchingTokens(line, questionTokens)
    }))
    .sort((a, b) => b.lineScore - a.lineScore);
  
  return ranked[0]?.line || candidate.summary.slice(0, 120).trim();
}
```
- Extracts most relevant part of medicine info
- Ranks by token match count
- Returns highest-scoring snippet

**4.4: Retrieve Medical Evidence**
```javascript
export function retrieveMedicalEvidence(question, limit = 3) {
  const questionTokens = new Set(tokenize(question));
  
  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(questionTokens, candidate),
      snippet: makeSnippet(candidate, questionTokens)
    }))
    .filter((candidate) => candidate.score > 0)      // Only > 0 score
    .sort((a, b) => b.score - a.score)              // Sort by score
    .slice(0, limit);                                 // Top 3 results
  
  return scored;
}
```
- Main retrieval function
- Returns top 3 most relevant medicines
- Only includes matches with score > 0

**4.5: Compose Medical Reply**
```javascript
export function composeMedicalReply(question) {
  const evidence = retrieveMedicalEvidence(question, 3);
  
  // Disclaimer
  const answerPrefix = "This information comes from the local medicine 
                        knowledge base. Use it for general guidance only...";
  
  // No matches case
  if (!evidence.length) {
    return {
      answer: answerPrefix + " I couldn't find a close match...",
      citations: [],
      riskLevel: "low",
      needsUrgentCare: false
    };
  }
  
  // Build response from evidence
  const primary = evidence[0];
  const pieces = [];
  
  pieces.push(`${primary.name} is generally used for ${primary.uses}`);
  
  // Add dosage if question about dosage
  if (wantsDosage) {
    pieces.push(`Recommended guidance: ${primary.dosage}`);
  }
  
  // Add side effects if question about side effects
  if (wantsEffects && primary.sideEffects.length) {
    pieces.push(`Possible side effects: ${primary.sideEffects.join(", ")}`);
  }
  
  // Add warnings if question about warnings
  if (wantsWarnings && primary.warnings.length) {
    pieces.push(`Warnings: ${primary.warnings.join(", ")}`);
  }
  
  return {
    answer: pieces.join(" "),
    citations: evidence.map((e) => ({ name: e.name, url: null })),
    riskLevel: "low",
    needsUrgentCare: false
  };
}
```
- Main composition function
- Detects intent (dosage? side effects? warnings?)
- Builds contextual answer
- Returns structured response

---

## 🔄 Data Ingestion Pipeline (Python RAG Service)

This system also includes a Python-based data ingestion pipeline for PDF processing:

### **File: `rag-service/ingest.py`**

**Purpose:** Load medicine data from PDF and store in MongoDB vector database

```python
def ingest_pdf(pdf_path=PDF_PATH):
    # 1. Extract text from PDF
    text = extract_text(pdf_path)
    
    # 2. Split into chunks
    chunks = chunk_text(text)
    
    # 3. Delete old data
    medicine_collection.delete_many({"source": pdf_path.name})
    
    # 4. For each chunk:
    for chunk_id, chunk in enumerate(chunks, start=1):
        # Generate embedding
        embedding = generate_embedding(chunk)
        
        # Create record
        record = {
            "source": pdf_path.name,
            "chunk_id": chunk_id,
            "text": chunk,
            "embedding": embedding,  # Vector representation
        }
        
        # Store in MongoDB
        medicine_collection.insert_one(record)
    
    return inserted_documents
```

#### Flow:
1. **PDF Loading** (`pdf_loader.py`) → Extract text from PDF
2. **Chunking** (`chunker.py`) → Split into 800-word chunks with 120-word overlap
3. **Embedding** (`embed.py`) → Convert chunks to 384-dimensional vectors
4. **Storage** → Save to MongoDB `medicine_vectors` collection

---

### **File: `rag-service/chunker.py`**

**Purpose:** Split long text into manageable chunks with overlap

```python
def chunk_text(text, chunk_size=800, overlap=120):
    # 1. Clean and normalize text
    cleaned = " ".join(text.split())
    words = cleaned.split()
    
    chunks = []
    start = 0
    
    # 2. Create overlapping windows
    while start < len(words):
        end = start + chunk_size              # 800 words per chunk
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)
        chunks.append(chunk_text)
        
        start += chunk_size - overlap         # 120 word overlap
    
    return chunks
```

**Why Overlap?** 
- Prevents losing context at chunk boundaries
- Ensures related information stays together
- Improves retrieval relevance

**Example:**
```
Words: [1, 2, 3, ..., 800, 801, ..., 920] (920 words)

Chunk 1: Words 1-800
Chunk 2: Words 680-920 (overlaps with 680-800)
```

---

### **File: `rag-service/embed.py`**

**Purpose:** Convert text to vector embeddings using ML model

```python
from sentence_transformers import SentenceTransformer

# Load pre-trained model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def generate_embedding(text):
    # Convert text to 384-dimensional vector
    embedding = model.encode(text)
    return embedding.tolist()
```

**Why Embeddings?**
- Enables semantic vector search (not just keyword matching)
- Finds similar concepts even with different words
- Enables MongoDB Atlas Vector Search

**Example:**
```
"Fever relief" → [0.234, -0.156, 0.892, ... (384 numbers)]
"Temperature reducer" → [0.231, -0.142, 0.889, ... (384 numbers)]
^ Similar vectors found by vector search!
```

---

### **File: `rag-service/retrieval.py`**

**Purpose:** Query MongoDB vector database with hybrid search

```python
def retrieve(question, limit=3):
    # 1. Convert question to embedding
    query_embedding = generate_embedding(question)
    
    # 2. Try vector search first
    try:
        results = medicine_collection.aggregate([
            {
                "$vectorSearch": {
                    "index": "autoembed_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 50,
                    "limit": limit,
                }
            }
        ])
        documents = list(results)
    except Exception:
        # 3. Fallback to keyword search if vector search fails
        q = question.lower()
        search_terms = [term for term in q.split() if len(term) > 2]
        query = {"$or": [...]}
        documents = list(medicine_collection.find(query).limit(limit))
    
    # 4. Score and rank results
    scored_docs = []
    for doc in documents:
        score = 0
        text = f"{doc.get('source', '')} {doc.get('text', '')}".lower()
        
        if q in text:
            score += 2
        for word in q.split():
            if word in text:
                score += 1
        
        scored_docs.append((score, doc))
    
    # 5. Return top results
    scored_docs.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in scored_docs[:limit]]
```

**Hybrid Search Strategy:**
1. **Primary:** Vector similarity search (semantic)
2. **Fallback:** Regex keyword search (exact match)
3. **Ranking:** Score by keyword overlap
4. **Return:** Top 3 results

---

### **File: `rag-service/config.py`**

**Purpose:** MongoDB connection configuration

```python
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://sahil:shruti@cluster0.pikz6bf.mongodb.net/..."

client = MongoClient(MONGO_URI)
db = client["pharmahub"]
medicine_collection = db["medicine_vectors"]
```

- Connects to MongoDB Atlas
- Selects `pharmahub` database
- Uses `medicine_vectors` collection for embeddings

---

## 📝 Complete End-to-End Example

### User Query: **"What medicine should I take for fever?"**

#### Step 1: Frontend
```javascript
// MedicalAssistant.jsx
fetch('/api/medicalassistant/chat', {
  method: 'POST',
  body: JSON.stringify({ message: "What medicine should I take for fever?" })
})
```

#### Step 2: Backend Receives Request
```javascript
// medicalAssistantController.js
const message = "What medicine should I take for fever?";
const normalized = "what medicine should i take for fever";
```

#### Step 3: Safety Check
```javascript
// safety.js
checkSafety(normalized)  // No emergency keywords → safe: true
```

#### Step 4: Cache Check
```javascript
const hash = SHA256("what medicine should i take for fever");
// Redis lookup: cache miss (first time)
```

#### Step 5: Tokenization
```javascript
// retrieval.js
const questionTokens = ["medicine", "take", "fever"]
// (stop words removed: what, should, i, for)
```

#### Step 6: Candidate Scoring
```javascript
Dolo 650:
  Uses: "Used for fever and mild pain"
  Tokens: ["used", "fever", "mild", "pain"]
  Score: 1 (fever matches) = 1 point

Ibuprofen:
  Uses: "Pain relief and inflammation control"
  Tokens: ["pain", "relief", "inflammation", "control"]
  Score: 0 (no matches) = 0 points

Result: Dolo 650 ranked #1
```

#### Step 7: Build Response
```javascript
const evidence = [
  {
    name: "Dolo 650",
    uses: "Used for fever and mild pain.",
    dosage: "Take one tablet every 6 hours if needed.",
    sideEffects: ["Nausea", "Dizziness"],
    warnings: ["Do not exceed recommended dosage."]
  }
]

const answer = "Dolo 650 is generally used for fever and mild pain. 
                Recommended guidance: Take one tablet every 6 hours if needed."
```

#### Step 8: Cache Store
```javascript
redisClient.set(
  "medassist:abc123def456",
  { answer, citations, riskLevel, needsUrgentCare },
  { EX: 3600 }  // 1 hour TTL
)
```

#### Step 9: Return to Frontend
```javascript
{
  answer: "Dolo 650 is generally used for fever and mild pain...",
  citations: [{ name: "Dolo 650" }],
  riskLevel: "low",
  needsUrgentCare: false,
  cached: false,
  requestId: "1720118400000"
}
```

#### Step 10: Frontend Displays
```
[Medical Assistant]
Q: What medicine should I take for fever?
A: Dolo 650 is generally used for fever and mild pain. 
   Recommended guidance: Take one tablet every 6 hours if needed.
⚠️ Risk Level: low | ✓ Not urgent
```

---

## 🔌 Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND                                 │
│  MedicalAssistant.jsx → API Call                             │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      ROUTES                                   │
│  medicalAssistantRoutes.js POST /chat                        │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      CONTROLLER                              │
│  medicalAssistantController.js chat()                        │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐         ┌────────┐        ┌────────┐
    │ Safety │         │Retrieval       │ Redis  │
    │ Check  │         │Engine  │        │ Cache  │
    └────────┘         └────────┘        └────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                    ┌────────────┐
                    │  Response  │
                    └────────────┘
```

---

## 📊 Data Flow Summary

| Stage | Component | Input | Output | Purpose |
|-------|-----------|-------|--------|---------|
| 1 | Frontend | User question | HTTP Request | Capture user input |
| 2 | Controller | HTTP Request | Normalized text | Validate & normalize |
| 3 | Safety | Normalized text | safe flag | Detect emergencies |
| 4 | Cache | Question hash | Cached response (or null) | Speed up responses |
| 5 | Tokenizer | Normalized text | Token set | Extract keywords |
| 6 | Candidate Scorer | Tokens + KB | Scored medicines | Rank candidates |
| 7 | Snippet Maker | Candidate + Tokens | Relevant snippet | Extract key info |
| 8 | Composer | Evidence + Intent | Structured answer | Build response |
| 9 | Cache Store | Response | Stored record | Cache for future |
| 10 | Response | Structured data | JSON | Send to frontend |

---

## 🎯 Key Design Decisions

### 1. **Hybrid Search** (retrieval.py)
- Vector search for semantic matching
- Keyword fallback for robustness
- Ranking by token overlap

### 2. **In-Memory KB** (retrieval.js)
- Fast local access (no DB queries)
- Suitable for small knowledge base
- Easy to update

### 3. **Caching Layer** (Redis)
- 1-hour TTL
- Hash-based keys for identical questions
- Graceful degradation if Redis unavailable

### 4. **Safety First** (safety.js)
- Emergency keyword detection
- Immediate response without processing
- Prevents harm from inappropriate advice

### 5. **Token-Based Retrieval**
- Stop word removal
- Text normalization
- Exact medicine name bonus scoring (+4 points)

---

## 🚀 Future Enhancements

1. **MongoDB Vector Search** - Replace Python ingestion with vector DB
2. **LLM Integration** - Use GPT-4 for more natural responses
3. **Semantic Search** - Full vector similarity in JavaScript
4. **Multi-language** - Support multiple languages
5. **User History** - Track and learn from past queries
6. **Admin Dashboard** - Manage knowledge base

---

## 📚 File Reference

| File | Location | Purpose |
|------|----------|---------|
| `ingest.py` | `rag-service/` | PDF ingestion pipeline |
| `chunker.py` | `rag-service/` | Text chunking with overlap |
| `embed.py` | `rag-service/` | Vector embedding generation |
| `retrieval.py` | `rag-service/` | MongoDB vector search |
| `config.py` | `rag-service/` | Database configuration |
| `medicineKnowledge.js` | `backend/services/rag/` | In-memory knowledge base |
| `retrieval.js` | `backend/services/rag/` | RAG scoring & composition |
| `safety.js` | `backend/services/rag/` | Emergency keyword detection |
| `medicalAssistantController.js` | `backend/controllers/` | Request handling & orchestration |
| `MedicalAssistant.jsx` | `frontend/src/pages/` | UI component |

