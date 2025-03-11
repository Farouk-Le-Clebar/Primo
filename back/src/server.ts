import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
setupSwagger(app);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
