const mongoose = require('mongoose');
const validator = require('validator');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = mongoose.Schema({
    id: {
        type: Number
    },
    product_name: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    available_qty: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});
productSchema.plugin(AutoIncrement, {id:'prod_id',inc_field: 'id'});

module.exports = mongoose.model("Product", productSchema);