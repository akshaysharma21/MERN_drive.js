const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); //get the environment variables from the .env file

const app = express();  //create our express app
const port = process.env.PORT || 5000; //use the port from the env variables or set it to 5000 if it's not there

app.use(cors()); //use cors middleware
app.use(express.json()); //server sends and recieves json hence express.json helps us parse json

const uri = process.env.ATLAS_URI; //get the mongoDb atlas connection string from the env
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDb connection established successfully.");
})


//get the request routers.
const usersRouter = require('./routes/Users');
const imagesRouter = require('./routes/Images');

app.use('/users', usersRouter);
app.use('/images', imagesRouter);

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
})
