const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');

const Product = require('../models/product');
const middleware = require('../middleware/auth_middleware');

router.post("/addProduct", middleware , async function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var product = await Product.find({product_name: req.body.product_name});
            if(product.length > 0){
                res.json({ status: false, message: "Already Exist", statusCode: "404"});
            }else{
                const newProduct = new Product({
                    product_name: req.body.product_name,
                    product_description: req.body.product_description,
                    price: req.body.price,
                    available_qty: req.body.available_qty,
                    status: req.body.status
                });
                await newProduct.save();
                var addedproduct = await Product.find({_id: newProduct._id}, { _id: 0 , __v:0 });
                res.json({ status: true, message: "Product Added Successfully", statusCode: "201" , data: addedproduct[0] });
            }
        }
    });
});

router.get("/getAllProducts", middleware , async function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var product = await Product.find({},{ _id: 0 , __v:0 });
            if(product.length > 0){
                res.json({ status: true, message: "Success", statusCode: "200" , data: product, length: product.length });
            }else{
                res.json({ status: false, message: "Product Not Exist", statusCode: "404" });
            }
        }
    });
});

router.get("/getProducts/:id", middleware , async function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var product = await Product.find({ id: req.params.id },{ _id: 0 , __v:0 });
            if(product.length > 0){
                res.json({ status: true, message: "Success", statusCode: "200" , data: product[0] });
            }else{
                res.json({ status: false, message: "Product Not Exist", statusCode: "404" });
            }
        }
    });
});

router.patch("/updateProduct/:id", middleware, function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var product = await Product.find({id: req.params.id}).exec();
            const updatedproduct = await Product.findOneAndUpdate({_id: product[0]._id},
                {
                    product_name: req.body.product_name,
                    product_description: req.body.product_description,
                    price: req.body.price,
                    available_qty: req.body.available_qty,
                    status: req.body.status
                },
                { new: true }
            );
            if(updatedproduct.product_name === req.body.product_name && updatedproduct.product_description === req.body.product_description && updatedproduct.price === req.body.price && updatedproduct.available_qty == req.body.available_qty && updatedproduct.status === req.body.status) {
                var uu = await Product.find({id: req.params.id},{ _id: 0 , __v:0, password:0}).exec();
                res.json({ status: true, message: "Product Updated Successfully", statusCode: "200", data: uu[0]});
            }else{
                res.json({ status: false, message: "Product Not Updated", statusCode: "400"});
            }
        }
    });
});

router.post("/deleteProduct/:id", middleware, function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ message: err.message, statusCode: 403 });
        }else {
            var product = await Product.deleteOne({id: req.params.id});
            if(product.deletedCount === 1) {
                res.json({ status: true, message: "User deleted Successfully", statusCode: "200"});
            }else{
                res.json({ status: false, message: "User Not Found", statusCode: "400"});
            }
        }
    });
});

module.exports = router;