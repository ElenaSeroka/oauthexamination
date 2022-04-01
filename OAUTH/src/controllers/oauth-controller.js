import axios from 'axios'
import createError from 'http-errors'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

/**
 *
 */
export class OauthController {
  /**
   * Logs in to gitlab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async gitlabLogin (req, res, next) {
    try {
      const state = crypto.randomBytes(15).toString('hex')
      req.session.state = state

      const parameters = {
        client_id: process.env.GITLAB_APPLICATION_ID,
        redirect_uri: process.env.REDIRECT_URI,
        scope: ['read_api', 'read_user'].join(' '),
        state: state,
        response_type: 'code'
      }

      const qs = new URLSearchParams(parameters)
      const URL = `${process.env.BASE_URL_GITLAB_OAUTH}?${qs.toString()}`
      res.redirect(URL)
    } catch (error) {
      throw createError(error.status, error.message)
    }
  }

  /**
   *Handles the gitlab callback - sets access token and redirects to /user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async handleGitlabCallback (req, res, next) {
    try {
      if (req.session.state !== req.query.state) {
        throw createError('Uh oh! Something went wrong!')
      }

      const parameters = {
        client_id: process.env.GITLAB_APPLICATION_ID,
        code: req.query.code,
        grant_type: 'authorization_code',
        client_secret: process.env.GITLAB_SECRET,
        redirect_uri: process.env.REDIRECT_URI
      }

      const qs = new URLSearchParams(parameters)
      const URL = `${process.env.TOKEN_URL_GITLAB_OAUTH}?${qs.toString()}`

      const gitlabResponse = await axios.post(URL)

      req.session.tokenInfo = gitlabResponse.data

      res.redirect('/user')
    } catch (error) {
      throw createError(error.status, error.message)
    }
  }
}
