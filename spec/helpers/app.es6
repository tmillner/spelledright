const express = require('express');
const app = express();
const PORT = 3002;
app.PORT = PORT;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('spec/helpers/'));

app.get('/', (req, res) => {
  res.send("Welcome to the test server. Navigate to the appropriate file.");
});

app.listen(PORT, () => {
  console.log('I\'m listenningggg... ');
});

export {app};
