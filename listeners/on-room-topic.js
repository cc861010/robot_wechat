/**
 * room-topic Event will emit when someone change the room's topic.
 */
const {log} = require('wechaty')

async function onRoomTopic(room, topic, oldTopic, changer) {
    try {
        log.info('Bot', 'EVENT: room-topic - Room "%s" change topic from "%s" to "%s" by member "%s"',
            room,
            oldTopic,
            topic,
            changer,
        )
        await room.say(`room-topic - change topic from "${oldTopic}" to "${topic}" by member "${changer.name()}"` )
    } catch (e) {
        log.error('Bot', 'room-topic event exception: %s', e.stack)
    }
}

module.exports = onRoomTopic