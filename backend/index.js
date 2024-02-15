const express = require('express');

const app = express();

//Constants
const PORT  = process.env.PORT || 3000;

//Routes
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to ChatApp with MERN!"
    });
});

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});