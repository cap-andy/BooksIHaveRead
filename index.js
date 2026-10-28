import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

async function lookupCoverId(title, author) {
  try {
    const params = new URLSearchParams({
      title,
      author: author || "",
      fields: "cover_i",
      limit: "1",
    });
    const res = await fetch(`https://openlibrary.org/search.json?${params}`);
    const data = await res.json();
    return data.docs?.[0]?.cover_i ?? null;
  } catch (err) {
    console.error("Cover lookup failed:", err);
    return null;
  }
}

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id DESC");
    res.render("index.ejs", { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
});

app.post("/add-book", async (req, res) => {
  const { title, author, genre, published, summary, isbn } = req.body;
  try {
    const coverId = isbn ? null : await lookupCoverId(title, author);
    await db.query(
      "INSERT INTO books (title, author, genre, published, summary, isbn, cover_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, author, genre, published, summary, isbn || null, coverId]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

app.post("/delete-book", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

app.post("/update-book", async (req, res) => {
  const { id, title, author, genre, published, summary, isbn } = req.body;
  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, genre = $3, published = $4, summary = $5, isbn = $6 WHERE id = $7",
      [title, author, genre, published, summary, isbn, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});