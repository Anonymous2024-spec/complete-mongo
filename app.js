const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app & middleware
const app = express();
app.use(express.json());

// bd connect
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes
app.get("/books", async (req, res) => {
  // current page
  const page = req.query.p || 0;
  const booksPerPage = 3;

  try {
    let books = [];
    const cursor = db
      .collection("books")
      .find()
      .sort({ author: 1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage);

    await cursor.forEach((book) => books.push(book));

    res.status(200).json(books); // ✅ Only one response
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the documents" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the document" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});

app.delete("/book/: id", (res, req) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(5000).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document" });
  }
});

app.patch("/book/: id", (res, req) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(5000).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document" });
  }
});
