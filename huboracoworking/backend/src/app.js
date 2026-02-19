// aca se configura express

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js"; //importa las rutas de auth
import profileRoutes from "./routes/profileRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";


const app = express(); //crea la app


//middlewares
app.use(cors()); //permite que react se conecte
app.use(express.json()); //permite leer json del body
app.use("/api", authRoutes); //usa las rutas de auth
app.use("/api", profileRoutes); //usa las rutas de profile
app.use("/api/reservations", reservationRoutes);



//ruta de prueba
app.get("/api/test", (req, res) => {
    res.json({ message: "backend is working!" });
});

export default app;