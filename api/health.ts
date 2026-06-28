export default function handler(req: any, res: any) {
  res.status(200).json({
    status: "ok",
    message: "AI Thesis Studio API is running"
  });
}
