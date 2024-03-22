import express from "express";
import routes from "./routes/index.js";
import { Request,Response } from "express";
const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req:Request, res:Response) => res.send("It's Working..."));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

export default app;

