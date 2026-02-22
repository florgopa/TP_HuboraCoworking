import dotenv from "dotenv";
import app from "./app.js";
import "dotenv/config";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});