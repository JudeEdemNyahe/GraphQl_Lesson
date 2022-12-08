const graphql = require("graphql");
const _ = require("lodash");
const Book = require("./../models/book");
const Author = require("./../models/author");
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            },
        },
    }),
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _.filter(books, { authorId: parent.id });
                //returns list of all books written by a particulat author
                return Book.find({ authorId: parent.id });
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db/other source
                //  return _.find(books, { id: args.id });
                return Book.findById(args.id);
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            },
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;

                return Book.find({});
            },
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors;
                return Author.find({});
            },
        },
    },
});

//mutations-allows us to change our data ,adding deleting editing data

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age,
                });

                return author.save();
            },
        },

        //addBook Mutations
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                });

                return book.save();
            },
        },
    },
});

//root query from from frontend will look like this

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});