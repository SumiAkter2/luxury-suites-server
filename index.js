const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c2jlaov.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const suitesCollection = client.db("luxury_suites").collection("suites");
    const reviewsCollection = client.db("luxury_suites").collection("reviews");
    // all suites find:
    app.get("/suites", async (req, res) => {
      const query = {};
      const result = suitesCollection.find(query);
      const suites = await result.toArray();
      res.send(suites);
    });
    // all reviews:
    app.post("/reviews", async (req, res) => {
      const result = reviewsCollection.insertOne(req.body);
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Luxury suites");
});
app.listen(port, (req, res) => {
  console.log("Luxury suites", port);
});
