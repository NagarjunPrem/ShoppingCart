const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    category: {
        type: String,
        lowercase: false,
        enum: ['fruit', 'vegetable', 'diary']
    },
    img: { 
        data: Buffer, 
        contentType: String }    
})
// compile
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

