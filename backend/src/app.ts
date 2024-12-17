import express from "express";
import cors from "cors";
import albumRoutes from "./routes/albumRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", albumRoutes);

export default app;
