//http://api.douban.com/v2/movie/subject/1764796

const rp = require('request-promise-native')

async function fetchMovie(item){
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

  const res = await rp(url)

  return res
}

;(async()=>{
  let movies = [ { doubanId: 30282106,
    title: 'Iliza: Elder Millennial',
    rate: 7.7,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2528881406.jpg' },
      { doubanId: 27098364,
        title: '超人之死',
        rate: 7.4,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526823875.jpg' }]
  movies.map(async movie=>{
    let movieData = await fetchMovie(movie)

    try{
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)
    }catch(e){
      console.log(e)
    }

    console.log(movieData)
  })
})()