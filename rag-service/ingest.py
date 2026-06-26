import json

# Step 1: Load the medicines from JSON
with open("data/medicines.json", "r") as file:
    medicines = json.load(file)

# Step 2: Convert each medicine into a text docum
for medicine in medicines:
    # Create a clean text document for each medicine
    document = f"""
Name: {medicine['name']}

Uses: {medicine['uses']}

Dosage: {medicine['dosage']}

Side Effects: {', '.join(medicine['sideEffects'])}

Warnings: {', '.join(medicine['warnings'])}
"""
    
    print(f"--- Medicine #{medicine['id']} ---")
    print(document)
    print()
