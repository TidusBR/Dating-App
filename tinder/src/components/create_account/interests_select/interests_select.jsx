import { Button, FormControl } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import * as Muicon from '@mui/icons-material'

import './interests_select.css'
import { createElement, useEffect, useState } from 'react'
import { CONFIG } from '../../../config'

export const InterestsSelect = ({
  prevPage,
  userInfo,
  setUserInfo,
  validate,
  registering,
  register
}) => {
  const [interests, setInterests] = useState([])

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/data/interests`, {
      credentials: 'include'
    }).then(response =>
      response.json().then(data => {
        setInterests(
          data.map(interest => {
            return {
              ...interest,
              icon: createElement(Muicon[interest.icon])
            }
          })
        )
      })
    )
  }, [])
  const canConfirm = () => {
    return userInfo.interests.length > 0 && !registering
  }

  return (
    <>
      <div className='interests-ui header'>
        <Button
          className='btn-back'
          onClick={prevPage}
          color='pink'
          startIcon={<ChevronLeftIcon />}
        />
        <Button
          className='btn-skip'
          onClick={() => register()}
          sx={{ textTransform: 'none' }}
          color='pink'
        >
          Skip
        </Button>
        <h1 className='title'>Your interests</h1>
        <div className='description'>
          Select a few of your interests and let everyone know what you&apos;re
          passionate about.
        </div>
      </div>

      <div className='interests-ui content'>
        <FormControl className='details'>
          <div className='info'>
            <div className='button-group'>
              {interests.map((interest, index) => (
                <Button
                  key={index}
                  className='btn-primary'
                  sx={{
                    borderRadius: 3,
                    '& .MuiButton-startIcon': {
                      position: 'absolute',
                      left: '1rem'
                    }
                  }}
                  startIcon={interest.icon}
                  color='pink'
                  variant={
                    userInfo.interests.includes(interest.id)
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => {
                    if (userInfo.interests.includes(interest.id)) {
                      setUserInfo({
                        ...userInfo,
                        interests: userInfo.interests.filter(
                          i => i !== interest.id
                        )
                      })
                    } else {
                      setUserInfo({
                        ...userInfo,
                        interests: [...userInfo.interests, interest.id]
                      })
                    }
                  }}
                >
                  {interest.name}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className='submit btn-primary'
            sx={{ borderRadius: 3, marginTop: 2.5 + 2 * interests.length }}
            onClick={() => {
              validate('interests', {
                interests: userInfo.interests
              }).then(canProceed => {
                if (canProceed) {
                  register()
                }
              })
            }}
            color='pink'
            variant='contained'
            disabled={!canConfirm()}
          >
            Confirm
          </Button>
        </FormControl>
      </div>
    </>
  )
}
