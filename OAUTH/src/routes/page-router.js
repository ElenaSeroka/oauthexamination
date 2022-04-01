import express from 'express'
import { PageController } from '../controllers/page-controller.js'

export const pageRouter = express.Router()
export const controller = new PageController()

pageRouter.get('/', controller.renderMain)
pageRouter.get('/login', controller.renderLoginPage)
pageRouter.get('/logout', controller.renderLogout, controller.logout)
