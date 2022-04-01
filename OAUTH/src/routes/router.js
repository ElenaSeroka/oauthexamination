import express from 'express'
import dotenv from 'dotenv'
import { pageRouter } from './page-router.js'
import { oauthRouter } from './oauth-router.js'
import { checkSession } from '../middlewares/checkSession.js'
import { userRouter } from './user-router.js'

dotenv.config()
const router = express.Router()

router.get('/', pageRouter)
router.get('/login', pageRouter)
router.get('/logout', pageRouter)
router.use('/oauth', oauthRouter)
router.use('/user', checkSession, userRouter)

export default router
