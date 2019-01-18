import { logger, taggedRequestToLog } from '@trailervote/express-logger'
import { NextFunction, Request, Response } from 'express'

import { renderUnauthorized } from '../response/render/unauthorized'

import { DecodeFailure } from './DecodeFailure'
import { TypeMisMatch } from './TypeMisMatch'

function unauthorizedAndLog(req: Request, res: Response) {
  logger(res).info(`${res.locals.requestTag}[basic-auth] failed`)
  logger(res).info(taggedRequestToLog(req, res))

  return renderUnauthorized(res)
}

const TYPE_BASIC = 'Basic'

function decode(type: string, ...contents: string[]): [string, string] {
  if (type !== TYPE_BASIC) {
    throw new TypeMisMatch(type, TYPE_BASIC)
  }

  const decoded = decodeBase64(contents)
  if (!decoded || decoded.length !== 2 || !decoded[0] || !decoded[1]) {
    throw new DecodeFailure(`${contents[0]} does not contain username:password.`)
  }

  return [decoded[0], decoded[1]]
}

function decodeBase64(contents: string[]): string[] {
  try {
    return Buffer.from(contents[0], 'base64').toString().split(':')
  } catch(error) {
    throw new DecodeFailure(`Could not decode ${contents[0]} using base64: ${error}`)
  }
}

/**
 * Creates middleware to extract basic authorization for further passing
 */
export function createAuthorizeWithBasic({ errors }: { errors: any }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
      return unauthorizedAndLog(req, res)
    }

    try {
      const [type, ...contents] = auth.split(' ')
      const [key, secret] = decode(type, ...contents)

      res.locals.trailervoteAuthorization = auth
      res.locals.trailervoteKey = key
      res.locals.trailervoteSecret = secret

      errors.configureScope((scope: any) => {
        scope.setUser({ name: key })
      })
    } catch (_) {
      return unauthorizedAndLog(req, res)
    }

    next()
  }
}
