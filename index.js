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
  res.send("Boss You coffes Server is Running Here");
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
    const coffesCollection = client.db("coffedb").collection("coffe");

    app.get("/coffes", async (req, res) => {
      const cursor = coffesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };

      const result = await coffesCollection.findOne(query);

      res.send(result);
    });
    app.put("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffe = req.body;
      console.log(id, filter, options, updateCoffe);
      const coffes = {
        $set: {
          name: updateCoffe.name,
          supplierName: updateCoffe.supplierName,
          category: updateCoffe.category,
          chef: updateCoffe.chef,
          taste: updateCoffe.taste,
          details: updateCoffe.details,
          photoUrl: updateCoffe.photoUrl,
        },
      };

      const result = await coffesCollection.updateOne(filter, coffes, options);
      console.log(result);
      res.send(result);
    });
    app.delete("/coffes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffesCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/coffes", async (req, res) => {
      const data = req.body;
      console.log(data);
      const collection = await coffesCollection.insertOne(data);
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
  console.log(`Here is coffes Hub Server Port : ${PORT}`);
});
