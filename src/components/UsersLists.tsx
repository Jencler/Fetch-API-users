import { SortBy, type User } from "../interfaces/user.interfaces"

interface Props {
    users: User[]
    showColor: boolean
    handleDelete : (email:string) => void
    changeSorting : (sort:SortBy) => void
}

export const UsersLists = ({ users, showColor,handleDelete,changeSorting }: Props) => {

    return (
        <table className="table">
            <thead className="thead">
                <tr>
                    <td>Foto</td>
                    <td className="pointer" onClick={()=>changeSorting(SortBy.NAME)}>Nombre</td>
                    <td className="pointer" onClick={()=> changeSorting(SortBy.LAST)}>Apellido</td>
                    <td className="pointer" onClick={()=> changeSorting(SortBy.COUNTRY)}>País</td>
                    <td >Acciones</td>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user, index) => {

                        const backgroundColor = index % 2 === 0 ? "#333" : "rgba(174, 0, 255, 0.283)"

                        const color = showColor ? backgroundColor : 'transparent'

                        return (
                            <tr style={{background: color}} key={user.email}>
                                <td>
                                    <img className="avatar" src={user.picture.thumbnail} alt={user.name.first} />
                                </td>
                                <td>
                                    {user.name.first}
                                </td>
                                <td>
                                    {user.name.last}
                                </td>
                                <td>
                                    {user.location.country}
                                </td>
                                <td>
                                    <button onClick={()=> handleDelete(user.email)} className="delete">Eliminar</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

// table thead tbody 
// tr td
