import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/connectDb.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app = express();

const port = process.env.PORT;
const db_url = process.env.DB_URL;

// Middleware
app.use(cors());

//Database Connection
connectDb(db_url);

//JSON
app.use(express.json());

//Load Routes
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
