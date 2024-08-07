const express = require('express');
const path = require('path');
const app = express();

app.get("/" , (req, res) =>{
    res.sendFile(path.join(__dirname+"/index.html"))
})



// Define the directory where your static files (including HTML) are located
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});