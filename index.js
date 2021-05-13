const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT ||5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('This is server site of stationary')
})
//--------Mongodb--------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ier7s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error',err);

//  ---------- Product collection ------

const productCollection = client.db("stationary").collection("product");

app.post('/admin', (req, res) => {
    const newProduct = req.body;
    console.log('Adding new product',newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
        console.log('Inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
  })

});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })