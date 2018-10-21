
const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const views = require('koa-views')
const {resolve} = require('path')
const {connect, initSchemas} = require('./database/init')
const router = require('./routes')

;(async () => {
  await connect()

  initSchemas()

  // const Movie = mongoose.model('Movie')

  // const movies = await Movie.find({})

  // console.log(movies)

  // require('./tasks/movie')
  require('./tasks/api')
})()

app.use(router.routes())
  .use(router.allowedMethods())

app.use(views(resolve(__dirname, './views'), {
  extension:'pug'
}))

app.use(async (ctx, next)=>{
  await ctx.render('index', {
    you:'Luke',
    me:'cyc'
  })
})

app.listen(4000)