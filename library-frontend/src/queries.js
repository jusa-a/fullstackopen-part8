import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            genres
            author {
                name
                born
            }
            published
            id
        }
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook(
        $title: String!
        $published: Int!
        $author: String!
        $genres: [String!]!
    ) {
        addBook(
            title: $title
            published: $published
            author: $author
            genres: $genres
        ) {
            title
            published
            author {
                name
                born
            }
            genres
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $born: Int!) {
        editAuthor(name: $name, setBornTo: $born) {
            name
            born
            id
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
