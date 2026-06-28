app.post("/api/extract-pdf", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const text = await extractPdfText(req.file.buffer);

    res.json({
      text
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
