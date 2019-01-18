export class TypeMisMatch extends Error {
  constructor(actual: string, expected: string) {
    super(`Expected Authorization: ${expected}, actual: ${actual}`)
    Error.captureStackTrace(this, this.constructor)
  }
}
