/**
 * room-join Event will emit when someone join the room.
 */
const {log} = require('wechaty')

async function onRoomJoin(room, inviteeList, inviter) {
    log.info( 'Bot', 'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
        await room.topic(),
        inviteeList.map(c => c.name()).join(','),
        inviter.name(),
    )
    console.log('bot room-join room id:', room.id)
    const topic = await room.topic()
    await room.say(`welcome to "${topic}"!`, inviteeList[0])
}

module.exports = onRoomJoin