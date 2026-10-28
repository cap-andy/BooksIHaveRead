import express from "express";
import pg from "pg";

const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "240307",
  port: 5433,
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res)=>{
    res.render('index.ejs');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});