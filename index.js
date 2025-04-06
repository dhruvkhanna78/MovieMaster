const express = require('express');
const cors = require('cors');
const app = express();
const recommendRoute = require('./routes/recommend');

app.use(cors());
app.use("/recommend", recommendRoute);

app.get("/", (req, res) => {
    res.send("🎬 Welcome to the Movie Recommender!");
});

app.listen(8000, () => {
    console.log("Boom!");
});
