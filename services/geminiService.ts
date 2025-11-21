import { GoogleGenAI } from "@google/genai";
import { ToolType } from '../types';

const getPromptForTool = (tool: ToolType): string => {
  switch (tool) {
    case ToolType.TO_MARKDOWN:
      return `Convert this PDF document into well-structured Markdown. 
      - Preserve headers, lists, and tables.
      - Do not include conversational filler (e.g., "Here is the markdown").
      - Just return the raw markdown content.`;
    
    case ToolType.TO_HTML:
      return `Convert this PDF document into semantic HTML5.
      - Use proper tags (<article>, <section>, <h1>, <p>, <table>).
      - Do not include <html>, <head>, or <body> tags, just the body content.
      - Do not include conversational filler.`;

    case ToolType.TO_JSON:
      return `Extract the content of this PDF into a structured JSON object.
      - Identify sections, key-value pairs, and lists.
      - The structure should reflect the document hierarchy.
      - Return ONLY valid JSON.`;

    case ToolType.TO_TEXT:
      return `Extract all text from this PDF document.
      - Preserve paragraph breaks.
      - Remove page numbers and headers/footers if they break the flow.
      - Return plain text only.`;

    case ToolType.OCR_PDF:
      return `Perform Optical Character Recognition (OCR) on this document.
      - Extract all text found in the images or scanned pages.
      - Correct obvious scanning errors (typos due to noise) where possible.
      - Preserve the spatial layout by using newlines and spacing approximately.
      - Return the raw text content.`;

    case ToolType.TO_DOCX:
      return `Convert this PDF document into a detailed HTML format compatible with Microsoft Word.
      - Use inline styles for formatting to ensure it looks like a document.
      - Preserve layout as much as possible (headings, paragraphs, lists, tables).
      - Do not include '\`\`\`html' code blocks, just return the raw HTML content.
      - This content will be saved as a .doc file for the user.`;

    case ToolType.TO_RTF:
      return `Convert this PDF document into valid RTF (Rich Text Format) code.
      - Use standard RTF control words (e.g., \\rtf1, \\par, \\b, \\i).
      - Ensure the document structure (headers, paragraphs) is preserved.
      - Do not include '\`\`\`rtf' code blocks or conversational text.
      - Just return the raw RTF code starting with {\\rtf1.`;

    case ToolType.SUMMARIZE:
      return `Analyze this PDF document and provide a comprehensive summary.
      - Use bullet points for key takeaways.
      - Highlight the main conclusion or purpose of the document.`;

    case ToolType.EXPLAIN:
      return `Explain the content of this PDF document in simple terms (EL15).
      - Break down complex jargon.
      - Focus on the "why" and "how" of the content.
      - Structure it as an easy-to-read guide.`;

    case ToolType.CHAT_PDF:
      return `Analyze the document and generate a comprehensive FAQ (Frequently Asked Questions) section.
      - Simulate a chat experience by anticipating the top 5-10 questions a user might ask about this content.
      - Provide clear, direct answers for each question based solely on the document.
      - Format as Q: [Question] \nA: [Answer]`;

    case ToolType.DOCUMENT_ANALYSIS:
      return `Perform a deep structural and sentiment analysis of this document.
      - Identify the Author's Intent and Target Audience.
      - Analyze the Tone (e.g., formal, persuasive, neutral).
      - Extract Key Arguments, Data Points, or Action Items.
      - Provide a "Strengths" and "Weaknesses" assessment of the content.`;

    default:
      return "Analyze this document.";
  }
};

// Utility to remove markdown code fences (```html ... ```) from the response
const cleanResponseText = (text: string): string => {
  return text.replace(/^```[a-z]*\n?|\n?```$/gi, "").trim();
};

export const processDocument = async (
  base64Data: string, 
  mimeType: string, 
  tool: ToolType
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Using gemini-2.5-flash for speed and large context window which is good for PDFs
  const model = 'gemini-2.5-flash'; 

  try {
    const prompt = getPromptForTool(tool);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        // For JSON tool, we enforce JSON mime type for better structural guarantee
        responseMimeType: tool === ToolType.TO_JSON ? "application/json" : "text/plain",
      }
    });

    const text = response.text || "No content generated.";
    return cleanResponseText(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};