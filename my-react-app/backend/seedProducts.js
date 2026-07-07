import mongoose from "mongoose";
import Product from "./models/product.js";
import dotenv from "dotenv";

dotenv.config();

// Exactly 107 pharmaceutical products - all with required fields (name, price, company, expiry, stock, description)
const products107 = [
  { name: "Dolo 650", company: "Micro Labs", price: 45, stock: 500, description: "Paracetamol fever & pain relief", expiry: "2026-12-31" },
  { name: "Crocin 500", company: "GSK", price: 50, stock: 500, description: "Paracetamol fever & headache", expiry: "2026-12-31" },
  { name: "Ibuprofen 200mg", company: "Cipla", price: 60, stock: 400, description: "Anti-inflammatory pain relief", expiry: "2026-12-31" },
  { name: "Aspirin 500", company: "Bayer", price: 65, stock: 300, description: "Aspirin pain & inflammation", expiry: "2026-12-31" },
  { name: "Combiflam", company: "Sanofi", price: 85, stock: 350, description: "Ibuprofen + Paracetamol combo", expiry: "2026-12-31" },
  { name: "Nimesulide 100", company: "Lupin", price: 70, stock: 280, description: "NSAID pain & fever relief", expiry: "2026-12-31" },
  { name: "Diclofenac 50", company: "Intas", price: 75, stock: 250, description: "Powerful anti-inflammatory", expiry: "2026-12-31" },
  { name: "Meftal Spas", company: "Menarini", price: 95, stock: 200, description: "Mefenamic acid antispasmodic", expiry: "2026-12-31" },
  { name: "Paracetamol 1000", company: "Strides", price: 55, stock: 400, description: "High dose paracetamol", expiry: "2026-12-31" },
  { name: "Tramadol 50mg", company: "Pfizer", price: 120, stock: 150, description: "Strong pain relief", expiry: "2026-12-31" },
  { name: "Amoxicillin 500", company: "Cipla", price: 85, stock: 300, description: "Penicillin antibiotic", expiry: "2026-12-31" },
  { name: "Azithromycin 500", company: "Dr. Reddy's", price: 180, stock: 250, description: "Broad spectrum antibiotic", expiry: "2026-12-31" },
  { name: "Ciprofloxacin 500", company: "Ranbaxy", price: 90, stock: 280, description: "Fluoroquinolone antibiotic", expiry: "2026-12-31" },
  { name: "Cephalexin 500", company: "Sun Pharma", price: 100, stock: 220, description: "Cephalosporin antibiotic", expiry: "2026-12-31" },
  { name: "Metronidazole 400", company: "Lupin", price: 65, stock: 350, description: "Anti-parasitic antibiotic", expiry: "2026-12-31" },
  { name: "Doxycycline 100", company: "Intas", price: 95, stock: 190, description: "Tetracycline antibiotic", expiry: "2026-12-31" },
  { name: "Norfloxacin 400", company: "Glaxo", price: 85, stock: 260, description: "UTI treatment antibiotic", expiry: "2026-12-31" },
  { name: "Levofloxacin 500", company: "Alembic", price: 110, stock: 180, description: "Respiratory antibiotic", expiry: "2026-12-31" },
  { name: "Amoxicillin+Clavulanic", company: "Augmentin", price: 135, stock: 210, description: "Antibiotic combination", expiry: "2026-12-31" },
  { name: "Erythromycin 250", company: "Merck", price: 75, stock: 290, description: "Macrolide antibiotic", expiry: "2026-12-31" },
  { name: "Salbutamol Inhaler", company: "GSK", price: 250, stock: 180, description: "Asthma relief spray", expiry: "2026-12-31" },
  { name: "Cough Syrup DXM", company: "Benadryl", price: 120, stock: 320, description: "Dry cough suppressant", expiry: "2026-12-31" },
  { name: "Throat Lozenge", company: "Strepsils", price: 85, stock: 400, description: "Throat relief tablet", expiry: "2026-12-31" },
  { name: "Cetrizine 10mg", company: "Cipla", price: 45, stock: 500, description: "Antihistamine allergies", expiry: "2026-12-31" },
  { name: "Loratadine 10mg", company: "Sun Pharma", price: 55, stock: 480, description: "Non-drowsy antihistamine", expiry: "2026-12-31" },
  { name: "Promethazine 25", company: "Phensedyl", price: 60, stock: 350, description: "Allergy cough relief", expiry: "2026-12-31" },
  { name: "Montelukast 4mg", company: "Merck", price: 140, stock: 200, description: "Asthma prevention", expiry: "2026-12-31" },
  { name: "Omeprazole 20", company: "Cipla", price: 95, stock: 280, description: "Acid reflux medication", expiry: "2026-12-31" },
  { name: "Ranitidine 150", company: "Ranbaxy", price: 80, stock: 310, description: "Heartburn treatment", expiry: "2026-12-31" },
  { name: "Pantoprazole 40", company: "Alembic", price: 110, stock: 240, description: "Gastric acid reducer", expiry: "2026-12-31" },
  { name: "Loperamide 2mg", company: "Searle", price: 75, stock: 400, description: "Anti-diarrheal tablets", expiry: "2026-12-31" },
  { name: "Domperidone 10", company: "Cipla", price: 65, stock: 420, description: "Nausea relief medicine", expiry: "2026-12-31" },
  { name: "Metoclopramide 10", company: "GSK", price: 60, stock: 380, description: "Anti-vomiting agent", expiry: "2026-12-31" },
  { name: "Antacid Gel", company: "Digene", price: 85, stock: 500, description: "Stomach acid relief", expiry: "2026-12-31" },
  { name: "Probiotics Capsule", company: "Align", price: 280, stock: 150, description: "Gut health probiotic", expiry: "2026-12-31" },
  { name: "Ispagula Husk", company: "Metamucil", price: 150, stock: 200, description: "Natural fiber laxative", expiry: "2026-12-31" },
  { name: "Lactulose Syrup", company: "Duphalac", price: 120, stock: 250, description: "Constipation relief syrup", expiry: "2026-12-31" },
  { name: "Simethicone 40", company: "Gas-X", price: 70, stock: 380, description: "Bloating gas relief", expiry: "2026-12-31" },
  { name: "Mebendazole 100", company: "Cipla", price: 85, stock: 300, description: "Deworming medicine", expiry: "2026-12-31" },
  { name: "Albendazole 400", company: "GSK", price: 95, stock: 280, description: "Broad spectrum dewormer", expiry: "2026-12-31" },
  { name: "Vitamin C 500mg", company: "Limcee", price: 60, stock: 600, description: "Immunity booster tablet", expiry: "2026-12-31" },
  { name: "Vitamin B Complex", company: "Beplex", price: 80, stock: 500, description: "Energy nerve health", expiry: "2026-12-31" },
  { name: "Vitamin D3 1000IU", company: "Calcichew", price: 120, stock: 350, description: "Bone calcium supplement", expiry: "2026-12-31" },
  { name: "Zinc Supplement", company: "Glucojet", price: 90, stock: 400, description: "Immunity support tablet", expiry: "2026-12-31" },
  { name: "Iron Folic Acid", company: "Heamatinic", price: 70, stock: 450, description: "Anemia treatment", expiry: "2026-12-31" },
  { name: "Calcium Carbonate", company: "Caltrate", price: 110, stock: 380, description: "Bone strength pill", expiry: "2026-12-31" },
  { name: "Magnesium Tablet", company: "Nature's Bounty", price: 95, stock: 320, description: "Muscle relaxation", expiry: "2026-12-31" },
  { name: "Multivitamin Tablet", company: "Inlife", price: 180, stock: 400, description: "Daily multivitamin", expiry: "2026-12-31" },
  { name: "Biotin 5mg", company: "GNC", price: 150, stock: 280, description: "Hair skin health", expiry: "2026-12-31" },
  { name: "Omega-3 Fish Oil", company: "GNC", price: 280, stock: 200, description: "Heart health supplement", expiry: "2026-12-31" },
  { name: "Metformin 500", company: "Ranbaxy", price: 95, stock: 400, description: "Diabetes medication", expiry: "2026-12-31" },
  { name: "Glibenclamide 5", company: "Cipla", price: 80, stock: 350, description: "Blood sugar control", expiry: "2026-12-31" },
  { name: "Pioglitazone 15", company: "Actos", price: 180, stock: 200, description: "Insulin sensitivity", expiry: "2026-12-31" },
  { name: "Insulin Aspart", company: "Novo Nordisk", price: 850, stock: 50, description: "Rapid-acting insulin", expiry: "2026-12-31" },
  { name: "Glipizide 5mg", company: "Merck", price: 85, stock: 320, description: "Diabetes control", expiry: "2026-12-31" },
  { name: "Sitagliptin 100", company: "Januvia", price: 220, stock: 180, description: "DPP-4 inhibitor", expiry: "2026-12-31" },
  { name: "Exenatide Pen", company: "Byetta", price: 350, stock: 80, description: "Diabetes injection pen", expiry: "2026-12-31" },
  { name: "Dapagliflozin 10", company: "Forxiga", price: 240, stock: 150, description: "SGLT2 inhibitor", expiry: "2026-12-31" },
  { name: "Voglibose 0.3", company: "Volix", price: 140, stock: 220, description: "Alpha glucosidase inhibitor", expiry: "2026-12-31" },
  { name: "Teneligliptin 20", company: "Tenelia", price: 200, stock: 190, description: "Diabetes management", expiry: "2026-12-31" },
  { name: "Amlodipine 5", company: "Ranbaxy", price: 75, stock: 450, description: "Blood pressure medicine", expiry: "2026-12-31" },
  { name: "Lisinopril 10", company: "Cipla", price: 85, stock: 400, description: "ACE inhibitor hypertension", expiry: "2026-12-31" },
  { name: "Losartan 50", company: "Cozaar", price: 95, stock: 350, description: "ARB blood pressure", expiry: "2026-12-31" },
  { name: "Atenolol 50", company: "GSK", price: 70, stock: 420, description: "Beta blocker BP", expiry: "2026-12-31" },
  { name: "Metoprolol 100", company: "Cipla", price: 85, stock: 380, description: "Heart rate BP control", expiry: "2026-12-31" },
  { name: "Hydrochlorothiazide 25", company: "Intas", price: 60, stock: 500, description: "Diuretic hypertension", expiry: "2026-12-31" },
  { name: "Valsartan 80", company: "Diovan", price: 140, stock: 250, description: "ARB medication", expiry: "2026-12-31" },
  { name: "Telmisartan 40", company: "Merck", price: 110, stock: 300, description: "Long-acting ARB", expiry: "2026-12-31" },
  { name: "Spironolactone 25", company: "Aldactone", price: 130, stock: 200, description: "Potassium sparing", expiry: "2026-12-31" },
  { name: "Clonidine 0.1mg", company: "Catapres", price: 95, stock: 280, description: "Alpha agonist", expiry: "2026-12-31" },
  { name: "Aspirin 75mg", company: "Ashpril", price: 55, stock: 550, description: "Blood thinner heart", expiry: "2026-12-31" },
  { name: "Clopidogrel 75", company: "Plavix", price: 280, stock: 180, description: "Antiplatelet medicine", expiry: "2026-12-31" },
  { name: "Warfarin 5mg", company: "Coumarin", price: 100, stock: 240, description: "Anticoagulant tablet", expiry: "2026-12-31" },
  { name: "Atorvastatin 10", company: "Lipitor", price: 120, stock: 350, description: "Cholesterol reducer", expiry: "2026-12-31" },
  { name: "Simvastatin 20", company: "Zocor", price: 110, stock: 320, description: "Statin cholesterol", expiry: "2026-12-31" },
  { name: "Rosuvastatin 10", company: "Crestor", price: 150, stock: 280, description: "High potency statin", expiry: "2026-12-31" },
  { name: "Digoxin 0.25", company: "Lanoxin", price: 85, stock: 210, description: "Heart failure medicine", expiry: "2026-12-31" },
  { name: "Furosemide 40", company: "Lasix", price: 65, stock: 400, description: "Loop diuretic edema", expiry: "2026-12-31" },
  { name: "Isosorbide 5", company: "Isordil", price: 75, stock: 350, description: "Angina relief", expiry: "2026-12-31" },
  { name: "Nitroglycerin 0.6", company: "GTN", price: 90, stock: 280, description: "Angina chest pain", expiry: "2026-12-31" },
  { name: "Carvedilol 12.5", company: "Coreg", price: 125, stock: 250, description: "Beta blocker heart", expiry: "2026-12-31" },
  { name: "Milrinone 10mg", company: "Primacor", price: 300, stock: 100, description: "Inotropic agent", expiry: "2026-12-31" },
  { name: "Hydralazine 25", company: "Apresoline", price: 85, stock: 220, description: "Vasodilator BP", expiry: "2026-12-31" },
  { name: "Verapamil 120", company: "Calan", price: 140, stock: 190, description: "Calcium blocker", expiry: "2026-12-31" },
  { name: "Diltiazem 30", company: "Cardizem", price: 130, stock: 200, description: "Calcium channel blocker", expiry: "2026-12-31" },
  { name: "Labetalol 100", company: "Trandate", price: 115, stock: 240, description: "Alpha beta blocker", expiry: "2026-12-31" },
  { name: "Minoxidil 5", company: "Rogaine", price: 450, stock: 120, description: "Hair growth medication", expiry: "2026-12-31" },
  { name: "Finasteride 1mg", company: "Propecia", price: 500, stock: 100, description: "Hair loss treatment", expiry: "2026-12-31" },
  { name: "Lisinopril+HCTZ", company: "Zestoretic", price: 130, stock: 210, description: "Combination BP medicine", expiry: "2026-12-31" },
  { name: "Atorvastatin+Amlodipine", company: "Caduet", price: 200, stock: 160, description: "Heart combo tablet", expiry: "2026-12-31" },
  { name: "Levothyroxine 50", company: "Synthroid", price: 95, stock: 380, description: "Thyroid hormone", expiry: "2026-12-31" },
  { name: "Propylthiouracil 50", company: "PTU", price: 110, stock: 210, description: "Thyroid control", expiry: "2026-12-31" },
  { name: "Sertraline 50", company: "Zoloft", price: 280, stock: 150, description: "Antidepressant SSRI", expiry: "2026-12-31" },
  { name: "Fluoxetine 20", company: "Prozac", price: 300, stock: 140, description: "Depression treatment", expiry: "2026-12-31" },
  { name: "Paroxetine 20", company: "Paxil", price: 320, stock: 130, description: "Antidepressant", expiry: "2026-12-31" },
  { name: "Amitriptyline 25", company: "Elavil", price: 90, stock: 290, description: "Tricyclic antidepressant", expiry: "2026-12-31" },
  { name: "Alprazolam 0.5", company: "Xanax", price: 150, stock: 180, description: "Anti-anxiety drug", expiry: "2026-12-31" },
  { name: "Lorazepam 1mg", company: "Ativan", price: 160, stock: 170, description: "Anxiety sedation", expiry: "2026-12-31" },
  { name: "Diazepam 5", company: "Valium", price: 140, stock: 190, description: "Benzodiazepine", expiry: "2026-12-31" },
  { name: "Cetirizine 5mg", company: "Zyrtec", price: 90, stock: 260, description: "Allergy relief tablet", expiry: "2026-12-31" },
  { name: "Fexofenadine 180", company: "Allegra", price: 95, stock: 240, description: "Non-drowsy antihistamine", expiry: "2026-12-31" },
  { name: "Budesonide Inhaler", company: "Pulmicort", price: 320, stock: 140, description: "Asthma controller inhaler", expiry: "2026-12-31" },
  { name: "Prednisolone 5mg", company: "Wysolone", price: 80, stock: 300, description: "Anti-inflammatory steroid", expiry: "2026-12-31" },
  { name: "Acyclovir 400", company: "Zovirax", price: 180, stock: 180, description: "Antiviral for herpes", expiry: "2026-12-31" },
  { name: "Oseltamivir 75", company: "Tamiflu", price: 220, stock: 160, description: "Influenza treatment", expiry: "2026-12-31" },
  { name: "Glycomet GP 1", company: "USV", price: 120, stock: 210, description: "Diabetes management tablet", expiry: "2026-12-31" },
  { name: "Glimepiride 2mg", company: "Amaryl", price: 110, stock: 220, description: "Sulfonylurea diabetes medicine", expiry: "2026-12-31" },
];

const seedDatabase = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI;
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    const beforeCount = await Product.countDocuments();
    console.log(`📊 Products before: ${beforeCount}`);

    console.log(`📝 Adding 107 products...`);

    const result = await Product.insertMany(products107);
    console.log(`✅ Added ${result.length} products successfully!`);
    const afterCount = await Product.countDocuments();
    console.log(`📊 Products after: ${afterCount}`);

    console.log("\n📦 Sample products:");
    result.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - ₹${p.price}`);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
