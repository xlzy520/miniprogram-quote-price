const {
  Router,
} = require('uni-cloud-router')
const router = new Router(require('./config.js'))

exports.main = async (event, context) => router.serve(event, context)
