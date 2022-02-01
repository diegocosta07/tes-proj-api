const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(routes);

app.listen(9090, '0.0.0.0', () => {
  console.log('started server at port:', 9090);
});