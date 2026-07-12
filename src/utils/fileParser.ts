/**
 * Helper to dynamically load external scripts.
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/**
 * Extracts text from a PDF File using PDF.js loaded dynamically from CDN.
 */
async function parsePDF(file: File, onProgress?: (pct: number) => void): Promise<string> {
  onProgress?.(10);
  // Load PDF.js from cdnjs
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  onProgress?.(30);

  const pdfjsLib = (window as any).pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(50);

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  onProgress?.(70);

  let fullText = "";
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n\n";
    onProgress?.(Math.min(70 + Math.round((i / numPages) * 25), 95));
  }

  onProgress?.(100);
  return fullText.trim();
}

/**
 * Extracts text from a DOCX File using Mammoth.js loaded dynamically from CDN.
 */
async function parseDOCX(file: File, onProgress?: (pct: number) => void): Promise<string> {
  onProgress?.(15);
  // Load Mammoth.js from cdnjs
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
  onProgress?.(40);

  const mammoth = (window as any).mammoth;
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(70);

  const result = await mammoth.extractRawText({ arrayBuffer });
  onProgress?.(100);
  return result.value.trim();
}

/**
 * Extracts text from a plain TXT file.
 */
function parseTXT(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      onProgress?.(100);
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.readAsText(file);
  });
}

/**
 * Main parse function that routes to appropriate parser based on file type.
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const fileType = file.name.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "pdf":
      return parsePDF(file, onProgress);
    case "docx":
      return parseDOCX(file, onProgress);
    case "txt":
      return parseTXT(file, onProgress);
    default:
      throw new Error("Unsupported file format. Please upload PDF, DOCX, or plain text (TXT).");
  }
}
