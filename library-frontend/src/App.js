import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient } from '@apollo/client'

import { ALL_AUTHORS } from './queries'

const App = () => {
    const [token, setToken] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [page, setPage] = useState('authors')

    const result = useQuery(ALL_AUTHORS)

    const client = useApolloClient()

    if (result.loading) {
        return <div>loading...</div>
    }

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token ? (
                    <>
                        <button onClick={() => setPage('add')}>add book</button>
                        <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <button onClick={() => setPage('login')}>login</button>
                )}
            </div>

            <LoginForm
                show={page === 'login'}
                setToken={setToken}
                setError={notify}
                setPage={setPage}
            />

            <Authors
                show={page === 'authors'}
                token={token}
                authors={result.data.allAuthors}
                setError={notify}
            />

            <Books show={page === 'books'} />

            <NewBook show={page === 'add'} setError={notify} />
        </div>
    )
}

const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
        return null
    }
    return <div style={{ color: 'red' }}>{errorMessage}</div>
}

export default App
