import { Avatar, Button } from '@mui/material'

import './profile.css'
import { CONFIG } from '../../../config'
import { createElement, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ChevronLeft } from '@mui/icons-material'
import * as Muicon from '@mui/icons-material'

const getAge = birthdate => {
  return dayjs().diff(dayjs(birthdate), 'year')
}

export const Profile = ({ state, setError, setLogout, backRedirect, userId }) => {
  const [profile, setProfile] = useState({
    avatarURI: 'images/default-photo.png',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    interests: []
  })

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/user/profile/${userId}`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        if (data.error === null)
          setProfile({
            firstName: data.first_name,
            lastName: data.last_name,
            avatarURI: data.avatarURI ?? 'images/default-photo.png',
            birthDate: data.birthdate,
            gender: data.gender,
            interests: data.interests
          })
        else {
          setError(data.error)
          setLogout(data.logout)
        }
      })
    )
  }, [setError, setLogout, state, userId])

  return (
    <>
      <div className='profile header'>
        <Button className='btn-back' color='pink' sx={{visibility: typeof backRedirect === 'function' ? 'visible' : 'hidden'}} startIcon={<ChevronLeft />} onClick={backRedirect} />
        <h1 className='title'>Profile</h1>
      </div>

      <div className='profileData content'>
        <div className='details'>
          <div className='profile'>
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
                {profile.firstName} {profile.lastName},{' '}
                {getAge(profile.birthDate)}
              </span>
            </div>
          </div>

          <div className='interests'>
            {profile.interests.map((interest) => {return {...interest, icon: createElement(Muicon[interest.icon])}}).map((interest, index) => (
              <Button
                key={index}
                className='btn-interests'
                sx={{
                  borderRadius: 3,
                  '& .MuiButton-startIcon': {
                    position: 'absolute',
                    left: '1rem'
                  }
                }}
                startIcon={interest.icon}
                color='pink'
                variant='contained'
              >
                {interest.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
