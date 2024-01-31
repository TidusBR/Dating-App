import { Avatar, Button } from '@mui/material'
import {
  ChevronLeft,
  CloseSharp,
  Favorite,
  ReplaySharp,
  Star,
  Tune
} from '@mui/icons-material'

import './discover.css'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CONFIG } from '../../../config'
import { Profile } from '../profile/profile'

const getAge = birthdate => {
  return dayjs().diff(dayjs(birthdate), 'year')
}

export const Discover = ({ setError, setLogout, setState, setPage }) => {
  const [profile, setProfile] = useState({
    first_name: 'Unknown',
    last_name: '',
    birthdate: dayjs().toString(),
    avatarURI: 'images/default-photo.png',
    interests: '',
    id: -1
  })

  const [showPersonProfile, setShowPersonProfile] = useState(false)

  const handleDiscoverData = useCallback(
    data => {
      if (data.error === null) setProfile({
        ...data,
        avatarURI: data.avatarURI === '' ? 'images/default-photo.png' : data.avatarURI
      })
      else {
        setError(data.error)
        setLogout(data.logout)
        setProfile({
          first_name: 'Unknown',
          last_name: '',
          birthdate: dayjs().toString(),
          avatarURI: 'images/default-photo.png',
          interests: '',
          id: -1
        })
      }
    },
    [setError, setLogout]
  )

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/user/discover`, { credentials: 'include' }).then(
      response => response.json().then(handleDiscoverData)
    )
  }, [handleDiscoverData, setError, setLogout, setProfile])

  const onSkip = () => {
    fetch(`${CONFIG.API_URL}/user/discover/skip`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
          setLogout(data.logout)
        } else {
          fetch(`${CONFIG.API_URL}/user/discover`, {
            credentials: 'include'
          }).then(response => response.json().then(handleDiscoverData))
        }
      })
    )
  }

  const onLike = () => {
    fetch(`${CONFIG.API_URL}/user/discover/like`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error !== null) {
          setError(data.error)
          setLogout(data.logout)
        } else {
          if (data.match !== null) {
            setState({ matchId: data.match })
            setPage(3)
          } else {
            fetch(`${CONFIG.API_URL}/user/discover`, {
              credentials: 'include'
            }).then(response => response.json().then(handleDiscoverData))
          }
        }
      })
    )
  }

  return showPersonProfile ? (
    <Profile
      userId={profile.id}
      setPage={setPage}
      setError={setError}
      setLogout={setLogout}
      backRedirect={() => setShowPersonProfile(false)}
    />
  ) : (
    <>
      <div className='discover header'>
        <Button className='btn-back' color='pink' startIcon={<ChevronLeft />} />
        <Button className='btn-filter' color='pink' startIcon={<Tune />} />
        <h1 className='title'>Discover</h1>
      </div>

      <div className='discover content'>
        <div className='details'>
          <div
            className='profile'
            onClick={() =>
              profile.id !== -1 ? setShowPersonProfile(true) : null
            }
          >
            <Avatar
              className='avatar'
              src={profile.avatarURI}
              sx={{
                bgcolor: 'transparent',
                width: '100%',
                height: '100%',
                borderRadius: '8px'
              }}
              variant='rounded'
            />
            <div className='information'>
              <span className='name'>
                {profile.first_name} {profile.last_name},{' '}
                {getAge(profile.birthdate)}
              </span>
              <span className='interests'>{profile.interests}</span>
            </div>
          </div>
          <div className='control-buttons'>
            <Button
              className='control skip'
              sx={{ borderRadius: '100%' }}
              color='white'
              variant='contained'
              onClick={onSkip}
            >
              {profile.id === -1 ? (
                <ReplaySharp fontSize='large' color='warning' />
              ) : (
                <CloseSharp fontSize='large' color='warning' />
              )}
            </Button>
            <Button
              className='control like'
              sx={{ borderRadius: '100%' }}
              color='pink'
              variant='contained'
              disabled={profile.id === -1}
            >
              <Favorite
                color='white'
                fontSize='large'
                className='larger-icon'
                fill='true'
                onClick={onLike}
              />
            </Button>
            <Button
              className='control star'
              sx={{ borderRadius: '100%' }}
              color='white'
              variant='contained'
              disabled={profile.id === -1}
            >
              <Star color='purple' fontSize='large' fill='true' />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
