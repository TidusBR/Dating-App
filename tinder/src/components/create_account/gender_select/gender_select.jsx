import { Button, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import CheckIcon from '@mui/icons-material/Check'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useRef, useState } from 'react'

export const GenderSelect = ({
  prevPage,
  nextPage,
  userInfo,
  setUserInfo,
  validate
}) => {
  const [showGenderInput, setShowGenderInput] = useState(
    !['woman', 'male'].includes(userInfo.gender) && userInfo.gender.length > 0
  )
  const inputGender = useRef()

  const setGender = (gender, input) => {
    if (!input && showGenderInput) setShowGenderInput(false)

    setUserInfo({
      ...userInfo,
      gender
    })
  }

  const canConfirm = () => {
    return userInfo.gender !== ''
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
        <Button
          className='btn-skip'
          onClick={nextPage}
          sx={{ textTransform: 'none' }}
          color='pink'
          disabled
        >
          Skip
        </Button>
        <h1 className='title'>I am a</h1>
      </div>

      <div className='content'>
        <FormControl className='details'>
          <div className='info'>
            <Button
              color='pink'
              className='field'
              sx={{
                height: '3rem',
                '& .MuiButton-endIcon': {
                  position: 'absolute',
                  right: '1rem'
                }
              }}
              id='woman'
              variant={
                userInfo.gender === 'woman' && !showGenderInput
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => setGender('woman')}
              endIcon={<CheckIcon />}
            >
              Woman
            </Button>
            <Button
              color='pink'
              className='field'
              sx={{
                height: '3rem',
                '& .MuiButton-endIcon': {
                  position: 'absolute',
                  right: '1rem'
                }
              }}
              id='male'
              variant={
                userInfo.gender === 'male' && !showGenderInput
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => setGender('male')}
              endIcon={<CheckIcon />}
            >
              Male
            </Button>
            <Button
              color='pink'
              className='field'
              sx={{
                height: '3rem',
                '& .MuiButton-endIcon': {
                  position: 'absolute',
                  right: '1rem'
                }
              }}
              variant={showGenderInput ? 'contained' : 'outlined'}
              endIcon={<ChevronRightIcon />}
              onClick={() => {
                setGender(
                  inputGender.current.value.length > 0
                    ? inputGender.current.value
                    : userInfo.gender
                )
                setShowGenderInput(true)
              }}
            >
              Choose another
            </Button>
            <TextField
              className='field'
              color='pink'
              inputRef={inputGender}
              InputProps={{ sx: { borderRadius: 3.5 } }}
              sx={{
                display: showGenderInput ? '' : 'none',
                height: '3rem',
                '& .MuiButton-endIcon': {
                  position: 'absolute',
                  right: '1rem'
                }
              }}
              label='Type your gender'
              value={userInfo.gender}
              onChange={e => setGender(e.target.value, true)}
            />
          </div>

          <Button
            disabled={!canConfirm()}
            className='submit btn-primary btn-skip'
            sx={{ borderRadius: 3, marginTop: showGenderInput ? 8 : 1 }}
            onClick={() => {
              validate('gender', {
                gender: userInfo.gender
              }).then(canProceed => {
                if (canProceed) {
                  nextPage()
                }
              })
            }}
            color='pink'
            variant='contained'
          >
            Confirm
          </Button>
        </FormControl>
      </div>
    </>
  )
}
