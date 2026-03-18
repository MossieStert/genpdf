import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

/* -------------------------------------------------------
   MERGE PDFs
------------------------------------------------------- */
export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => mergedPdf.addPage(p));
  }

  return await mergedPdf.save();
};

/* -------------------------------------------------------
   PARSE PAGE RANGE (1-based input)
------------------------------------------------------- */
export const parsePageRange = (
  range: string,
  totalPages: number
): number[] => {
  if (!range.trim()) return [];

  const pages = new Set<number>();

  range.split(",").forEach((part) => {
    const trimmed = part.trim();

    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) pages.add(i);
        }
      }
    } else {
      const num = Number(trimmed);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pages.add(num);
      }
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
};

/* -------------------------------------------------------
   SPLIT PDF → MULTIPLE PDFs → ZIP
------------------------------------------------------- */
export const splitPdfToZip = async (
  file: File,
  range: string
): Promise<Blob> => {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);

  const totalPages = pdf.getPageCount();
  const pages = parsePageRange(range, totalPages);

  if (!pages.length) {
    throw new Error("No valid pages selected.");
  }

  const zip = new JSZip();

  for (const pageNum of pages) {
    console.log("Splitting page:", pageNum);

    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [pageNum - 1]); // 1 → 0 based
    newPdf.addPage(page);

    const pdfBytes = await newPdf.save();
    zip.file(`page_${pageNum}.pdf`, pdfBytes);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  console.log("ZIP GENERATED:", zipBlob.size);

  return zipBlob;
};

/* -------------------------------------------------------
   PAGE COUNT
------------------------------------------------------- */
export const getPdfPageCount = async (file: File): Promise<number> => {
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
  } catch (err) {
    console.error("Failed to read PDF page count", err);
    return 0;
  }
};
