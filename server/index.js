import express from "express";
import "dotenv/config";
import cors from "cors";
import mysql from "mysql2";

const { API_URL } = process.env;

const app = express();
const HOST = "localhost";
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "548610",
  database: "TEST_DB",
});

app.get("/api", (req, res) => {
  conn.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/api/add", (req, res) => {
  const newContact = { ...req.body };

  conn.query("INSERT INTO users SET ?", newContact, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const newContact = { ...req.body };
  conn.query("UPDATE users SET ? WHERE id = ?", [newContact, id], function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  conn.query("DELETE FROM users WHERE id = ?", id, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(API_URL); // → /api/v1
  console.log(`http://${HOST}:${PORT} 서버 구동 중...`);
});

export default app;
