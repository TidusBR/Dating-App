import { Avatar, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

export const AvatarUpload = ({ defaultAvatarSrc, file, onFileChanged }) => {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  useEffect(() => {
    if (file) {
      setSelectedFile(file)
    }

    if (!selectedFile) {
      setPreview(defaultAvatarSrc)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [defaultAvatarSrc, file, selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    setSelectedFile(e.target.files[0])
    onFileChanged(e.target.files[0])
  }

  return (
    <>
      <input
        accept='image/*'
        id='icon-button-file'
        type='file'
        style={{ display: 'none' }}
        onChange={onSelectFile}
      />
      <label htmlFor='icon-button-file'>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
        >
          <Avatar
            className='avatar'
            src={preview}
            sx={{
              bgcolor: 'transparent',
              width: '100px',
              height: '100px',
              borderRadius: '8px'
            }}
            variant='rounded'
          />

          <div
            style={{
              position: 'absolute',
              bottom: '0.1em',
              right: '0.1em',
              width: '1.3em',
              height: '1.3em',
              background: '#E94057',
              border: '2px solid white',
              borderRadius: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <PhotoCameraIcon
              sx={{ width: '1.2rem', height: '1.2rem', fill: 'white' }}
            />
          </div>
        </IconButton>
      </label>
    </>
  )
}
