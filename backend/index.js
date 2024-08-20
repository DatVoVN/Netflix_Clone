import express from "express"

const app = express()
app.get("/", (req, res) => {
  res.status(200).send("Hello World")
})
app.listen(5000, () => {
  console.log("Server starting run at http://localhost:5000")
})
