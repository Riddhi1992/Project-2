// DB Connection, import app.js and start server

const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log(`Database connection error -> ${err.message}`);
});

// require our models here so that it can be accessed throughout the application
require('./Models/Posts');



// require app.js
const app = require('./app');

// start the server on port 3000
const server = app.listen(3000, () => {
    console.log(`Express running at PORT: ${server.address().port}`);
})