import { useCallback, useEffect, useState } from 'react'
import { Home } from './components/home/home'
import { CreateAccount } from './components/create_account/create_account'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material'

import './App.css'
import { Login } from './components/login/login'
import { CONFIG } from './config'
import { Main } from './components/main/main'

const theme = createTheme({})
theme.palette.pink = theme.palette.augmentColor({ color: { main: '#E94057' } })
theme.palette.white = theme.palette.augmentColor({ color: { main: '#FFFFFF' } })
theme.palette.purple = theme.palette.augmentColor({
  color: { main: '#8A2387' }
})
theme.palette.gray = theme.palette.augmentColor({ color: { main: '#949494' } })
theme.palette.transparent = theme.palette.augmentColor({
  color: { main: 'rgba(0,0,0,0)' }
})

function App () {
  const [loggedIn, setLoggedIn] = useState(null)

  const [state, setState2] = useState({
    render: 0,
    userId: 0,
    matchId: 0
  })

  const setState = useCallback(
    s => {
      setState2({
        ...state,
        ...s
      })
    },
    [state]
  )

  useEffect(() => {
    if (loggedIn !== null) return

    fetch(`${CONFIG.API_URL}/data/loggedin`, { credentials: 'include' }).then(
      response =>
        response.json().then(logged => {
          setLoggedIn(logged)

          setState({
            render: logged.in ? 3 : 0,
            userId: logged.id ?? 0,
            matchId: 0
          })
        })
    )
  }, [loggedIn, setState])

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {state.render === 0 ? (
          <Home setState={setState} />
        ) : state.render === 1 ? (
          <CreateAccount setState={setState} />
        ) : state.render === 2 ? (
          <Login setState={setState} />
        ) : (
          <Main setState={setState} state={state} />
        )}
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
