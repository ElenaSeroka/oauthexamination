import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import router from './routes/router.js'
import cors from 'cors'

const app = express()
app.use(express.static('/'))

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://gitlab.lnu.se', 'cdn.jsdelivr.net'],
        'img-src': ["'self'", 'https://gitlab.lnu.se', '*.gravatar.com', 'cdn.jsdelivr.net']
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
  })
)


// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30 * 1000
  }
}))

app.use(cors(), router)
app.use('/', router)
app.use((err, req, res, next) => {
  const viewData = {
    errormessage: err.message,
    statuscode: err.status || 500
  }

  res.render('pages/error', { viewData })
})

app.listen()
// console.log('Server is listening on port 8080')
