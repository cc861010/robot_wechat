const {log} = require('wechaty')
const config = require('../config.js')
const WebSocket = require('ws');

function broadcast(msg) {
    let data = JSON.stringify(msg)
    let ws = config["ws"]
    ws.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
            console.log("send:", data)
        }
    });
}


async function onMessage(message) {
    broadcast(message)
    let bot = this
    const room_object = message.room()
    const sender = message.from()
    const content = message.text()
    const roomName = room_object ? `[${await room_object.topic()}] ` : ''

    console.log(`==============================================message==============================================`)
    console.log(`message: ${message}`)
    console.log(`room: ${room_object}`)
    console.log(`sender: ${sender}`)
    console.log(`content: ${content}`)
    console.log(`roomName: ${roomName}`)

    let msg = {
        "content": message.text(),
        "from": message.from(),
        "roomName": message.room()? `[${await room_object.topic()}] ` : ''
    }

    broadcast(msg)

    /**
     * `dong` will be the magic(toggle) word:
     *  bot will quit current room by herself.
     */
    const room = message.room()
    const from = message.from()
    const text = message.text()

    // if (/^dong$/i.test(text)) {
    //     if (room) {
    //         await room.say('You said dong in the room, I will quit by myself!', from)
    //         await room.quit()
    //     } else {
    //         await from.say('Nothing to do. If you say "dong" in a room, I will quit from the room.')
    //     }
    //     return
    // }

    /**
     * `ding` will be the magic(toggle) word:
     *  1. say ding first time, will got a room invitation
     *  2. say ding in room, will be removed out
     */

    // if (/^ding$/i.test(text)) {
    //
    //     /**
    //      *  in-room message
    //      */
    //     if (room) {
    //         if (/^ding/i.test(await room.topic())) {
    //             /**
    //              * move contact out of room
    //              */
    //             await getOutRoom(from, room)
    //         }
    //
    //         /**
    //          * peer to peer message
    //          */
    //     } else {
    //
    //         /**
    //          * find room name start with "ding"
    //          */
    //         try {
    //             const dingRoom = await this.Room.find({topic: /^ding/i})
    //             if (dingRoom) {
    //                 /**
    //                  * room found
    //                  */
    //                 log.info('Bot', 'onMessage: got dingRoom: "%s"', await dingRoom.topic())
    //
    //                 if (await dingRoom.has(from)) {
    //                     /**
    //                      * speaker is already in room
    //                      */
    //                     const topic = await dingRoom.topic()
    //                     log.info('Bot', 'onMessage: sender has already in dingRoom')
    //                     await dingRoom.say(`I found you have joined in room "${topic}"!`, from)
    //                     await from.say(`no need to ding again, because you are already in room: "${topic}"`)
    //                     // sendMessage({
    //                     //   content: 'no need to ding again, because you are already in ding room'
    //                     //   , to: sender
    //                     // })
    //
    //                 } else {
    //                     /**
    //                      * put speaker into room
    //                      */
    //                     log.info('Bot', 'onMessage: add sender("%s") to dingRoom("%s")', from.name(), dingRoom.topic())
    //                     await from.say('ok, I will put you in ding room!')
    //                     await putInRoom(from, dingRoom)
    //                 }
    //
    //             } else {
    //                 /**
    //                  * room not found
    //                  */
    //                 log.info('Bot', 'onMessage: dingRoom not found, try to create one')
    //                 /**
    //                  * create the ding room
    //                  */
    //                 const newRoom = await createDingRoom(from)
    //                 console.log('createDingRoom id:', newRoom.id)
    //                 /**
    //                  * listen events from ding room
    //                  */
    //                 await manageDingRoom()
    //             }
    //         } catch (e) {
    //             log.error(e)
    //         }
    //     }
    // }

}

module.exports = onMessage

async function manageDingRoom() {
    log.info('Bot', 'manageDingRoom()')

    /**
     * Find Room
     */
    try {
        const room = await bot.Room.find({topic: /^ding/i})
        if (!room) {
            log.warn('Bot', 'there is no room topic ding(yet)')
            return
        }
        log.info('Bot', 'start monitor "ding" room join/leave/topic event')

        /**
         * Event: Join
         */
        room.on('join', function (inviteeList, inviter) {
            log.verbose('Bot', 'Room EVENT: join - "%s", "%s"',
                inviteeList.map(c => c.name()).join(', '),
                inviter.name(),
            )
            console.log('room.on(join) id:', this.id)
            checkRoomJoin.call(this, room, inviteeList, inviter)
        })

        /**
         * Event: Leave
         */
        room.on('leave', (leaverList, remover) => {
            log.info('Bot', 'Room EVENT: leave - "%s" leave(remover "%s"), byebye', leaverList.join(','), remover || 'unknown')
        })

        /**
         * Event: Topic Change
         */
        room.on('topic', (topic, oldTopic, changer) => {
            log.info('Bot', 'Room EVENT: topic - changed from "%s" to "%s" by member "%s"',
                oldTopic,
                topic,
                changer.name(),
            )
        })
    } catch (e) {
        log.warn('Bot', 'Room.find rejected: "%s"', e.stack)
    }
}

async function checkRoomJoin(room, inviteeList, inviter) {
    log.info('Bot', 'checkRoomJoin("%s", "%s", "%s")',
        await room.topic(),
        inviteeList.map(c => c.name()).join(','),
        inviter.name(),
    )

    try {
        // let to, content
        const userSelf = bot.userSelf()

        if (inviter.id !== userSelf.id) {

            await room.say('RULE1: Invitation is limited to me, the owner only. Please do not invit people without notify me.',
                inviter,
            )
            await room.say('Please contact me: by send "ding" to me, I will re-send you a invitation. Now I will remove you out, sorry.',
                inviteeList,
            )

            await room.topic('ding - warn ' + inviter.name())
            setTimeout(
                _ => inviteeList.forEach(c => room.del(c)),
                10 * 1000,
            )

        } else {

            await room.say('Welcome to my room! :)')

            let welcomeTopic
            welcomeTopic = inviteeList.map(c => c.name()).join(', ')
            await room.topic('ding - welcome ' + welcomeTopic)
        }

    } catch (e) {
        log.error('Bot', 'checkRoomJoin() exception: %s', e.stack)
    }

}

async function putInRoom(contact, room) {
    log.info('Bot', 'putInRoom("%s", "%s")', contact.name(), await room.topic())

    try {
        await room.add(contact)
        setTimeout(
            _ => room.say('Welcome ', contact),
            10 * 1000,
        )
    } catch (e) {
        log.error('Bot', 'putInRoom() exception: ' + e.stack)
    }
}

async function getOutRoom(contact, room) {
    log.info('Bot', 'getOutRoom("%s", "%s")', contact, room)

    try {
        await room.say('You said "ding" in my room, I will remove you out.')
        await room.del(contact)
    } catch (e) {
        log.error('Bot', 'getOutRoom() exception: ' + e.stack)
    }
}

function getHelperContact() {
    log.info('Bot', 'getHelperContact()')

    // create a new room at least need 3 contacts
    return bot.Contact.find({name: HELPER_CONTACT_NAME})
}

async function createDingRoom(contact) {
    log.info('Bot', 'createDingRoom("%s")', contact)

    try {
        const helperContact = await getHelperContact()

        if (!helperContact) {
            log.warn('Bot', 'getHelperContact() found nobody')
            await contact.say(`You don't have a friend called "${HELPER_CONTACT_NAME}",
                         because create a new room at least need 3 contacts, please set [HELPER_CONTACT_NAME] in the code first!`)
            return
        }

        log.info('Bot', 'getHelperContact() ok. got: "%s"', helperContact.name())

        const contactList = [contact, helperContact]
        log.verbose('Bot', 'contactList: "%s"', contactList.join(','))

        await contact.say(`There isn't ding room. I'm trying to create a room with "${helperContact.name()}" and you`)
        const room = await bot.Room.create(contactList, 'ding')
        log.info('Bot', 'createDingRoom() new ding room created: "%s"', room)

        await room.topic('ding - created')
        await room.say('ding - created')

        return room

    } catch (e) {
        log.error('Bot', 'getHelperContact() exception:', e.stack)
        throw e
    }
}