import CreateHttpError from 'http-errors'
import express from 'express'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import { signUpRouter } from './routes/signup_router.js'
import { fileURLToPath } from 'url'
import { dataRouter } from './routes/data_router.js'
import { signInRouter } from './routes/signin_router.js'
import session from 'express-session'
import bodyParser from 'body-parser'
import { userRouter } from './routes/user_router.js'
import { CONFIG } from './config.js'
import MySQLStore from 'express-mysql-session'
import { DBConn } from './database.js'

export const app = express()

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'jade')

const sessionConfig = {
  secret: 'nothing better then coffee',
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: true
}

if (CONFIG.isProduction) {
  const sessionStore = new (MySQLStore(session))(
    {
      clearExpired: true,
      createDatabaseTable: true,
      expiration: 86400000,
      checkExpirationInterval: 900000
    },
    DBConn
  )

  app.set('trust proxy', 1)

  sessionConfig.store = sessionStore
  sessionConfig.cookie.sameSite = 'none'
  sessionConfig.cookie.secure = true
}

app.use(session(sessionConfig))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  cors({
    origin: CONFIG.origin,
    credentials: true,
    optionSuccessStatus: 200
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))

app.use('/signin', signInRouter)
app.use('/signup', signUpRouter)
app.use('/data', dataRouter)
app.use('/user', userRouter)

// catch 404 and forward to error handler
app.use(function (_, __, next) {
  next(CreateHttpError(404))
})

// error handler
app.use(function (err, req, res) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
