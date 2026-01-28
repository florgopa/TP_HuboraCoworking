// aca se configura express

import express from "express";
import cors from "cors";

const app = express(); //crea la app


//middlewares
app.use(cors()); //permite que react se conecte
app.use(express.json()); //permite leer json del body

//ruta de prueba
app.get("/api/test", (req, res) => {
    res.json({ message: "backend is working!" });
});

export default app;