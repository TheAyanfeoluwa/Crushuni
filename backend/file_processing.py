
import pypdf
import docx
import io

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    if filename.lower().endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif filename.lower().endswith('.docx'):
        return extract_text_from_docx(file_content)
    else:
        # Assume text file
        return file_content.decode('utf-8')

def extract_text_from_pdf(file_content: bytes) -> str:
    pdf_file = io.BytesIO(file_content)
    reader = pypdf.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    docx_file = io.BytesIO(file_content)
    doc = docx.Document(docx_file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text
