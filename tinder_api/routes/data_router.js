import express from 'express'
import { DBConn } from '../database.js'

export const dataRouter = express.Router()

dataRouter.get('/interests', async (_, res) => {
  const [rows] = await DBConn.execute('SELECT * FROM interests')
  res.json(rows)
})

dataRouter.get('/loggedin', async (req, res) => {
  res.json({
    in:
      Object.hasOwn(req.session, 'userId') &&
      (
        await DBConn.execute('SELECT 0 FROM users WHERE id = ?', [
          req.session.userId
        ])
      )[0].length > 0,
    id: req.session.userId
  })
})
