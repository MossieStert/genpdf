import { ToolType } from "../types";

// Correct prompts for each tool.
const PROMPTS: Record<ToolType, string> = {
  TO_TEXT: "Extract all text from this PDF. Return plain text only.",
  TO_HTML: "Convert this PDF into semantic clean HTML5 (body content only).",
  TO_JSON: "Extract structured JSON from this PDF. Output ONLY valid JSON.",
  TO_MARKDOWN: "Convert this PDF to clean Markdown. No extra text.",
  TO_DOCX: "Convert this PDF into HTML compatible with DOCX. No code blocks.",
  TO_RTF: "Convert this PDF into valid RTF. Start with {\\rtf1.",
  OCR_PDF: "You are an OCR engine.This PDF may contain scanned images or non-selectable text.Carefully read ALL visible text from every page, including headings,tables, footers, and paragraphs.Return ONLY the extracted text.Do NOT summarize.Do NOT explain.Do NOT add commentary.",
  SUMMARIZE: "Provide a detailed summary of this document.",
  EXPLAIN: "Explain the document clearly and simply.",
  CHAT_PDF: "Generate a FAQ section based on this document.",
  DOCUMENT_ANALYSIS:
    "Analyze structure, tone, audience, weaknesses, strengths.",

  // Required dummy entries (these do NOT call Gemini)
  MERGE_PDF: "This tool does not use Gemini.",
  SPLIT_PDF: "This tool does not use Gemini."
};


export const processDocument = async (
  base64Data: string,
  mimeType: string,
  tool: ToolType
): Promise<string> => {
  try {
    const prompt = PROMPTS[tool] || "Analyze the document.";

    const response = await fetch("/api/gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        mimeType,
        base64Data
      })
    });

    if (!response.ok) {
      throw new Error("Backend Gemini error: " + response.status);
    }

    const data = await response.json();

    return data?.text || "No content produced.";
  } catch (error: any) {
    console.error("Frontend Gemini error:", error);
    throw error;
  }
};
