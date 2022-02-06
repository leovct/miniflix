const express = require("express");
const app = express();
const card = require("./routes/cards");

// Serve static assets and miniflix subscription card route
app.use(express.static("public"));
app.use((_, res, next) => {
    // allow different IP address
    res.setHeader('Access-Control-Allow-Origin', '*');
    // allow different header field
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
    next();
});
app.use("/cards", card);

// Default route
app.get("/", function (_, res) {
    res.send("Welcome to the Miniflix API!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
