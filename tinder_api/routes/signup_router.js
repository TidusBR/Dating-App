import express from 'express'
import { DBConn } from '../database.js'
import { hash } from 'bcrypt'

export const signUpRouter = express.Router()

async function validateUser (data) {
  let error =
    data.username === undefined || data.username.length === 0
      ? 'Invalid username'
      : data.password === undefined || data.password.length === 0
      ? 'Invalid password'
      : data.confirmPassword === undefined ||
        data.password !== data.confirmPassword
      ? 'Passwords does not match'
      : data.email === undefined || data.email.length === 0
      ? 'Invalid email'
      : null

  if (
    error === null &&
    (
      await DBConn.execute('SELECT 0 from users WHERE user_name=?', [
        data.username
      ])
    )[0].length > 0
  ) {
    error = 'There is already a registered user with this name.'
  }

  if (
    error === null &&
    (await DBConn.execute('SELECT 0 from users WHERE email=?', [data.email]))[0]
      .length > 0
  ) {
    error = 'There is already a registered user with this email.'
  }

  if (typeof error !== 'string' && error !== null) {
    error = 'Invalid data'
  }

  return error
}

function validateProfile (data) {
  return data.firstName === undefined || data.firstName.length === 0
    ? 'Invalid first name'
    : data.lastName === undefined || data.lastName.length === 0
    ? 'Invalid last name'
    : data.birthDate === undefined ||
      data.birthDate.length === 0 ||
      data.birthDate === 'Invalid Date'
    ? 'Invalid birth date'
    : null
}

function validateGender (data) {
  return data.gender === undefined || data.gender.length === 0
    ? 'Invalid gender'
    : null
}

async function validateInterests (data, noStrict) {
  const [rows] = await DBConn.execute('SELECT * FROM interests')

  let error =
    data.interests === undefined || (!noStrict && data.interests.length === 0)
      ? 'You must choose at least one interest.'
      : null

  if (
    error === null &&
    !data.interests.every(interestId => {
      return rows.find(interest => interest.id === interestId) !== undefined
    })
  ) {
    error = 'Invalid data'
  }

  return error
}

signUpRouter.post('/validate/user', async function (req, res) {
  res.json({
    error: await validateUser(req.body)
  })
})

signUpRouter.post('/validate/profile', async function (req, res) {
  res.json({
    error: validateProfile(req.body)
  })
})

signUpRouter.post('/validate/gender', async function (req, res) {
  res.json({
    error: validateGender(req.body)
  })
})

signUpRouter.post('/validate/interests', async function (req, res) {
  res.json({
    error: await validateInterests(req.body)
  })
})

signUpRouter.post('/register', async function (req, res) {
  const assertations = [
    await validateUser(req.body),
    validateProfile(req.body),
    validateGender(req.body),
    await validateInterests(req.body, true)
  ]

  if (!assertations.every(a => a === null)) {
    return res.json({
      error: assertations.filter(a => a !== null).join('\n')
    })
  }

  const [row] = await DBConn.execute(
    'INSERT INTO users(user_name, first_name, last_name, email, password, birthdate, gender) VALUES(?, ?, ?, ?, ?, ?, ?);',
    [
      req.body.username,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      await hash(req.body.password, 12),
      req.body.birthDate,
      req.body.gender
    ]
  )

  for (const interest of req.body.interests) {
    await DBConn.execute(
      'INSERT INTO user_interests(user_id, interest_id) VALUES(?,?)',
      [row.insertId, interest]
    )
  }

  if (req.body.avatar !== '' && req.body.avatar !== null)
    await DBConn.execute('INSERT INTO user_avatar(user_id, uri) VALUES(?,?)', [
        row.insertId,
        req.body.avatar
    ])
  res.json({})
})
