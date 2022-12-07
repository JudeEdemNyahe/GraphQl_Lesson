const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // retrieving protected variables from config file
const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

mongoose.connect(process.env.CONNECTION_STRING);
mongoose.connection.once("open", () => {
    console.log("connected to database");
});
//fires when ever our endpoint starts with 'graphql'
app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(PORT, () => {
    console.log(`Server listening for request on port ${PORT}`);
});