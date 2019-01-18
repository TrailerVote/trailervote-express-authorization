import { Response } from 'express'

import { logger, responseTime } from '@trailervote/express-logger'
import { renderError } from '@trailervote/express-render'

function noopLogCall(_: Response) { /* noop */ }

/**
 * Create an unauthorized response render function
 *
 * @param {string} type type of the authorization (e.g. Basic)
 * @param {string} realm the realm of the authorization
 * @param {string} message message to respond with
 * @param {boolean} silent if true won't log
 *
 * @return
 */
export function makeRenderAuthorized(type: string, realm: string, message: string = realm, silent: boolean = false) {
  const logCall = silent
    ? noopLogCall
    : (res: Response) => {
      const tag = `${res.locals.requestTag}[render]${responseTime(res)}`.trim()
      logger(res).info(`${tag} unauthorized`)
    }

  const wwwAuthenticate = `${type} realm=${realm}`

  // tslint:disable-next-line:no-shadowed-variable
  return function renderUnauthorized(res: Response) {
    logCall(res)

    res.set('WWW-Authenticate', wwwAuthenticate)
    return renderError(res, 401, message)
  }
}

export const renderUnauthorized = makeRenderAuthorized('Basic', 'Authorization Required')
