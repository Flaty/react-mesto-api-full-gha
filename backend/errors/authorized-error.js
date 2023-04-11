const { UNAUTHORIZED_ERROR } = require('./statusCode');

class Authorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
module.exports = Authorized;
