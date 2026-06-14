const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes =
require("./routes/authRoutes");
const app = express();

app.use(cors());

app.use(express.json());
app.use(
  "/api/auth",
  authRoutes
);
app.get("/", (req, res) => {
  res.send("Subal Pharma Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});