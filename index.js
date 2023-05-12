const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Boss You Coffe Server is Running Here");
});

app.listen(PORT, () => {
  console.log(`Here is Coffe Hub Server Port : ${PORT}`);
});
