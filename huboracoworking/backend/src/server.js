//aca se configura el servidor
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config(); //carga variables desde .env

const PORT = process.env.PORT || 3000; //"usa el puerto del .env, si no existe usa 3000"

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// enciende el backend
// queda esperando requests
// muestra un mensaje en consola