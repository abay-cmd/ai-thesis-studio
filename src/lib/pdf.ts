import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  });

  const pdf = await loadingTask.promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");

    text += pageText + "\n";
  }

  return text.trim();
}
