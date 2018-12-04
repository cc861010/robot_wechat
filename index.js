const config = require('./config')
const {startRobot, robot, logout} = require("./robot")

const fastify = require('fastify')({
    logger: {
        level: 'info',
        file: '/tmp/log' // will use pino.destination()
    }
})

fastify.listen(3000, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    if (!config["bot"]) {
        startRobot().then(function (bot) {
            fastify.log.info({status: 0, data: {}})
            fastify.log.info("start web wechat service")
        }).catch(function (e) {
            fastify.log.error(e)
            process.exit(1)
        })
    } else {
        fastify.log.info({status: 2, data: "web wechat service is running"})
    }
    fastify.log.info(`server listening on ${address}`)
})

fastify.register(require('./route/robot_controller'))
fastify.register(require('fastify-ws'), {
    library: 'ws' // Use the uws library instead of the default ws library
})


fastify.ready(err => {
    if (err) throw err
    console.log('Server started.')
    config["ws"] = fastify.ws
    fastify.ws.on('connection', socket => {
        console.log('client connected')
        // setInterval(function ping() {
        //     fastify.ws.clients.forEach(function each(ws) {
        //         if (ws.isAlive === false) return ws.terminate();
        //         ws.isAlive = false;
        //         ws.ping(() => {
        //         });
        //     });
        // }, 30000);

        socket.on('close', () => {
            console.log('client disconnected, remove from config')
        })

        socket.on('message', function incoming(message) {
            console.log('received: %s', message);
        });

        socket.send('connected');

    })
})

