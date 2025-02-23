const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const colors = require('colors');
require('dotenv').config();
const dbConnect = require("./config/dbConnect");

const app = express();


//middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));


dbConnect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`.bgYellow);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB. Server not started.", error);
    });
