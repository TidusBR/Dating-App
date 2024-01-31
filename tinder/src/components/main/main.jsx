import { useState } from 'react'
import { Discover } from './discover/discover'

import './main.css'
import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { Diversity1, Favorite, Logout, Person } from '@mui/icons-material'
import { Matches } from './matches/matches'
import { Profile } from './profile/profile'
import { Match } from './match/match'
import { CONFIG } from '../../config'

export const Main = ({ state, setState }) => {
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [logout, setLogout] = useState(false)

  return (
    <div className='container main'>
      <Dialog open={error.length > 0}>
        <DialogTitle>
          {' '}
          <Typography variant='h5'>Could not proceed</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant='subtitle2' color='error'>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={
            () => {
                setError('')

                if (logout)
                    setState({render: 2})
            }
            }>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {page === 0 ? (
        <Discover setState={setState} setPage={setPage} setError={setError} setLogout={setLogout} />
      ) : page === 1 ? (
        <Matches setPage={setPage} setError={setError} setLogout={setLogout} />
      ) : page === 2 ? (
        <Profile userId={state.userId} setPage={setPage} setError={setError} setLogout={setLogout} state={state}/>
      ) : (
        <Match state={state} setError={setError} setLogout={setLogout} onKeepSwiping={() => setPage(0)} />
      )}

      <div className='footer' style={{display: page === 3 ? 'none' : ''}}>
        <BottomNavigation
          showLabels
          sx={{ width: '100%', height: '100%', background: 'transparent' }}
          onChange={(_, newValue) => {
            setPage(newValue)
          }}
        >
          <BottomNavigationAction
            icon={
              <Diversity1
                color={page === 0 ? 'pink' : ''}
                fontSize='large'
                fill='true'
              />
            }
          />
          <BottomNavigationAction
            icon={
              <Favorite
                color={page === 1 ? 'pink' : ''}
                fontSize='large'
                fill='true'
              />
            }
          />
          <BottomNavigationAction
            icon={
              <Person
                color={page === 2 ? 'pink' : ''}
                fontSize='large'
                fill='true'
              />
            }
          />
          <BottomNavigationAction onClick={() => {
            setPage(0);
            fetch(`${CONFIG.API_URL}/user/logout`, { credentials: 'include' })
            .then(
                () => {
                    setState({ render: 2 })
                }
            )
          }}
            icon={
              <Logout
                fontSize='large'
                fill='true'
              />
            }
          />
        </BottomNavigation>
      </div>
    </div>
  )
}
