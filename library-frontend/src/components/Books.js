import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
    const [genre, setGenre] = useState(null)
    const result = useQuery(ALL_BOOKS)

    if (!props.show) {
        return null
    }

    const books = result.data.allBooks

    const genres = [...new Set(books.map((b) => b.genres).flat())]

    const booksToShow = books.filter((b) => b.genres.includes(genre))

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {booksToShow.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {genres.map((g) => (
                    <button key={g} onClick={() => setGenre(g)}>
                        {g}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Books
