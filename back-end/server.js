const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config/keys');
const mongoose = require('mongoose');
//mongoose.connect(config.mongoURI, {useNewUrlParser: true});

mongoose.set('strictQuery', false)
mongoose.connect(config.mongoURI,{
  useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(() => console.log('Connexion à MongoDB échouée'));

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