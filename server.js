// @ts-nocheck
const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb atlas connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('db connected');
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




app.get('/', (req, res)=>{
    res.send("HELLO WORLD!")
});


// port
app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})