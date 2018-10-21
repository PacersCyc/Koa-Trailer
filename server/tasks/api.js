// http://api.douban.com/v2/movie/subject/1764796

const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie(item){
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`

  const res = await rp(url)

  let body

  try {
    body = JSON.parse(res)
  } catch(err) {
    console.log(err)
  }
  console.log(body)
  return body
}

;(async()=>{
  // let movies = [ { doubanId: 30282106,
  //   title: 'Iliza: Elder Millennial',
  //   rate: 7.7,
  //   poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2528881406.jpg' },
  //     { doubanId: 27098364,
  //       title: '超人之死',
  //       rate: 7.4,
  //       poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526823875.jpg' }]

  let movies = await Movie.find({
    $or: [
      {summary: {
        $exists: false
      }},
      {summary: null},
      {title: ''},
      {year: {
        $exists: false
      }},
      {summary: ''}
    ]
  })

  for(let i = 0;i < movies.length;i++){
  // for (let i = 0; i < [movies[0]].length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)
    console.log(movieData)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for(let i=0; i<movie.movieTypes.length;i++){
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }
        // movie.movieTypes.forEach(async item => {
          
        // })

        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = (parts[1] && parts[1].split(')')[0]) || '未知'

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      console.log(movie)
      await movie.save()
    }
  }

  // movies.map(async movie=>{
  //   let movieData = await fetchMovie(movie)

  //   try{
  //     movieData = JSON.parse(movieData)
  //     console.log(movieData.tags)
  //     console.log(movieData.summary)
  //   }catch(e){
  //     console.log(e)
  //   }

  //   console.log(movieData)
  // })
})()
