// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const AdminController = require('../Controller/AdminController');
const auth = require("../Middleware/auth");


// Routes
router.post("/login",AdminController.login);
router.post("/signup",AdminController.signup);
router.post("/addProduct",AdminController.addProduct);
router.post("/editProduct",AdminController.editProduct);
router.post("/deleteProduct",AdminController.deleteProducts);
// router.get("/loggedInUser",AdminController.getAdmin);
router.get("/shop/getProducts",AdminController.getProducts);
module.exports = router;