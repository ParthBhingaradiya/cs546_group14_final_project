const express = require('express');
const app = express();
const configRoutes = require('./routes');
app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  let i = 3; 
  console.log('Your routes will be running on http://localhost:3000');
});