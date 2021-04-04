const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const GridFS = require('gridfs');
var fs = require('fs');
var formidable = require('formidable');
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017/';

const Schema = mongoose.Schema;




const Product = require('./models/product');

const Image = require('./models/img');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
   
    app.post('/products', function (req, res){
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
          if (err) {
            next(err);
            return;
          }
          var a = new Image;

          for (const file of Object.entries(files)) {
            a.img.data = fs.readFileSync(file[1].path);
            a.img.contentType = file[1].type;
            a.save(function (err, a) {
                if (err) throw err;
      
                console.error('saved img to mongo');
             });
          }


          // res.json({ fields, files });
        });
    })

 const a = '606a30a6f0edab37e076aa42'

app.get('/mongo-image', function (req, res, next) {
    Image.findById(a, function (err, doc) {
      if (err) return next(err);
      res.contentType(doc.img.contentType);
      res.send(doc.img.data);
    });
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


const categories = ['fruit', 'vegetable', 'dairy', 'pastries'];



app.get('/products', async (req, res)=> {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(req.body)    
    //res.send('Making your product')   
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit',  { product, categories })
})

app.put('/products/:id', async(req, res) =>{
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(req.body);
    //res.send('PUT!!!');
    res.redirect('/products/${product._id}');
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

  
  
app.get("/mongo-video", function (req, res) {
    mongodb.MongoClient.connect(url, { useUnifiedTopology: true }, function (error, client) {
      if (error) {
        res.status(500).json(error);
        return;
      }
  
      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires Range header");
      }
  
      const db = client.db('farmStand');
      // GridFS Collection
      db.collection('fs.files').findOne({}, (err, video) => {
        if (!video) {
          res.status(404).send("No video uploaded!");
          return;
        }
  
        // Create response headers
        const videoSize = video.length;
        const start = Number(range.replace(/\D/g, ""));
        const end = videoSize - 1;
  
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };
  
        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);
  
        const bucket = new mongodb.GridFSBucket(db);
        //Check out your own file name stored in db
        const downloadStream = bucket.openDownloadStreamByName('MrBean.mp4', {
          start
        });
  
        // Finally pipe video to response
        downloadStream.pipe(res);
      });
    });
  });
  

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!!")
})