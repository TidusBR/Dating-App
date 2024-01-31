import { useEffect, useState } from 'react'
import { CONFIG } from '../../config'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography
} from '@mui/material'

export const Login = ({ setState }) => {
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/data/loggedin`, { credentials: 'include' }).then(
      response =>
        response.json().then(data => {
          if (data.in) {
            setState({ render: 3 })
          }
        })
    )
  }, [setState])

  const [authing, setAuthing] = useState(false)

  const auth = async () => {
    if (authing) return

    setAuthing(true)

    const response = await fetch(`${CONFIG.API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo),
      credentials: 'include'
    })

    const responseData = await response.json()

    if (Object.hasOwn(responseData, 'error') && responseData.error !== null) {
      setError(responseData.error)
      setAuthing(false)
      return
    }

    setState({ render: 3, userId: responseData.userId })
  }

  const canConfirm = () => {
    return (
      userInfo.username.length > 0 && userInfo.password.length > 0 && !authing
    )
  }

  return (
    <div className='container'>
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
          <Button variant='contained' onClick={() => setError('')}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <div className='header'>
        <Button
          className='btn-back'
          onClick={() => setState({ render: 0 })}
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
            <span className='title'>Sign In</span>

            <TextField
              className='field'
              label='E-mail or username'
              name='user-name'
              variant='outlined'
              onChange={event =>
                setUserInfo({ ...userInfo, username: event.target.value })
              }
              InputProps={{ sx: { borderRadius: 3.5 } }}
              required
            />

            <TextField
              className='field'
              label='Password'
              name='password'
              variant='outlined'
              type='password'
              onChange={event =>
                setUserInfo({ ...userInfo, password: event.target.value })
              }
              InputProps={{ sx: { borderRadius: 3.5 } }}
              required
            />
          </div>

          <Button
            className='submit btn-primary btn-skip'
            sx={{
              borderRadius: 3,
              marginTop: 6
            }}
            color='pink'
            variant='contained'
            disabled={!canConfirm()}
            onClick={auth}
          >
            Confirm
          </Button>
          <div className='footer'>
            <span className='text-pink text-modernist'>Terms of use</span>
            <span className='text-pink text-modernist'>Privacy Policy</span>
          </div>
        </FormControl>
      </div>
    </div>
  )
}
