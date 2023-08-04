const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const typeDefs = `
    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }


    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
  }

  type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]!
        ): Book
        
        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author
  }
`

const resolvers = {
    Query: {
        authorCount: async () => Author.collection.countDocuments(),
        bookCount: async () => Book.collection.countDocuments(),
        allAuthors: async () => Author.find({}),
        allBooks: async (root, args) => {
            if (args.author) {
                const author = await Author.findOne({ name: args.author })
                if (args.genre)
                    return await Book.find({
                        author: author,
                        genres: args.genre,
                    }).populate('author')
                return await Book.find({ author: author }).populate('author')
            }

            if (args.genre) {
                return await Book.find({ genres: args.genre }).populate(
                    'author'
                )
            }

            return await Book.find({}).populate('author')
        },
    },
    Author: {
        bookCount: async (root) =>
            await Book.find({ author: root.id }).countDocuments(),
    },
    Mutation: {
        addBook: async (root, args) => {
            let author = await Author.findOne({ name: args.author })

            if (!author) {
                author = new Author({ name: args.author })
                try {
                    await author.save()
                } catch (error) {
                    throw new GraphQLError('Saving author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error,
                        },
                    })
                }
            }

            const book = new Book({
                ...args,
                author: author,
            })

            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error,
                    },
                })
            }

            return book
        },
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo

            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error,
                    },
                })
            }

            return author
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
