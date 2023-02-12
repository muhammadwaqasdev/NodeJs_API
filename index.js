//initailization Express Server
const express = require('express');
const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//decleared api routes
const user = require('./models/user');


//init MongoDB Expressdelete
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://muhammadwaqasdev:waqads000000@cluster0.sddirdk.mongodb.net/node_api", {useNewUrlParser: true}).then(function(){

    app.get('/', function (req, res) {
        res.json({message: "Welcome to Node.js Api Server with MogoDB Server(Mongoose)"});
    });

    //Auth Apis
    const authRouter = require('./routes/auth');
    app.use("/api", authRouter);

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("Server started at PORT: " + PORT);
});