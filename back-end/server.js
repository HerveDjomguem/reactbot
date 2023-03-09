const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
     );
    res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, PUT, OPTIONS'
    );
    next();
  });
  
require('./routes/dialogFlowRoutes')(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT);