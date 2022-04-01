
import express from 'express'
import { OauthController } from '../controllers/oauth-controller.js'

export const oauthRouter = express.Router()
export const controller = new OauthController()

oauthRouter.get('/gitlablogin', controller.gitlabLogin)
oauthRouter.get('/gitlabcallback', controller.handleGitlabCallback)
