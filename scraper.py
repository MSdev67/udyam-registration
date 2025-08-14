# scraper.py
import requests
from bs4 import BeautifulSoup
import json

def scrape_udyam_form():
    url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract form fields from Step 1 (Aadhaar Verification)
    step1_fields = []
    aadhaar_section = soup.find(id="AadhaarVerification")
    
    if aadhaar_section:
        inputs = aadhaar_section.find_all('input')
        for input in inputs:
            field = {
                'id': input.get('id'),
                'name': input.get('name'),
                'type': input.get('type'),
                'placeholder': input.get('placeholder'),
                'required': input.get('required') is not None
            }
            step1_fields.append(field)
    
    # Extract form fields from Step 2 (PAN Verification)
    step2_fields = []
    pan_section = soup.find(id="PanVerification")
    
    if pan_section:
        inputs = pan_section.find_all('input')
        for input in inputs:
            field = {
                'id': input.get('id'),
                'name': input.get('name'),
                'type': input.get('type'),
                'placeholder': input.get('placeholder'),
                'required': input.get('required') is not None
            }
            step2_fields.append(field)
    
    # Save to JSON file
    form_structure = {
        'step1': step1_fields,
        'step2': step2_fields
    }
    
    with open('form_structure.json', 'w') as f:
        json.dump(form_structure, f, indent=2)
    
    print("Form structure saved to form_structure.json")

if __name__ == "__main__":
    scrape_udyam_form()