const mongoose = require('mongoose');
const Product = require('./models/product');  // model

// connect to Mongoose
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// const p = new Product({
//     name: 'Ruby Grape',
//     price: 1.99,
//     category: 'fruit'
// })
// p.save().then(p => {
//     console.log(p)
// })
// .catch(e => {
//     console.log(e)
// })

const seedProducts = [
    {
       name: 'Ruby Grape',
       price: 1.99,
       category: 'fruit'
    },
    {
        name: 'Apple',
        price: 2.99,
        category: 'fruit'
     },
     {
        name: 'Mango',
        price: 4.99,
        category: 'fruit'
     },
     {
        name: 'Carrot',
        price: 1.99,
        category: 'vegetable'
     }
]

Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})