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


async function run() {
    try {
      await client.connect();
      const incubatorCollection = client.db("IncubatorApp").collection("data");

      const data = {name : "Topu", mail: "abc@gmail.com"}
      const result = await incubatorCollection.insertOne(data);
console.log(`user inserted with ${result.insertedId}`);      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("HELLO WORLD!")
});


// port
app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})