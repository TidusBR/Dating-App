import express from 'express'
import { DBConn } from '../database.js'
import { compare } from 'bcrypt'

export const signInRouter = express.Router()

signInRouter.post('/', async function (req, res) {
  let error = null

  const [rows] = await DBConn.execute(
    'SELECT id, password from users WHERE user_name=? OR email=? LIMIT 1',
    [req.body.username, req.body.username]
  )

  if (rows.length === 0) {
    error = 'There is no account registered with this name or email'
  } else if (!(await compare(req.body.password, rows[0].password))) {
    error = 'You have entered an invalid password'
  } else {
    req.session.userId = rows[0].id
  }

  req.session.save();

  res.send({
    error,
    userId: req.session.userId
  })
})
