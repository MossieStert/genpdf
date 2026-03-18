import { PDFDocument } from "pdf-lib";
export const config = {
 maxDuration: 60
};
/* =========================
  LIMITS
========================= */
const MAX_PDF_SIZE_MB = 20;
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
 return {
   pageCount: pages.length
 };
}
/* =========================
  OPENAI CALL
========================= */
async function callOpenAI(prompt: string) {
 const apiKey = process.env.OPENAI_API_KEY;
 if (!apiKey) {
   throw new Error("Missing OPENAI_API_KEY");
 }
 const response = await fetch("https://api.openai.com/v1/chat/completions", {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${apiKey}`
   },
   body: JSON.stringify({
     model: "gpt-4o-mini",
     messages: [
       {
         role: "system",
         content: "You are a helpful assistant that extracts and formats text cleanly."
       },
       {
         role: "user",
         content: prompt
       }
     ]
   })
 });
 if (!response.ok) {
   const err = await response.text();
   throw new Error(`OpenAI error: ${err}`);
 }
 const data = await response.json();
 return data.choices?.[0]?.message?.content;
}
/* =========================
  MAIN HANDLER (VERCEL)
========================= */
export default async function handler(req: any, res: any) {
 if (req.method !== "POST") {
   return res.status(405).json({ error: "Method not allowed" });
 }
 try {
   const { prompt, base64Data } = req.body;
   if (!prompt || !base64Data) {
     return res.status(400).json({
       error: { code: "INVALID_REQUEST", message: "Missing required fields" }
     });
   }
   // Analyze PDF (size + pages)
   const analysis = await analyzePdf(base64Data);
   // 🔥 For now: just send prompt (we'll improve this next)
   const text = await callOpenAI(prompt);
   if (!text) {
     return res.status(502).json({
       error: {
         code: "NO_TEXT_RETURNED",
         message: "No text returned from OpenAI"
       }
     });
   }
   return res.status(200).json({
     text,
     meta: analysis
   });
 } catch (err: any) {
   console.error("❌ OpenAI error:", err.message);
   return res.status(500).json({
     error: {
       code: "OPENAI_ERROR",
       message: err.message
     }
   });
 }
}