from pathlib import Path
import re
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
SEED_FILE = ROOT / "my-react-app" / "backend" / "seedProducts.js"
OUTPUT_PDF = ROOT / "rag-service" / "data" / "product_catalog.pdf"


def extract_products(seed_text):
    pattern = (
        r'\{\s*name:\s*"([^"]+)",\s*company:\s*"([^"]+)",\s*'
        r'price:\s*(\d+),\s*stock:\s*(\d+),\s*description:\s*"([^"]+)",\s*'
        r'expiry:\s*"([^"]+)"\s*\}'
    )
    matches = re.findall(pattern, seed_text)
    products = []
    for idx, item in enumerate(matches, start=1):
        name, company, price, stock, description, expiry = item
        products.append({
            "id": idx,
            "name": name,
            "company": company,
            "price": int(price),
            "stock": int(stock),
            "description": description,
            "expiry": expiry,
        })
    return products


def build_pdf(products, output_path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=letter)
    width, height = letter
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "PharmaHub Product Catalog")
    c.setFont("Helvetica", 10)
    c.drawString(
        50,
        height - 70,
        f"Generated from {SEED_FILE.name} with {len(products)} products",
    )

    y = height - 100
    for product in products:
        if y < 80:
            c.showPage()
            y = height - 60

        line = (
            f"{product['id']}. {product['name']} | "
            f"Company: {product['company']} | Price: ₹{product['price']} | "
            f"Stock: {product['stock']} | Expiry: {product['expiry']}"
        )
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, y, line)
        y -= 14

        c.setFont("Helvetica", 9)
        wrapped = [product['description']]
        for part in wrapped:
            c.drawString(50, y, part[:120])
            y -= 12

        y -= 8

    c.save()


def generate_product_pdf():
    seed_text = SEED_FILE.read_text(encoding="utf-8")
    products = extract_products(seed_text)
    build_pdf(products, OUTPUT_PDF)
    print(f"Generated {len(products)} product entries in {OUTPUT_PDF}")
    return OUTPUT_PDF


if __name__ == "__main__":
    generate_product_pdf()
