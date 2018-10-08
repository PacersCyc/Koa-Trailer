
let movies = [{
  video: 'http://vt1.doubanio.com/201808102330/b938bcc4f2827929ff1f089d0af18aa4/view/movie/M/402340412.mp4',
  doubanId: '26336252',
  cover: 'https://img3.doubanio.com/img/trailer/medium/2529391842.jpg?1532926130',
  poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2529365085.jpg'
}]


const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key)=>{
  return new Promise((resolve, reject)=>{
    client.fetch(url, bucket, key, (err, ret, info)=>{
      if(err){
        console.log(err)
      }else{
        if(info.statusCode === 200){
          resolve({key})
        }else{
          reject(info)
        }
      }
    })
  })
}

;(async ()=>{
  let movies = [{
    video: 'http://vt1.doubanio.com/201808102330/b938bcc4f2827929ff1f089d0af18aa4/view/movie/M/402340412.mp4',
    doubanId: '26336252',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2529391842.jpg?1532926130',
    poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2529365085.jpg'
  }]
  movies.map(async (movie)=>{
    if(movie.video && !movie.key){
      try{
        console.log('开始传 video')
        let videoData = await uploadToQiniu(movie.video, nanoid()+'.mp4')
        console.log('开始传 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid()+'.jpg')
        console.log('开始传 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid()+'.jpg')

        if(videoData.key){
          movie.videoKey = videoData.key
        }
        if(coverData.key){
          movie.coverKey = coverData.key
        }
        if(posterData.key){
          movie.posterKey = posterData.key
        }

        console.log(movie)
      }catch(e){
        console.log(e)
      }
    }
  })
})()