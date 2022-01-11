// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require("../Controller/UserController");
const AdminController = require("../Controller/AdminController");
const User = require("../Model/User");


// Routes
router.post("/login",AdminController.login);
router.post("/signup",UserController.signup);
router.get("/getProduct",UserController.getProduct);
router.get("/getProductByCategory",UserController.getProductsByCategory);

module.exports = router;