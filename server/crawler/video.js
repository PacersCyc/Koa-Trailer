
const base = 'https://movie.douban.com/subject/'
const doubanId = '26336252'
const videoBase = 'https://movie.douban.com/trailer/234412/#content'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const puppeteer = require('puppeteer')

;(async ()=>{
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    //手动下载Chromium并指定路径
    executablePath: '../../../../chromev70.0.3518.0/chrome.exe',
    args:['--no-sandbox'],
    dumpio:false
  })
  const page = await browser.newPage()
  await page.goto(base + doubanId, {
    waitUntil:'networkidle2'
  })

  await sleep(1000)

  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')

    if(it && it.length>0){
      var link = it.attr('href')
      //var cover = it.find('img').attr('src')
      var cover = it[0].style['background-image'].split(')')[0].slice(5)
      return {
        link,
        cover
      }
    }
    return {}
  })

  let video

  if(result.link){
    await page.goto(result.link, {
      waitUntil:'networkidle2'
    })
    await sleep(2000)

    video = await page.evaluate(()=>{
      var $ = window.$
      var it = $('source')

      if(it && it.length>0){
        return it.attr('src')
      }
      return ''
    })
  }
  const data = {
    video,
    doubanId,
    cover:result.cover
  }

  browser.close()

  console.log(result)

  process.send(data)
  process.exit(0)
})()