import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js"
import { ENV_VARS } from "./config/envVars.js"
import { connectDB } from "./config/db.js"
const app = express()
dotenv.config()
app.use(express.json())
const PORT = ENV_VARS.PORT
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/movie", movieRoutes)
app.listen(PORT, () => {
  console.log("Server starting run at http://localhost:" + PORT)
  connectDB()
})
