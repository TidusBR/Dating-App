import React from 'react'

import Flickity from 'react-flickity-component'
import 'flickity/css/flickity.css'

import './home.css'
import { Button } from '@mui/material'

const flickityOptions = {
  initialIndex: 1,
  wrapAround: true,
  autoPlay: true,
  prevNextButtons: false,
  resize: true,
  setGallerySize: true,
  imagesLoaded: true,
  width: 100
}

export const Home = ({ setState }) => {
  return (
    <div className='container'>
      <Flickity
        className={'carousel'}
        elementType={'div'}
        options={flickityOptions}
        reloadOnUpdate
      >
        <div>
          <img src='/images/girl1.png' />
          <div className='info'>
            <span className='title'>Algorithm</span>
            <span className='description'>
              Users going through a vetting process to ensure you never match
              with bots.
            </span>
          </div>
        </div>
        <div>
          <img src='/images/girl2.png' />
          <div className='info'>
            <span className='title'>Matches</span>
            <span className='description'>
              We match you with people that have a large array of similar
              interests.
            </span>
          </div>
        </div>
        <div>
          <img src='/images/girl3.png' />
          <div className='info'>
            <span className='title'>Premium</span>
            <span className='description'>
              Sign up today and enjoy the first month of premium benefits on us.
            </span>
          </div>
        </div>
      </Flickity>

      <Button
        className='submit btn-primary btn-create-account'
        sx={{ borderRadius: 3, textTransform: 'none' }}
        onClick={() => setState({ render: 1 })}
        color='pink'
        variant='contained'
      >
        Create an account
      </Button>
      <span className='btn-sign-in' onClick={() => setState({ render: 2 })}>
        Already have an account?{' '}
        <span className='text-pink text-bold'>Sign In</span>
      </span>
    </div>
  )
}
