const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true},
    price: { type: Number, required: true, validate: { validator: function (v) { return /^[0-9]+$/.test(v)}}},
    categoryId: { type: String, required: true },
    qty: {type: Number, default:0, validate: { validator: function (v) { return /^[0-9]+$/.test(v)}}},
    color: { type: String},
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
},
 { timestamps : true})

module.exports = mongoose.model('product', productSchema);