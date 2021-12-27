// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const ProductController = require('../Controller/ProductController');



// Routes

router.post("/addProduct",ProductController.addProduct);

module.exports = router;