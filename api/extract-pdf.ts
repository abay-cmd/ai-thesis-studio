app.post("/api/extract-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);

    res.json({
      text: pdfData.text,
    });
  } catch (error: any) {
    console.error("PDF Extraction error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});
