import { PDFDocument } from "pdf-lib";
export const config = {
 maxDuration: 60
};
/* =========================
  LIMITS
========================= */
const MAX_PDF_SIZE_MB = 20;
const MAX_BASE64_SIZE = 18 * 1024 * 1024;
const MAX_OCR_PAGES = 15;
const GEMINI_TIMEOUT = 60000;
const MAX_RETRIES = 2;
/* =========================
  PDF ANALYSIS
========================= */
async function analyzePdf(base64Data: string) {
 const buffer = Buffer.from(base64Data, "base64");
 const sizeMB = buffer.length / (1024 * 1024);
 if (sizeMB > MAX_PDF_SIZE_MB) {
   throw new Error("PDF too large");
 }
 const pdf = await PDFDocument.load(buffer);
 const pages = pdf.getPages();
 let textChars = 0;
 for (const page of pages) {
   const content = (page as any).getContentStream?.();
   if (content) textChars += content.length || 0;
 }
 const isScanned = textChars < 50;
 if (isScanned && pages.length > MAX_OCR_PAGES) {
   throw new Error("Scanned PDF exceeds OCR page limit");
 }
 return {
   pageCount: pages.length,
   isScanned
 };
}
/* =========================
  GEMINI CALL
========================= */
async function callGemini({
 prompt,
 mimeType,
 base64Data
}: {
 prompt: string;
 mimeType: string;
 base64Data: string;
}) {
 const apiKey = process.env.GEMINI_API_KEY;
 if (!apiKey) {
   throw new Error("Missing GEMINI_API_KEY");
 }
 if (base64Data.length > MAX_BASE64_SIZE) {
   throw new Error("PDF too large for Gemini processing");
 }
 const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
 const payload = {
   contents: [
     {
       role: "user",
       parts: [
         { text: "Say Hello" }
         //{ inlineData: { mimeType, data: base64Data } },
         //{ text: prompt }
       ]
     }
   ]
 };
 for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT);
   try {
     console.log(`🤖 Gemini attempt ${attempt}`);
     const response = await fetch(url, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload),
       signal: controller.signal
     });
     clearTimeout(timeout);
     if (!response.ok) {
       const errText = await response.text();
       throw new Error(`Gemini HTTP ${response.status}: ${errText}`);
     }
     return await response.json();
   } catch (err: any) {
     clearTimeout(timeout);
     console.warn(`⚠️ Gemini attempt ${attempt} failed:`, err.message);
     if (attempt === MAX_RETRIES) throw err;
     await new Promise(r => setTimeout(r, 1500));
   }
 }
}
/* =========================
  MAIN HANDLER (VERCEL)
========================= */
export default async function handler(req: any, res: any) {

  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
  console.log("API KEY START:", process.env.GEMINI_API_KEY?.slice(0, 5));

  if (req.method !== "POST") {
   return res.status(405).json({ error: "Method not allowed" });
 }
 const start = Date.now();
 try {
   const { prompt, mimeType, base64Data } = req.body;
   if (!prompt || !mimeType || !base64Data) {
     return res.status(400).json({
       error: { code: "INVALID_REQUEST", message: "Missing required fields" }
     });
   }
   // 🔍 Analyze PDF
   const analysis = await analyzePdf(base64Data);
   console.log("📄 PDF analysis:", analysis);
   const data = await callGemini({ prompt, mimeType, base64Data });
   const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
   if (!text) {
     return res.status(502).json({
       error: {
         code: "NO_TEXT_RETURNED",
         message: "No text returned from Gemini"
       }
     });
   }
   console.log(`✅ Gemini success (${Date.now() - start}ms)`);
   return res.status(200).json({
     text,
     meta: analysis
   });
 } catch (err: any) {
   console.error("❌ Gemini error:", err.message);
   const code =
     err.message.includes("too large") ? "PDF_TOO_LARGE" :
     err.message.includes("OCR") ? "OCR_LIMIT_EXCEEDED" :
     err.message.includes("timeout") ? "GEMINI_TIMEOUT" :
     "GEMINI_ERROR";
   return res.status(500).json({
     error: {
       code,
       message: err.message
     }
   });
 }
}