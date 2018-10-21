const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-test'
const glob = require('glob')
const {resolve} = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
	glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.connect = () => {
	let maxConnectTimes = 0

	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV !== 'production') {
			mongoose.set('debug', true)
		}

		mongoose.connect(db, {
			useNewUrlParser: true
		})

		mongoose.connection.on('disconnect', () => {
			maxConnectTimes++

			if (maxConnectTimes < 5) {
				mongoose.connect(db)
			} else {
				throw new Error('数据库挂了！')
			}		
		})

		mongoose.connection.on('error', err => {
			// reject()
			if (maxConnectTimes < 5) {
				mongoose.connect(db)
			} else {
				throw new Error('数据库挂了！')
			}		
			// console.log(err)
		})

		mongoose.connection.once('open', () => {
			// 测试连接数据库
			// const Dog = mongoose.model('Dog', {name: String})
			// const doga = new Dog({ name: '阿尔法'})

			// doga.save().then(() => {
			// 	console.log('wang')
			// })

			resolve()
			console.log('Mongodb Connected Successfully!')
		})
	})	
}