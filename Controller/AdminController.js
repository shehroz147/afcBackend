const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const env         = require('dotenv').config();

// Models
const User = require("../Model/User");
const Product = require("../Model/Product");

// Constants

// Helpers
const UserHelper = require("../Helper/UserHelper");
const ProductHelper = require("../Helper/ProductHelper");
const ResponseHelper = require("../Helper/ResponseHelper");


// exports.login = async (req, res, next) => {
//     let request = req.body;
//     if (!(request.email && request.password)) {
//         return res.status(400).json("Missing Email or Password");
//     }
//     let admin = await UserHelper.foundUserByEmail(request.email.toLowerCase());
//     if (admin == null) {
//         return res.status(400).json("Email does not exist");
//     }
//     bcrypt.compare(request.password, admin.password, (err, result) => {
//         if (err) {
//             return res.status(400).json("Wrong Password");
//         }
//         if (result) {
//             const token = jwt.sign(
//                 {
//                     email: request.email,
//                 },
//                 process.env.JWT_SECRET,
//                 {
//                     expiresIn: "12h"
//                 });

//             let result = {
//                 email: request.email,
//                 profileImage: admin.profileImage,
//                 token:token
//             }
//             // Only For Login API
//             return res.status(200).json("Logged in as Admin",result);
//         }
//     });
//     return res.status(400).json("Something went wrong");
// }

exports.signup = async (req, res, next) => {
    //Signup function to add a new user  when the user provides required info
    let request = req.body;
    //checking required info
    if (!request.email || !request.password) {
        return res.status(400).json("Missing Email or Password");
    }
    //checking if the email entered by user already exists or not
    let modelUser = await UserHelper.foundUserByEmail(request.email.toLowerCase());
    if (!(modelUser == null)) {
        return res.status(400).json("User already exist with this email");
    }
    let token = await UserHelper.tokenCreater(request.email);
    let password = await UserHelper.bcryptPassword(request.password);
    //adding user to database
    let user = await UserHelper.createAdmin(request.email.toLowerCase(), password,'admin',token);
    return res.status(200).json("Admin successfully created");
};

exports.addProduct = async (req,res)=>{
    let request = req.body;
    const name = request.name;
    const category = request.category;
    const price = request.price;
    const picture =request.picture;
    console.log(name," ",category," ",price," ",picture);
    if(!name || !category || !price || !picture ){
            return res.status(400).json("Missing credentials");
    }
       let result = await ProductHelper.addProduct(name,category,price,picture);
        return res.status(200).json("Product successfully added");
};

exports.editProduct = async (req, res, next) =>{


    let request = req.body;
    if (!request._id){
        return res.status(400).json("Missing Product Id");
    }
    let findProduct = await Product.findById({_id:request._id});
    if (findProduct === null) {
        return res.status(400).json("Missing Product");
    }
    let result = await ProductHelper.updatingProduct(findProduct, request, res);
    return res.status(200).json("Product Updated");
};

exports.deleteProducts = async (req, res, next) => {
    let request = req.body;
    let result="";
    const productId = request._id;
    await Product.deleteOne({_id:productId}).exec().then(docs => {
        result = docs;
    })
.catch(err => {
        res.status(500).json({
            error: err
        });
    });
    return res.status(200).json("Product Deleted");
};
// export const deleteProduct = async (req, res, next) => {
//     try {
//         const productId = req.params.id;
//
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product don't found" });
//         }
//
//         const deletedProduct = await Product.findOneAndDelete({ _id: productId });
//
//         deleteFile(product.imageUrl);
//
//         res.status(200).json({ message: "product Deleted Successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong deleteProduct" });
//         console.log(e);
//     }
// };
// export const getAllOrders = async (req, res, next) => {
//     try {
//         let orders = await Order.find({ }).sort({"createdAt":-1})
//             //  const test =   orders.map((x)=>{
//             //    console.log(x.total)
//             //       x.products?.map((x)=>{
//
//             //        const id = x._id
//             //       x['test'] = 'test'
//             //       console.log(x)
//
//
//             //       })
//             //     })
//             // .sort({ createdAt: -1 })
//             //  .populate("productId");
//
//
//
//             .populate(
//                 'products.productId',
//
//
//             ).
//             populate('userId')
//
//
//         console.log(orders)
//
//         res.status(200).json({ data: orders });
//     } catch (e) {
//         res
//             .status(500)
//             .json({ message: "something went wrong getting All Orders" });
//         console.log(e);
//     }
// };
//
// export const orderStatus = async (req, res, next) => {
//     try {
//         const order = await Order.findById({
//             _id: req.params.id,
//         });
//         if (!order) {
//             return res.status(200).json({ message: "Order Don't find" });
//         }
//
//         order.status = req.body.status;
//
//         await order.save();
//         res.status(200).json({ message: "order status edited successfully" });
//     } catch (e) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(e);
//     }
// };
//
// export const deleteOrder = async (req, res, next) => {
//     try {
//         const order = await Order.findById({ _id: req.params.id });
//         order.delete = 1;
//         await order.save();
//         if (!order) {
//             return res.status(200).json({ message: "no such order exist" });
//         }
//         res.status(200).json({ message: "order deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "something went wrong Changing " });
//         console.log(err);
//     }
// };


exports.login = async (req, res, next) => {
    let request = req.body;
    //let response = ResponseHelper.getDefaultResponse();

    if(!request.email || !request.password)
    {
        return res.status(400).json("Missing Email or Password")
    }
    let user = await UserHelper.foundUserByEmail(request.email);
    if(user==null) 
    {
        return res.status(400).json("User does not exist")
    }

    // let name = await UserHelper.getUserName(user);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) 
        {
            return res.status(400).json("Wrong Password")
        }
        if (result) 
        {

            let data = {
                email   : user.email,
                userId  : user._id,
                role    : user.role,
            };
            
            // Object.assign(user, {name:name});
            let optional = {};

            if(!request.rememberMe)
                optional['expiresIn'] = "24h";

            const token = jwt.sign(data, process.env.JWT_SECRET, optional);
            
            Object.assign(user);
            
            let result = {
                _id     : user._id,
                role    : user.role,
                email   : user.email,
                profileImage : user.profileImage,
            }
            let response = ResponseHelper.setResponse(200,"Success",result);
            response.token = token; 
            response.currentUser = user._id;
            return res.status(200).json(response);
        }
        return res.status(400).json("Invalid Password")
    });
};

exports.getProducts = async(req,res)=>{
    let request = req.body;
    let findProducts = await ProductHelper.getProducts();
    if(findProducts==null){
        return res.status(400).json("No Products");
    }
    return res.status(200).json(findProducts);
};

exports.getAdmin = async(req,res)=>{
    let request = req.body;
}