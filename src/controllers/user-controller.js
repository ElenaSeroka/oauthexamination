import axios from 'axios'
import createError from 'http-errors'

/**
 *
 */
export class UserController {
  /**
   * Shows the users info.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showUserInfo (req, res, next) {
    try {
      const responseUser = await axios.get('https://gitlab.lnu.se/api/v4/user' + '?access_token=' + req.session.tokenInfo.access_token)

      req.session.userInfo = {
        username: responseUser.data.username,
        name: responseUser.data.name,
        id: responseUser.data.id,
        email: responseUser.data.email,
        last_sign_in_at: responseUser.data.last_sign_in_at,
        avatar_url: responseUser.data.avatar_url,
        history: responseUser.data.last_activity_on
      }

      const viewData = {
        userinfo: req.session.userInfo
      }

      res.render('pages/info', { viewData })
    } catch (error) {
      throw createError(error.status, error.message)
    }
  }

  /**
   * Shows the users history.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showHistory (req, res, next) {
    try {
      const historyData = []
      const accessToken = req.session.tokenInfo.access_token
      const userId = req.session.userInfo.id
      let pageNr = 1
      // "https://gitlab.example.com/api/v4/users/:id/events"
      for (let index = 0; index < 6; index++) {
        historyData.push(await axios.get(`https://gitlab.lnu.se/api/v4/users/${userId}/events?per_page=20&page=${pageNr}`, {
          headers: {
            Authorization: `Bearer ${accessToken} `
          }
        }))
        console.log(historyData)
        pageNr++
      }

      const myEvents = []
      let count = 1

      for (let i = 0; i < historyData.length; i++) {
        for (let j = 0; j < historyData[i].data.length; j++) {
          if (count < 102) {
            myEvents.push(historyData[i].data[j])
            count++
          }
        }
      }
      console.log(myEvents.length)
      const viewData = myEvents
      res.render('pages/history', { viewData })
    } catch (error) {
      throw createError(error.status, error.message)
    }
  }
}
