import { Avatar, Button } from '@mui/material'
import { CloseSharp, Favorite, Tune } from '@mui/icons-material'

import './matches.css'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../../config'
import dayjs from 'dayjs'

const getAge = birthdate => {
  return dayjs().diff(dayjs(birthdate), 'year')
}

export const Matches = ({ setLogout, setError }) => {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/user/matches`, { credentials: 'include' }).then(
      response =>
        response.json().then(data => {
          if (data.error !== null) {
            setError(data.error)
            setLogout(data.logout)
          } else {
            setMatches(data.matches)
          }
        })
    )
  }, [setError, setLogout])

  const dislike = userId => {
    fetch(`${CONFIG.API_URL}/user/dislike/${userId}`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
          setLogout(data.logout)
        } else {
          fetch(`${CONFIG.API_URL}/user/matches`, {
            credentials: 'include'
          }).then(response =>
            response.json().then(data => {
              if (data.error !== null) {
                setError(data.error)
                setLogout(data.logout)
              } else {
                setMatches(data.matches)
              }
            })
          )
        }
      })
    )
  }

  return (
    <>
      <div className='matches header'>
        <Button className='btn-filter' color='pink' startIcon={<Tune />} />
        <h1 className='title'>Matches</h1>
        <div className='description'>
          This is a list of people who have liked you and your matches.
        </div>
      </div>

      <div className='matches content'>
        <div className='details'>
          <div className='show-matches'>
            {matches.map((match, index) => {
              return (
                <div className='match-info' key={index}>
                  <Avatar
                    src={match.avatarURI ?? 'images/default-photo.png'}
                    sx={{ width: '14rem', height: '14rem' }}
                    variant='rounded'
                  />
                  <div className='minfo'>
                    <span className='name'>
                      {match.firstName}, {getAge(match.birthDate)}
                    </span>
                    <div className='mbuttons'>
                      <Button color='white'>
                        <CloseSharp onClick={() => dislike(match.id)} />
                      </Button>
                      <Button>
                        <Favorite color='white' />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
