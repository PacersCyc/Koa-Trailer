
const url = 'https://movie.douban.com/tag/#/?sort=R&range=7,10&tags=%E7%94%B5%E5%BD%B1'

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
  await page.goto(url, {
    waitUntil:'networkidle2'
  })

  await sleep(3000)

  await page.waitForSelector('.more')

  for(let i=0;i<1;i++){
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if(items.length>=1){
      items.each((index, item)=>{
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('.pic img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()

  console.log(result)
})()