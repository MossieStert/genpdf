import { PDFDocument } from "pdf-lib";

/**
 * Detects whether a PDF has extractable text
 * Returns: { hasText: boolean, pageCount: number }
 */
export async function detectPdfText(buffer) {
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();

  let hasText = false;

  for (const page of pages) {
    const contentStream = page.node.Contents();
    if (contentStream) {
      hasText = true;
      break;
    }
  }

  return {
    hasText,
    pageCount: pages.length
  };
}
