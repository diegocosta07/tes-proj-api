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

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('started server at port:', port);
});