//http://vt1.doubanio.com/201808102256/44401c719da377d0abd397e3190c0f52/view/movie/M/402340412.mp4

const cp = require('child_process')
const { resolve } = require('path')

;(async()=>{
  const script = resolve(__dirname, '../crawler/video')
  const child = cp.fork(script, [])

  let invoked = false

  child.on('error', err=>{
    if(invoked){return}
    invoked = true

    console.log(err)
  })

  child.on('exit', code=>{
    if(invoked){return}
    invoked = true

    let err = code===0?null:new Error('exit code '+code)
    console.log(err)
  })

  child.on('message', data=>{
    console.log(data)
  })
})()