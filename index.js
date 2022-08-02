require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routerEmployees = require('./routes/employees.routes');

app.use(bodyParser.json());

app.use('/employees', routerEmployees);

app.listen(port, () => console.log(`Listening on port ${port}`));
