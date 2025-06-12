
export interface ExtractedData {
  fullName: string;
  dateOfBirth: string;
  aadharNumber: string;
  gender: string;
  address: string;
  documentNumber: string;
}

export const parseOCRText = (text: string): ExtractedData => {
  console.log("Parsing OCR text:", text);

  const extractedData: ExtractedData = {
    fullName: "",
    dateOfBirth: "",
    aadharNumber: "",
    gender: "",
    address: "",
    documentNumber: ""
  };

  // Extract Aadhar number (12 digits with or without spaces/hyphens)
  const aadharRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  const aadharMatch = text.match(aadharRegex);
  if (aadharMatch) {
    extractedData.aadharNumber = aadharMatch[0].replace(/[\s-]/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  }

  // Extract date of birth (various formats)
  const dobRegex = /(?:DOB|Date of Birth|Birth Date)[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/i;
  const dobMatch = text.match(dobRegex);
  if (dobMatch) {
    const dateStr = dobMatch[1];
    // Convert to YYYY-MM-DD format for date input
    const dateParts = dateStr.split(/[\/\-\.]/);
    if (dateParts.length === 3) {
      let year, month, day;
      if (dateParts[0].length === 4) {
        [year, month, day] = dateParts;
      } else {
        [day, month, year] = dateParts;
      }
      extractedData.dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // Extract gender
  const genderRegex = /(?:Gender|Sex)[\s:]*([MmFf]ale|[Mm]|[Ff])/i;
  const genderMatch = text.match(genderRegex);
  if (genderMatch) {
    const gender = genderMatch[1].toLowerCase();
    if (gender.startsWith('m')) {
      extractedData.gender = 'Male';
    } else if (gender.startsWith('f')) {
      extractedData.gender = 'Female';
    }
  }

  // Extract name (look for patterns like "Name: John Doe" or capitalized names)
  const nameRegex = /(?:Name|Full Name)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    extractedData.fullName = nameMatch[1].trim();
  } else {
    // Fallback: look for capitalized words that might be names
    const lines = text.split('\n');
    for (const line of lines) {
      const capitalizedWords = line.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/);
      if (capitalizedWords && !extractedData.fullName) {
        extractedData.fullName = capitalizedWords[0];
        break;
      }
    }
  }

  // Extract address (look for address patterns)
  const addressRegex = /(?:Address|Add)[\s:]+([^\n]+(?:\n[^\n]+)*)/i;
  const addressMatch = text.match(addressRegex);
  if (addressMatch) {
    extractedData.address = addressMatch[1].trim().replace(/\n+/g, ', ');
  }

  // Extract document number (passport, visa, etc.)
  const docRegex = /(?:Passport|Visa|Document)[\s#:]*([A-Z0-9]+)/i;
  const docMatch = text.match(docRegex);
  if (docMatch) {
    extractedData.documentNumber = docMatch[1];
  }

  console.log("Extracted data:", extractedData);
  return extractedData;
};
