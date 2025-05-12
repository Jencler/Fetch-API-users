import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { SortBy, type User } from './interfaces/user.interfaces'
import { UsersLists } from './components/UsersLists'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColor, setShowColor] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [search, setSearch] = useState<string | null>(null)

  const handleSearch = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }

  // Para guardar un valor  que queremos que se comparta
  // entre renderizados pero que al cambiar no vuelva a renderizar
  // en componente

  const originalUsers = useRef<User[]>([])

  const toogleShowColor = () => {
    setShowColor(!showColor)
  }

  const toogleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.email !== email))
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (value : SortBy)=>{
    setSorting(value)
  }

  const API_URL = "https://randomuser.me/api/?results=50"

  useEffect(() => {
    fetch(API_URL)
      .then(resp => resp.json())
      .then(data => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
      .catch((error) => console.log(error))

  }, [])


  const filterUsers = useMemo(() => {
    return search !== null && search.length > 0 ?
      users.filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
      : users
  }, [users, search])

  const sortedUsers = useMemo(() => {

    if(sorting === SortBy.NONE) return filterUsers

    const compareProperties : Record<string, (user:User)=> any> = {
      [SortBy.COUNTRY] : user => user.location.country,
      [SortBy.NAME] : user => user.name.first,
      [SortBy.LAST] : user => user.name.last,
    }

    return filterUsers.toSorted((a,b)=>{
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filterUsers, sorting])



  return (
    <main className='main'>
      <h1 className='title-app'>Fetch Users</h1>
      <header className='header'>
        <button
          style={{
            background: showColor ?
              "rgba(174, 0, 255, 0.283)" : ""
          }
          }
          onClick={toogleShowColor}>
          Colorear filas
        </button>
        <button
          style={{
            background: sorting === SortBy.COUNTRY ?
              "rgba(174, 0, 255, 0.283)" : ""
          }
          }
          onClick={toogleSortByCountry}>
          {sorting === SortBy.COUNTRY ? "Quitar filtro" : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>
          Resetear la data
        </button>


        <input placeholder='New Zealand, Australia, ...' value={search ? search : ""} onChange={handleSearch} type="text" />

      </header>
      <UsersLists changeSorting={handleChangeSort} users={sortedUsers} showColor={showColor} handleDelete={handleDelete} />
    </main>
  )
}

export default App
