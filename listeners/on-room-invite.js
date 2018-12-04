/**
 * room-invite Event will emit when there's an room invitation.
 */
const {log} = require('wechaty')

async function onRoomInvite(roomInvitation) {
    try {
        log.info(`received room-invite event.`)
        await roomInvitation.accept()
    } catch (e) {
        console.error(e)
    }
}

module.exports = onRoomInvite