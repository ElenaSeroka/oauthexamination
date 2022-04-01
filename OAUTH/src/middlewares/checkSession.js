import createError from 'http-errors'

/**
 *
 * @param req
 * @param res
 * @param next
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
