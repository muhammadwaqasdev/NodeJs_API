const express = require('express');
const router = express.Router();
var md5 = require('md5');
var jwt = require('jsonwebtoken');

const User = require('./../models/user');
const middleware = require('./../middleware/auth_middleware');

router.post("/login", async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var user = await User.find({ email: email, password: md5(password)},{ _id: 0 , __v:0, password:0});

    if(user.length > 0){
        const token = jwt.sign({user}, 'secret', {expiresIn: 604800});
        user[0].token = token;
        res.json({ status: true, message: "Congratulation", statusCode: "202" , data: user[0] });
    }else{
    res.json({ status: false, message: "Invalid Credentials", statusCode: "404" });
    }
});

router.post("/signup", async function(req, res) {
    var users = await User.find({email: req.body.email});
    if(users.length > 0){
    res.json({ status: false, message: "Already Exist", statusCode: "404"});
    }else{
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password),
        phone: req.body.phone
    });
    await newUser.save();
    const response = await User.find({email: req.body.email},{ _id: 0 , __v:0, password:0});
    const token = jwt.sign({response}, 'secret', {expiresIn: 604800});
    response[0].token = token;
    res.json({ status: true, message: "New User Created Successfully", statusCode: "201" , data: response[0] });
}
});

router.get("/getAllUsers", middleware , async function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var users = await User.find({},{ _id: 0 , __v:0, password:0});
            res.json({ status: true, message: "Success", statusCode: "200" , data: users, length: users.length });
        }
    });
});

router.patch("/updateUser/:id", middleware, function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ status: false, message: err.message, statusCode: 403 });
        }else {
            var user = await User.find({id: req.params.id}).exec();
            const updateduser = await User.findOneAndUpdate({_id: user[0]._id},
                {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone
                },
                { new: true }
            );
            if(updateduser.name === req.body.name && updateduser.email === req.body.email && updateduser.phone === req.body.phone) {
                var uu = await User.find({id: req.params.id},{ _id: 0 , __v:0, password:0}).exec();
                res.json({ status: true, message: "User Updated Successfully", statusCode: "200", data: uu[0]});
            }else{
                res.json({ status: false, message: "User Not Updated", statusCode: "400"});
            }
        }
    });
});

router.post("/deleteUser/:id", middleware, function(req, res) {
    jwt.verify(req.token, 'secret', async (err,authData) => {
        if(err) {
            res.json({ message: err.message, statusCode: 403 });
        }else {
            var user = await User.deleteOne({id: req.params.id});
            if(user.deletedCount === 1) {
                res.json({ status: true, message: "User deleted Successfully", statusCode: "200"});
            }else{
                res.json({ status: false, message: "User Not Found", statusCode: "400"});
            }
        }
    });
});

module.exports = router;