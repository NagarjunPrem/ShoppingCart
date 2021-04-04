const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img: { 
        data: Buffer, 
        contentType: String }    
})
// compile
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

