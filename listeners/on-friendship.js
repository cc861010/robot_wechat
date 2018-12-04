/**
 *  自动接收好友请求并确认，回复 "hello"
 */
const {Friendship,log} = require('wechaty')
async function onFriendship(friendship) {
    let logMsg
    // const fileHelper = bot.Contact.load('filehelper')
    try {
        logMsg = 'received `friend` event from ' + friendship.contact().name()
        // await fileHelper.say(logMsg)
        log.info("onFriendship",logMsg)

        switch (friendship.type()) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            case Friendship.Type.Receive:
                logMsg = 'New Friend Request' + friendship.contact().name()
                // log.info('before accept')
                await friendship.accept()
                // if want to send msg , you need to delay sometimes
                await new Promise(r => setTimeout(r, 1000))
                await friendship.contact().say('hello')
                // log.info('after accept')
                break
            /**
             *
             * 2. Friend Ship Confirmed
             *
             */
            case Friendship.Type.Confirm:
                logMsg = 'friend ship confirmed with ' + friendship.contact().name()
                break
        }
    } catch (e) {
        logMsg = e.message
    }
    log.info("onFriendship",logMsg)
    // await fileHelper.say(logMsg)
}

module.exports = onFriendship