import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { Button } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { AvatarUpload } from '../../avatar_upload/avatar_upload'

export const ProfileDetails = ({
  prevPage,
  nextPage,
  setUserInfo,
  userInfo,
  validate
}) => {
  const canConfirm = () => {
    return (
      userInfo.firstName?.length > 0 &&
      userInfo.lastName?.length > 0 &&
      userInfo.birthDate !== null &&
      userInfo.birthDate.$d.toString() !== 'Invalid Date'
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
        <Button
          className='btn-skip'
          onClick={nextPage}
          sx={{ textTransform: 'none' }}
          color='pink'
          disabled
        >
          Skip
        </Button>
        <h1 className='title'>Profile details</h1>
      </div>

      <div className='content'>
        <FormControl className='details'>
          <AvatarUpload
            defaultAvatarSrc='images/default-photo.png'
            file={userInfo.avatar}
            onFileChanged={file => setUserInfo({ ...userInfo, avatar: file })}
          />
          <div className='info'>
            <TextField
              className='field'
              label='First name'
              name='first-name'
              variant='outlined'
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.firstName}
              onChange={event =>
                setUserInfo({ ...userInfo, firstName: event.target.value })
              }
              required
            />
            <TextField
              className='field'
              label='Last name'
              name='last-name'
              variant='outlined'
              InputProps={{ sx: { borderRadius: 3.5 } }}
              value={userInfo.lastName}
              onChange={event =>
                setUserInfo({ ...userInfo, lastName: event.target.value })
              }
              required
            />
            <DatePicker
              className='field datepicker'
              label='Choose birthday date'
              name='birthday-date'
              value={userInfo.birthDate}
              onChange={value => setUserInfo({ ...userInfo, birthDate: value })}
              required
            />
          </div>

          <Button
            className='submit btn-primary btn-skip'
            sx={{ borderRadius: 3, marginTop: 2 }}
            color='pink'
            variant='contained'
            onClick={() => {
              validate('profile', {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                birthDate: userInfo.birthDate
              }).then(canProceed => {
                if (canProceed) {
                  nextPage()
                }
              })
            }}
            disabled={!canConfirm()}
          >
            Confirm
          </Button>
        </FormControl>
      </div>
    </>
  )
}
