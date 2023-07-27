import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR } from '../queries'

const AuthorForm = ({ setError }) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [changeBorn, result] = useMutation(EDIT_AUTHOR)

    const submit = async (event) => {
        event.preventDefault()

        changeBorn({
            variables: { name, born: Number(born) },
        })

        setName('')
        setBorn('')
    }

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            setError('author not found')
        }
    }, [result.data]) // eslint-disable-line

    return (
        <div>
            <h3>Set birthyear</h3>
            <form onSubmit={submit}>
                <div>
                    name
                    <input
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                </div>
                <div>
                    born
                    <input
                        type='number'
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

const Authors = ({ show, authors, setError }) => {
    if (!show) {
        return null
    }

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AuthorForm setError={setError} />
        </div>
    )
}

export default Authors
