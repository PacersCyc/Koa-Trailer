const { readFile, readFileSync } = require('fs')
const { resolve } = require('path')

setImmediate(() => {
	console.log('[阶段3 immediate] immediate回调1')
})
setImmediate(() => {
	console.log('[阶段3 immediate] immediate回调2')
})
setImmediate(() => {
	console.log('[阶段3 immediate] immediate回调3')
})


Promise.resolve().then(() => {
	console.log('[...待切入下一阶段] promise回调1')

	setImmediate(() => {
		console.log('[阶段3 immediate] promise回调1里面新增的immediate回调4')
	})
})


readFile('../package.json', 'utf-8', data => {
	console.log('[阶段2 IO回调] 读文件回调1')

	readFile('../video.mp4', 'utf-8', data => {
		console.log('[阶段2 IO回调] 读文件回调2')

		setImmediate(() => {
			console.log('[阶段3 immediate] 读文件回调2中增加的immediate回调5')
		})
	})

	setImmediate(() => {
		console.log('[阶段3 immediate] immediate回调4')

		Promise.resolve().then(() => {
			console.log('[...待切入下一阶段] promise回调2')

			process.nextTick(() => {
				console.log('[...待切入下一阶段] promise回调2中增加的nextTick回调6')
			})
		}).then(() => {
			console.log('[...待切入下一阶段] promise回调3')
		})
	})

	setImmediate(() => {
		console.log('[阶段3 immediate] immediate回调5')

		process.nextTick(() => {
			console.log('[...待切入下一阶段] immediate回调5中增加的nextTick回调7')
		})

		console.log('[...待切入下一阶段] 正在读一个视频文件...')
		const video = readFileSync(resolve(__dirname, '../video.mp4'), 'utf-8')

		process.nextTick(() => {
			console.log('[...待切入下一阶段] immediate回调5中增加的nextTick回调8')
		})

		readFile('../package.json', 'utf-8', data => {
			console.log('[阶段2 IO回调] 读文件回调3')

			setImmediate(() => {
				console.log('[阶段3 immediate] 读文件回调3中增加的immediate回调6')
			})

			setTimeout(function() {
				console.log('[阶段1...定时器] 读文件回调3中增加的定时器回调8')
			}, 0);
		})
	})

	process.nextTick(() => {
		console.log('[...待切入下一阶段] 读文件回调1中增加的nextTick回调6')
	})

	setTimeout(function () {
		console.log('[阶段1...定时器] 定时器回调5')
	}, 0);
	setTimeout(function () {
		console.log('[阶段1...定时器] 定时器回调6')
	}, 0);
})

setTimeout(function() {
	console.log('[阶段1...定时器] 定时器回调1')
}, 0);
setTimeout(function () {
	console.log('[阶段1...定时器] 定时器回调2')

	process.nextTick(() => {
		console.log('[...待切入下一阶段] nextTick回调5')
	})
}, 0);
setTimeout(function () {
	console.log('[阶段1...定时器] 定时器回调3')
}, 0);
setTimeout(function () {
	console.log('[阶段1...定时器] 定时器回调4')
}, 0);


process.nextTick(() => {
	console.log('[...待切入下一阶段] nextTick回调1')
})
process.nextTick(() => {
	console.log('[...待切入下一阶段] nextTick回调2')
	process.nextTick(() => {
		console.log('[...待切入下一阶段] nextTick回调4')
	})
})
process.nextTick(() => {
	console.log('[...待切入下一阶段] nextTick回调3')
})