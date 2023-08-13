import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
    const res1 = useQuery(ALL_BOOKS)
    const res2 = useQuery(ME)
    console.log(res2.data.me)

    if (!props.show) {
        return null
    }

    const books = res1.data.allBooks
    const favoriteGenre = res2.data.me.favoriteGenre
    const booksToShow = books.filter((b) => b.genres.includes(favoriteGenre))

    return (
        <div>
            <h2>recommendations</h2>

            <p>
                books in your favorite genre <strong>{favoriteGenre}</strong>
            </p>

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
        </div>
    )
}

export default Recommendations
