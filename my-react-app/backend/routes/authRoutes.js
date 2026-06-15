const express = require("express");
const {
    registerUser
} = require("../controllers/authController");
const router = express.Router();
router.post(
  "/",
  createProduct
);
router.post("/register",registerUser);
module.exports =router;