const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const bookingsCollection = client
      .db("luxury_suites")
      .collection("bookings");
    // all suites find:
    app.get("/suites", async (req, res) => {
      const query = {};
      const result = suitesCollection.find(query);
      const suites = await result.toArray();
      res.send(suites);
    });
    // Add booking:
    app.post("/bookings", async (req, res) => {
      const bookings = await bookingsCollection.insertOne(req.body);
      res.send(bookings);
      console.log("bookings", bookings);
    });
    app.get("/bookings", async (req, res) => {
      const bookings = await bookingsCollection.find({}).toArray();
      res.send(bookings);
    });
    // app.delete("/bookings/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bookingsCollection.deleteOne(query);
    //   res.json(result);
    // });
    // app.delete("/deleteBooking/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bookingsCollection.deleteOne(query);
    //   res.json(result);
    // });
    // all reviews:
    app.post("/reviews", async (req, res) => {
      const review = await reviewsCollection.insertOne(req.body);
      res.send(review);
    });
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.send(reviews);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Luxury suites are Available");
});
app.listen(port, (req, res) => {
  console.log("Luxury suites", port);
});
