
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.get('/name', (req, res) => {
    res.send('Developer Name: Ananthalakshmy R');
});

app.use(cors());
app.use(express.json());



// Backend homepage
app.get("/", (req, res) => {
  res.redirect("https://mern-todo-app-psi-orpin.vercel.app/");
});

// Todo routes
app.use("/api/todos", require("./routes/todoRoutes"));

// Connect database and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });
