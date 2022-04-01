import express from 'express'
import { UserController } from '../controllers/user-controller.js'

export const userRouter = express.Router()
export const controller = new UserController()

userRouter.get('/', controller.showUserInfo)
userRouter.get('/loggedin', controller.showHistory)
