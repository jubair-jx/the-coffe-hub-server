const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Boss You Coffe Server is Running Here");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udnr6tc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//mongodb function
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeCollection = client.db("coffedb").collection("coffe");

    app.get("/coffe", async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/coffe", async (req, res) => {
      const data = req.body;
      console.log(data);
      const collection = await coffeCollection.insertOne(data);
      res.send(collection);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch {}
}
run().catch(console.dir);

//server port
app.listen(PORT, () => {
  console.log(`Here is Coffe Hub Server Port : ${PORT}`);
});
