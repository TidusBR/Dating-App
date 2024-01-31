import { useState } from 'react'
import './create_account.css'
import { ProfileDetails } from './profile_details/profile_details'
import { GenderSelect } from './gender_select/gender_select'
import { InterestsSelect } from './interests_select/interests_select'
import { SignUp } from './sign_up/sign_up'
import { CONFIG } from '../../config'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

export const CreateAccount = ({ setState }) => {
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)

  const [userInfo, setUserInfo] = useState({
    /**
     * Sign Up screen info
     */
    username: '',
    email: '',
    password: '',
    confirmPassword: '',

    /**
     * Profile details
     */
    firstName: '',
    lastName: '',
    birthDate: null,
    avatar: null,

    /**
     * Gender select
     */
    gender: '',

    /**
     * Interests select
     */
    interests: []
  })

  const nextPage = () => {
    setPage(page + 1)
  }

  const prevPage = () => {
    if (page === 0) {
      setState({ render: 0 })
      return
    }
    setPage(page - 1)
  }

  const validate = async (endpoint, data) => {
    const response = await fetch(
      `${CONFIG.API_URL}/signup/validate/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }
    )

    const responseData = await response.json()

    if (responseData.error !== null) {
      setError(responseData.error)
      return false
    }

    return true
  }

  const file2Base64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
    })

  const register = async () => {
    if (registering) return

    setRegistering(true)

    const response = await fetch(`${CONFIG.API_URL}/signup/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userInfo,
        avatar:
          userInfo.avatar === null ? '' : await file2Base64(userInfo.avatar)
      }),
      credentials: 'include'
    })

    const responseData = await response.json()

    if (Object.hasOwn(responseData, 'error')) {
      setError(responseData.error)
      setRegistering(false)
      return
    }

    setState({
      render: 2
    })
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
      {page === 0 ? (
        <SignUp
          setPage={setPage}
          nextPage={nextPage}
          prevPage={prevPage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          validate={validate}
        />
      ) : page === 1 ? (
        <ProfileDetails
          setPage={setPage}
          nextPage={nextPage}
          prevPage={prevPage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          validate={validate}
        />
      ) : page === 2 ? (
        <GenderSelect
          setPage={setPage}
          nextPage={nextPage}
          prevPage={prevPage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          validate={validate}
        />
      ) : (
        <InterestsSelect
          setPage={setPage}
          nextPage={nextPage}
          prevPage={prevPage}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          validate={validate}
          setState={setState}
          register={register}
          registering={registering}
        />
      )}
    </div>
  )
}
