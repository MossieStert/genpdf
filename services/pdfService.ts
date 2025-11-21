import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

export const parsePageRange = (range: string, totalPages: number): number[] => {
  const pagesToKeep = new Set<number>();
  
  if (!range || !range.trim()) return [];

  const parts = range.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      
      if (!isNaN(start) && !isNaN(end)) {
        const lower = Math.min(start, end);
        const upper = Math.max(start, end);
        
        for (let i = lower; i <= upper; i++) {
          if (i >= 1 && i <= totalPages) {
            pagesToKeep.add(i);
          }
        }
      }
    } else {
      const pageNum = parseInt(part);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pagesToKeep.add(pageNum);
      }
    }
  }

  return Array.from(pagesToKeep).sort((a, b) => a - b);
};

export const splitPdf = async (file: File, range: string): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();
  
  const pages1Based = parsePageRange(range, totalPages);

  if (pages1Based.length === 0) {
    throw new Error("No valid pages selected for splitting. Check your page ranges.");
  }
  
  // Convert 1-based to 0-based indices for pdf-lib
  const sortedIndices = pages1Based.map(p => p - 1);

  const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error("Error getting PDF page count:", error);
    return 0;
  }
};