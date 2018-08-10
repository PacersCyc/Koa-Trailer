
const doSync = (sth, time)=>new Promise(resolve => {
    setTimeout(()=>{
      console.log(sth+' use '+time+' ms')
      resolve()
    }, time)
  })

const doAsync = (sth, time, cb) => {
    setTimeout(() => {
      console.log(sth + ' use ' + time + ' ms')
      cb && cb()
    }, time)
  }

const doElse = (sth) => {
    console.log(sth)
  }

const Scott = {doSync, doAsync}
const Girl = {doSync, doAsync, doElse}

;(async ()=>{
  console.log('case1: came to bathroom')
  await Scott.doSync('brushtooth', 1000)
  console.log('waiting')
  await Girl.doSync('bath', 2000)
  Girl.doElse('finished, go on')
  //console.log('finished, go on')


  console.log('case3: came to bathroom')
  Scott.doAsync('Scott brush tooth', 1000, ()=>{
    console.log('room notify the girl')
    Girl.doAsync('have a shower', 2000)
  })
  Girl.doElse('finished, go on')
})()