import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'

import { Box, Button } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useState } from 'react'

import './sign_up.css'

export const SignUp = ({
  prevPage,
  nextPage,
  setUserInfo,
  userInfo,
  validate
}) => {
  const [continueSignUp, setContinueSignUp] = useState(false)

  const canConfirm = () => {
    return (
      userInfo.username.length > 0 &&
      userInfo.email.length > 0 &&
      userInfo.email.includes('@') &&
      userInfo.password.length > 0 &&
      userInfo.confirmPassword.length > 0 &&
      userInfo.password.length === userInfo.confirmPassword.length &&
      userInfo.password === userInfo.confirmPassword
    )
  }

  return (
    <>
      <div className='header'>
        <Button
          className='btn-back'
          onClick={prevPage}
          color='pink'
          startIcon={<ChevronLeftIcon />}
        />
      </div>

      <div className='content'>
        <FormControl className='details'>
          <Box
            className='logo'
            component='img'
            sx={{
              height: 100,
              width: 109,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 }
            }}
            src='images/trademark.png'
          />
          <div className='info'>
            <span
              className='title'
              style={{ display: continueSignUp ? 'none' : '' }}
            >
              Sign up to continue
            </span>
            <Button
              className='btn-primary'
              sx={{
                borderRadius: 3,
                marginTop: 4,
                display: continueSignUp ? 'none' : '',
                minWidth: '280px',
                height: '52px',
                textTransform: 'none'
              }}
              color='pink'
              variant='contained'
              onClick={() => {
                setContinueSignUp(true)
              }}
            >
              Continue with email
            </Button>

            <TextField
              className='field'
              label='Username'
              name='user-name'
              variant='outlined'
              sx={{ display: continueSignUp ? '' : 'none' }}
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.username}
              onChange={event =>
                setUserInfo({ ...userInfo, username: event.target.value })
              }
              required
            />

            <TextField
              className='field'
              label='E-mail'
              name='email'
              variant='outlined'
              type='email'
              sx={{ display: continueSignUp ? '' : 'none' }}
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.email}
              onChange={event =>
                setUserInfo({ ...userInfo, email: event.target.value })
              }
              required
            />

            <TextField
              className='field'
              label='Password'
              name='password'
              variant='outlined'
              type='password'
              sx={{ display: continueSignUp ? '' : 'none' }}
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.password}
              onChange={event =>
                setUserInfo({ ...userInfo, password: event.target.value })
              }
              required
            />

            <TextField
              className='field'
              label='Confirm password'
              name='password'
              variant='outlined'
              type='password'
              sx={{ display: continueSignUp ? '' : 'none' }}
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.confirmPassword}
              onChange={event =>
                setUserInfo({
                  ...userInfo,
                  confirmPassword: event.target.value
                })
              }
              required
            />
          </div>

          <Button
            className='submit btn-primary btn-skip'
            sx={{
              borderRadius: 3,
              marginTop: 14,
              display: continueSignUp ? '' : 'none'
            }}
            color='pink'
            variant='contained'
            disabled={!canConfirm()}
            onClick={() => {
              validate('user', {
                username: userInfo.username,
                password: userInfo.password,
                confirmPassword: userInfo.confirmPassword,
                email: userInfo.email
              }).then(canProceed => {
                if (canProceed) {
                  nextPage()
                }
              })
            }}
          >
            Confirm
          </Button>
          <div className='footer'>
            <span className='text-pink text-modernist'>Terms of use</span>
            <span className='text-pink text-modernist'>Privacy Policy</span>
          </div>
        </FormControl>
      </div>
    </>
  )
}
