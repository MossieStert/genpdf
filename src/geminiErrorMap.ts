export const geminiErrorMap: Record<
  string,
  {
    title: string;
    message: string;
    action?: string;
  }
> = {
  PDF_TOO_LARGE: {
    title: "PDF too large",
    message:
      "This PDF is too large to process safely. Large files may exceed AI limits.",
    action: "Try compressing the PDF or uploading fewer pages.",
  },

  OCR_LIMIT_EXCEEDED: {
    title: "Scanned PDF limit exceeded",
    message:
      "This appears to be a scanned PDF with too many pages for OCR processing.",
    action: "Split the PDF or select fewer pages.",
  },

  GEMINI_TIMEOUT: {
    title: "Processing timed out",
    message:
      "The AI took too long to process this document.",
    action: "Try again, or upload a smaller PDF.",
  },

  NO_TEXT_RETURNED: {
    title: "No text detected",
    message:
      "No readable text was found in this PDF.",
    action: "If this is a scanned document, try OCR or a clearer file.",
  },

  INVALID_RANGE: {
    title: "Invalid page range",
    message:
      "The page range you entered is not valid.",
    action: "Use a format like 1-3,5,7.",
  },

  GEMINI_ERROR: {
    title: "AI processing error",
    message:
      "An unexpected error occurred while processing your document.",
    action: "Please try again in a moment.",
  },

  DEFAULT: {
    title: "Processing failed",
    message:
      "Something went wrong while processing your document.",
    action: "Try again or upload a different PDF.",
  },
};
