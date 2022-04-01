import axios from 'axios'
import createError from 'http-errors'

/**
 *
 */
export class PageController {
  /**
   * Renders the main page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  renderMain (req, res, next) {
    try {
      const viewData = {}
      res.render('pages/main', { viewData })
    } catch (error) {
      throw createError(error.status, error.message)
    }
  }

  /**
   * Renders the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  renderLoginPage (req, res, next) {
    try {
      const viewData = {}
      res.render('pages/login', { viewData })
    } catch (error) {
      throw createError(error.status, 'Uh Oh! Something went wrong!')
    }
  }

  /**
   * Renders log out page or redirects back to main page, depending if user is logged in or not.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  renderLogout (req, res, next) {
    try {
      let noSession = false
      if (req.session.tokenInfo === undefined) {
        noSession = true
      }
      const viewData = {}
      if (noSession === true) {
        res.redirect('/')
      } else if (noSession === false) {
        res.render('pages/logout', { viewData })
        next()
      }
    } catch (error) {
      throw createError(error.status, 'Uh Oh! Something went wrong!')
    }
  }

  /**
   * Destroyes the sessions, revokes the access token and for good measure logs out of gitlab via a post action.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      const parameters = {
        client_id: process.env.GITLAB_APPLICATION_ID,
        client_secret: process.env.GITLAB_SECRET,
        token: req.session.tokenInfo.access_token
      }

      const qs = new URLSearchParams(parameters)
      const URL = `${process.env.TOKEN_REVOKE_URL_GITLAB_OAUTH}?${qs.toString()}`

      await axios.post(URL)

      await axios.post('https://gitlab.lnu.se/users/sign_out')
      req.session.destroy()
    } catch (error) {
      throw createError(error.status, 'Uh Oh! Something went wrong!')
    }
  }
}
