import express from 'express'
import { DBConn } from '../database.js'
import { compare } from 'bcrypt'

export const userRouter = express.Router()

async function checkIfUserLiked (userId, testId) {
  const [rows] = await DBConn.execute(
    `SELECT 0 FROM likes WHERE user_id = ? AND liked_id = ?`,
    [userId, testId]
  )

  return rows.length > 0
}

userRouter.get('/logout', async function (req, res) {
  req.session.destroy()
  res.sendStatus(200)
})

userRouter.get('/dislike/:id', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  await DBConn.execute(
    'DELETE FROM likes WHERE user_id = ? AND liked_id = ?',
    [req.session.userId, req.params.id]
  )

  res.json({
    error: null
  })
})

userRouter.get('/matches', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  const [rows] = await DBConn.execute(
    'SELECT liked_id from likes WHERE user_id=?',
    [req.session.userId]
  )

  const data = []

  for (const matchId of rows.map(liked => liked.liked_id)) {
    if (!(await checkIfUserLiked(matchId, req.session.userId))) continue

    const matchData = { id: matchId }

    const [userRow] = await DBConn.execute(
      'SELECT first_name, birthdate from users WHERE id=? LIMIT 1',
      [matchId]
    )

    matchData.firstName = userRow[0].first_name
    matchData.birthDate = userRow[0].birthdate

    const [avatarRow] = await DBConn.execute(
      'SELECT uri from user_avatar WHERE user_id=? LIMIT 1',
      [matchId]
    )

    matchData.avatarURI = avatarRow.length > 0 ? avatarRow[0].uri : null
    data.push(matchData)
  }

  res.json({
    error: null,
    matches: data
  })
})

userRouter.get('/first-name/:id', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  const [row] = await DBConn.execute(
    'SELECT first_name from users WHERE id=? LIMIT 1',
    [req.params.id]
  )

  res.json({
    first_name: row.length > 0 ? row[0].first_name : null,
    error: null
  })
})

userRouter.get('/profile/avatar/:id', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  const [avatarRow] = await DBConn.execute(
    'SELECT uri from user_avatar WHERE user_id=? LIMIT 1',
    [req.params.id]
  )

  res.json({
    avatarURI: avatarRow.length > 0 ? avatarRow[0].uri : null,
    error: null
  })
})

userRouter.get('/profile/:id', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  let error = null
  let data = {}

  const [rows] = await DBConn.execute(
    'SELECT first_name, last_name, birthdate, gender from users WHERE id=? LIMIT 1',
    [req.params.id]
  )

  if (rows.length === 0) {
    error = 'Profile not found'
  } else {
    data = rows[0]

    const [avatarRow] = await DBConn.execute(
      'SELECT uri from user_avatar WHERE user_id=? LIMIT 1',
      [req.params.id]
    )

    data.avatarURI = avatarRow.length > 0 ? avatarRow[0].uri : null

    const [interests] = await DBConn.execute(
      'SELECT interest_id from user_interests WHERE user_id=?',
      [req.params.id]
    )

    if (interests.length > 0) {
      data.interests = (
        await DBConn.execute(
          `SELECT name, icon from interests WHERE id IN (${interests
            .flat()
            .map(interest => interest.interest_id)
            .join(', ')})`
        )
      )[0]
    } else {
      data.interests = []
    }
  }

  res.json({
    error,
    ...data
  })
})

userRouter.get('/discover/like', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  if (
    !Object.hasOwn(req.session, 'discoverData') ||
    typeof req.session.discoverData !== 'object'
  )
    return res.json({ error: 'Invalid action', logout: true })

  if (typeof req.session.discoverData === 'object')
    req.session.lastDiscoverPersonId = req.session.discoverData?.id ?? -1
  req.session.discoverData = null

  if (req.session.lastDiscoverPersonId === -1) return res.json({ error: null })

  await DBConn.execute(`INSERT INTO likes(user_id, liked_id) VALUES(?, ?)`, [
    req.session.userId,
    req.session.lastDiscoverPersonId
  ])

  res.json({
    error: null,
    match: (await checkIfUserLiked(
      req.session.lastDiscoverPersonId,
      req.session.userId
    ))
      ? req.session.lastDiscoverPersonId
      : null
  })
})

userRouter.get('/discover/skip', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  if (typeof req.session.discoverData === 'object')
    req.session.lastDiscoverPersonId = req.session.discoverData?.id ?? -1
  req.session.discoverData = null

  res.json({ error: null })
})

userRouter.get('/discover', async function (req, res) {
  if (!Object.hasOwn(req.session, 'userId'))
    return res.json({ error: 'You are not logged in', logout: true })

  if (
    Object.hasOwn(req.session, 'discoverData') &&
    req.session.discoverData !== null
  ) {
    return res.json({
      error: null,
      ...req.session.discoverData
    })
  }

  if (!Object.hasOwn(req.session, 'lastDiscoverPersonId')) {
    req.session.lastDiscoverPersonId = 0
  }

  let error = null
  let data = {}

  const interestsRows = (
    await DBConn.execute(
      `SELECT user_id
    FROM user_interests
    WHERE user_id != ? AND user_id != ? AND interest_id IN (
        SELECT interest_id
        FROM user_interests
        GROUP BY interest_id
        HAVING COUNT(*) > 1
    ) ORDER BY RAND()`,
      [req.session.userId, req.session.lastDiscoverPersonId]
    )
  )[0]

  const interests = []

  for (const user of interestsRows) {
    if (!(await checkIfUserLiked(req.session.userId, user.user_id))) {
      interests.push(user.user_id)
    }
  }

  let rows = null

  if (interests.length !== 0) {
    rows = (
      await DBConn.execute(
        'SELECT id, first_name, last_name, birthdate, gender FROM users WHERE id = ?',
        [interests[0]]
      )
    )[0]

    if (rows.length === 0) {
      rows = null
    }
  }

  if (rows === null) {
    rows = (
      await DBConn.execute(
        'SELECT id, first_name, last_name, birthdate, gender FROM users WHERE id != ? and id != ? AND id NOT IN (SELECT `liked_id` FROM likes WHERE `user_id` = ? AND `liked_id` = id) ORDER BY RAND() LIMIT 1;',
        [
          req.session.userId,
          req.session.lastDiscoverPersonId,
          req.session.userId
        ]
      )
    )[0]
  }

  if (rows.length === 0) {
    error = 'No profiles available for match'
  } else {
    data = rows[0]

    const [avatarRow] = await DBConn.execute(
      'SELECT uri from user_avatar WHERE user_id=? LIMIT 1',
      [data.id]
    )

    data.avatarURI = avatarRow.length > 0 ? avatarRow[0].uri : null

    const [interests] = await DBConn.execute(
      'SELECT interest_id from user_interests WHERE user_id=? ORDER BY RAND() LIMIT 2',
      [data.id]
    )

    if (interests.length > 0) {
      const [interestName] = await DBConn.execute(
        `SELECT name from interests WHERE id IN (${interests
          .flat()
          .map(interest => interest.interest_id)
          .join(', ')})`
      )

      data.interests = interestName
        .flat()
        .map(interest => interest.name)
        .join(', ')
    }
  }

  if (error === null) {
    req.session.discoverData = data
  }

  res.json({
    error,
    ...data
  })
})
