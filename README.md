# TrailerVote Express Authorization

[![Build Status](https://travis-ci.com/TrailerVote/express-authorization.svg?branch=master)](https://travis-ci.com/TrailerVote/express-authorization)

[![NPM Package Version](https://badge.fury.io/js/@trailervote%2Fexpress-authorization.svg)](https://npmjs.org/package/@trailervote/express-authorization)

Authorization middleware for TrailerVote ecosystem

```bash
yarn add @trailervote/express-authorization
```

```typescript
import { basic } from '@xpbytes/express-routes-archive'

const root = new RoutesArchive()
root.register('foo', '/test')
root.register('bar', (mountedAt: string, arg: any) => `${mountedAt}/test?bar=${arg}`)

// For example you can create these when you mount a new "Router" and pass it along
// the routes are shared among archives in the chain.
const up = new RoutesArchive('/level', root)
up.register('level', '/two')
up.register('penthouse', (mountedAt: string) => `${mountedAt}/over-9000`)

root.path('bar', 'my-arg')
// => /test?bar=my-arg

root.url('penthouse', req)
// => https://test.xpbytes.com/level/over-9000
```

You can use `SSL_ENABLED` to make generated urls `https`.
You can use `SERVER_URL` to mount the path onto that URL instead of the request hostname.
