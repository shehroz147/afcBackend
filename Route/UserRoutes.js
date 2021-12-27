// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require("../Controller/UserController");
const AdminController = require("../Controller/AdminController");


// Routes
router.post("/login",AdminController.login);
router.post("/signup",UserController.signup);
router.post("/showProducts",UserController.getProducts);

module.exports = router;