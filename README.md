# 🟣 LEXT – Lens + Text  
*A lightweight AI-powered document text extraction tool*

LEXT (Lens + Text) is a 100% client-side web application that allows users to upload personal documents (Aadhar, Visa, etc.), extract key information using OCR (Tesseract.js), and manage saved data—all with secure localStorage handling. It supports image/PDF uploads, field parsing, text-to-speech, and offline use.

---

## 🚀 Features

- 🔐 **Login System** (localStorage-based)
- 📄 **Upload Images/PDFs**
- 🧠 **Client-side OCR using Tesseract.js**
- ✂️ **Auto Field Extraction** (Name, DOB, Aadhar No, etc.)
- 📝 **Editable Fields + Save to localStorage**
- 📂 **View, Edit, Delete Saved Documents**
- 🗣️ **Text-to-Speech** with voice preferences
- 🎨 **Theme Toggle + Gradient Styling**
- 🌙 **Dark/Light Mode Support**
- 📱 **Fully Responsive UI**

---

## 🛠️ Tech Stack

| Tech             | Description                       |
|------------------|-----------------------------------|
| **React.js**     | SPA frontend framework             |
| **Tailwind CSS** | Modern styling & theming           |
| **Tesseract.js** | OCR engine for image/PDF text      |
| **Web Speech API** | Text-to-speech (TTS) support     |
| **pdf.js-dist**  | Render PDF previews                |
| **localStorage** | Client-side state persistence      |

---

## 📁 Folder Structure

lextext/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── SpeakerButton.jsx
│ │ ├── ThemeToggle.jsx
│ │ ├── FileUploadBox.jsx
│ │ └── DocumentCard.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Extract.jsx
│ │ ├── MyDocuments.jsx
│ │ └── Settings.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── utils/
│ ├── ocrUtils.js
│ └── regexParser.js
├── tailwind.config.js
└── README.md


---

## ⚙️ Setup Instructions

1. **Clone the Repo**
```bash
git clone https://github.com/your-username/lext.git
cd lext
npm install
npm run dev
✨ Key Components
Component	Description
FileUploadBox.jsx	Drag/drop or browse image/pdf
SpeakerButton.jsx	Reads text using Web Speech API
ThemeToggle.jsx	Switch between dark/light/gradient
OCRResultViewer.jsx	Displays extracted text
regexParser.js	Extracts structured fields using regex