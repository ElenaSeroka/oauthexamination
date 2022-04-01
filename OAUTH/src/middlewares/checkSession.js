import createError from 'http-errors'

/**
 * Makes sure there is a session active.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export async function checkSession (req, res, next) {
  try {
    if (!req.session.tokenInfo) {
      throw createError(403, 'Uh oh! Something went wrong!')
    }
    next()
  } catch (error) {
    next(error)
  }
}
