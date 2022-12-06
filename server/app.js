const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schema/schema");

const app = express();
const PORT = 4000;

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