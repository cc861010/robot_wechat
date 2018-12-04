const {startRobot, robot, logout} = require("../robot")
const config = require('../config')
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'route', 'doc.json');

async function robot_controller(fastify, options) {

    fastify.get('/', async (request, reply) => {
        const stream = require('fs').createReadStream(jsonPath)
        reply.type('text/json').send(stream)
    })

    fastify.get('/me', options, async function (request, reply) {
        let bot = config["bot"]
        if (bot.logonoff()) {
            console.log('Bot is online')
            reply.send({status: 0, data: bot.userSelf()})
        } else {
            console.log('Bot is offline')
            reply.send({status: 1, data: "It is offline"})
        }
    })


    fastify.get('/logout', options, async function (request, reply) {
        let bot = config["bot"]
        if (bot.logonoff()) {
            await bot.logout()
            config["users"] = null
            config["rooms"] = null
            reply.send({status: 0, data: "log out successfully"})
            console.log('Bot is offline')
        } else {
            reply.send({status: 1, data: "it is offline"})
            console.log('Bot is offline')
        }
    })

    fastify.get('/login', options, function (request, reply) {
        if (config["qrcode"]) {
            reply.send({status: 0, data: config["qrcode"]})
        } else {
            reply.send({status: 1, data: "try again after three seconds"})
        }
    })

    fastify.get('/users_force_reload', options, async function (request, reply) {
        try {
            let list = await robot.Contact.findAll()
            console.log(`all contacts is ${list}`)
            config["users"] = list
            reply.send({status: 0, data: list})
        } catch (e) {
            reply.send({status: 1, data: "fail to reload"})
        }
    })

    fastify.get('/rooms_force_reload', options, async function (request, reply) {
        try {
            let list = await robot.Room.findAll()
            console.log(`all rooms is ${list}`)
            config["rooms"] = list
            reply.send({status: 0, data: list})
        } catch (e) {
            reply.send({status: 1, data: "fail to reload"})
        }
    })


    fastify.get('/users/:reg/:message', options, async function (request, reply) {
        let reg = request.params.reg
        let message = request.params.message
        if (!reg || reg.toString() === "" || !message || message.toString() === "") {
            reply.send({status: 1, data: "Illegal request"})
            return
        }
        let re = new RegExp(reg);
        if (!config["users"]) {
            config["users"] = await robot.Contact.findAll()
        }
        let list = config["users"].filter((user) => {
            return re.test(JSON.stringify(user)) ? true : false
        })
        if (list.length == 1) {
            let contact = list[0]
            try {
                await contact.say(message)
                reply.send({status: 0, data: "send  message to a user successfully"})
            } catch (e) {
                reply.send({status: 2, data: "send unsuccessfully because of a exception"})
            }
        } else if (list.length == 0) {
            reply.send({status: 3, data: "cant find any user by this RegExp"})
        } else {
            reply.send({status: 4, data: `find [${list.length}] users by this RegExp`})
        }
    })


    fastify.get('/rooms/:reg/:message', options, async function (request, reply) {
        let reg = request.params.reg
        let message = request.params.message
        if (!reg || reg.toString() === "" || !message || message.toString() === "") {
            reply.send({status: 1, data: "Illegal request"})
            return
        }
        let re = new RegExp(reg);
        if (!config["rooms"]) {
            config["rooms"] = await robot.Room.findAll()
        }
        let list = config["rooms"].filter((room) => {
            return re.test(JSON.stringify(room)) ? true : false
        })
        if (list.length == 1) {
            let room = list[0]
            try {
                await room.say(message)
                reply.send({status: 0, data: "send  message to a room successfully"})
            } catch (e) {
                reply.send({status: 2, data: "send unsuccessfully because of a exception"})
            }
        } else if (list.length == 0) {
            reply.send({status: 3, data: "cant find any room by this RegExp"})
        } else {
            reply.send({status: 4, data: `find [${list.length}] rooms by this RegExp`})
        }
    })


    fastify.get('/users/:reg', options, async function (request, reply) {
        let reg = request.params.reg
        if (!reg || reg.toString() === "") {
            reply.send({status: 1, data: "Illegal request"})
            return
        }
        let re = new RegExp(reg);
        if (!config["users"]) {
            config["users"] = await robot.Contact.findAll()
        }
        let list = config["users"].filter((user) => {
            return re.test(JSON.stringify(user)) ? true : false
        })
        console.log(`search users result is ${list}`)
        reply.send({status: 0, data: list})
        return
    })


    fastify.get('/rooms/:reg', options, async function (request, reply) {
        let reg = request.params.reg
        if (!reg || reg.toString() === "") {
            reply.send({status: 1, data: "Illegal request"})
            return
        }
        let re = new RegExp(reg);
        if (!config["rooms"]) {
            config["rooms"] = await robot.Room.findAll()
        }
        let list = config["rooms"].filter((room) => {
            return re.test(JSON.stringify(room)) ? true : false
        })
        console.log(`search rooms result is ${list}`)
        reply.send({status: 0, data: list})
        return
    })


    fastify.get('/msg/:id/:message', options, async function (request, reply) {
        let id = request.params.id
        let message = request.params.message
        if (!id || id.toString() === "" || !message || message.toString() === "") {
            reply.send({status: 1, data: "Illegal request"})
            return
        }
        let contact = robot.Contact.load(id)
        if (contact) {
            try {
                await contact.say(message)
                reply.send({status: 0, data: "send user message successfully"})
            } catch (e) {
                reply.send({status: 2, data: "send user message unsuccessfully because of a exception"})
            }
        } else {
            let room = robot.Room.load(id)
            if (room) {
                try {
                    await room.say(message)
                    reply.send({status: 0, data: "send room message successfully"})
                } catch (e) {
                    reply.send({status: 3, data: "send room message unsuccessfully because of a exception"})
                }
            } else {
                reply.send({status: 4, data: "cant find room or user by id"})
            }
        }
    })

}

module.exports = robot_controller

