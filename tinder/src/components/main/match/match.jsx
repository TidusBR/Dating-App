import { Avatar, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../config'

import './match.css'

export const Match = ({ state, setError, setLogout, onKeepSwiping }) => {
  const [userAvatar, setUserAvatar] = useState('images/default-photo.png')
  const [matchAvatar, setMatchAvatar] = useState('images/default-photo.png')
  const [username, setUserName] = useState('Unknown')

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/user/first-name/${state.userId}`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
        } else if (data.first_name !== null) {
          setUserName(data.first_name)
        }
      })
    )

    fetch(`${CONFIG.API_URL}/user/profile/avatar/${state.userId}`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
          setLogout(data.logout)
        } else if (data.avatarURI !== null && data.avatarURI !== '') {
          setUserAvatar(data.avatarURI)
        }
      })
    )

    fetch(`${CONFIG.API_URL}/user/profile/avatar/${state.matchId}`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
          setLogout(data.logout)
        } else if (data.avatarURI !== null && data.avatarURI !== '') {
          setMatchAvatar(data.avatarURI)
        }
      })
    )
  }, [setError, setLogout, state.matchId, state.userId])

  return (
    <div className='match content'>
      <div className='avatars'>
        <Avatar
          src={userAvatar}
          sx={{
            bgcolor: 'transparent',
            position: 'absolute',
            width: '40%',
            height: '40%',
            right: '6rem',
            top: '2rem',
            transform: 'rotate(12deg)',
            borderRadius: '8px'
          }}
          variant='rounded'
        />
        <Avatar
          src={matchAvatar}
          sx={{
            bgcolor: 'transparent',
            position: 'absolute',
            width: '40%',
            height: '40%',
            left: '6rem',
            top: '10rem',
            transform: 'rotate(-12deg)',
            borderRadius: '8px'
          }}
          variant='rounded'
        />
      </div>
      <div className='information'>
        <span className='title'>It’s a match, {username}!</span>
        <span className='description'>
          Start a conversation now with each other
        </span>

        <Button
          sx={{
            borderRadius: 3,
            marginTop: 2,
            width: '340px',
            textTransform: 'none'
          }}
          color='pink'
          className='btn-primary'
          variant='contained'
        >
          Say hello
        </Button>

        <Button
          sx={{
            borderRadius: 3,
            marginTop: 2,
            width: '340px',
            background: 'rgba(233, 64, 87, 0.1)',
            color: '#e94057',
            fontSize: 16,
            fontWeight: 700,
            textTransform: 'none'
          }}
          className='btn-primary'
          color='transparent'
          variant='contained'
          onClick={onKeepSwiping}
        >
          Keep swiping
        </Button>
      </div>
    </div>
  )
}
