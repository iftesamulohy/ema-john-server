const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6j3ba.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5001;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("order");
  // perform actions on the collection object
  app.post('/addProduct', (req, res) =>{
    const product = req.body;
    console.log(product);
    products.insertMany(product)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })
  app.get('/products',(req,res)=>{
    products.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  app.get('/products/:key',(req,res)=>{
    products.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys',(req,res)=>{
    const productKeys = req.body;
    products.find({key:{$in: productKeys}})
    .toArray((err,documents)=>{
      res.send(documents);
    })

  })

  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })
});


app.listen(process.env.PORT || port);