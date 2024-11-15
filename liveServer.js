const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT =8442;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
