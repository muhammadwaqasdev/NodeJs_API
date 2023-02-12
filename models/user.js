const mongoose = require('mongoose');
const validator = require('validator');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: String,
    }
});
userSchema.plugin(AutoIncrement, {id:'id_seq',inc_field: 'id'});

module.exports = mongoose.model("User", userSchema);