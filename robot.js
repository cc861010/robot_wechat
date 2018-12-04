/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

/**
 * Wechaty hot import bot example
 *
 * Hot import Wechaty listenser functions after change the source code without restart the program
 *
 * How to start:
 * ```shell
 * docker run -t -i --rm --name wechaty --mount type=bind,source="$(pwd)",target=/bot -m "300M" --memory-swap "1G" zixia/wechaty index.js
 * ```
 *
 * P.S. We are using the hot-import module:
 *   * Hot Module Replacement(HMR) for Node.js
 *   * https://www.npmjs.com/package/hot-import
 *
 */
const {Wechaty, log} = require('wechaty')
const finis = require('finis')
const config = require('./config.js')

//const robot = Wechaty.instance({profile: "default"})
const robot = Wechaty.instance()

async function startRobot() {
    return new Promise(function (resolve, reject) {
        robot.on('friendship', './listeners/on-friendship')
            .on('login', './listeners/on-login')
            .on('message', './listeners/on-message')
            // .on('message', async function (msg) {
            //     console.log("---------------------++++---------------------------------")
            // })
            .on('scan', './listeners/on-scan')
            .on('room-invite', './listeners/on-room-invite')
            .on('room-join', './listeners/on-room-join')
            .on('room-leave', './listeners/on-room-leave')
            .on('room-topic', './listeners/on-room-topic')
            .on('error', (error) => {
                log.error("robot", error)
            })
            .start()
            .then(function () {
                config["bot"] = robot
                resolve(robot)
            })
            .catch(async function (e) {
                console.log(`Init() fail: ${e}.`)
                await stopRobot()
                reject(e)
            })
    })
}

async function logout() {
    // await robot.stop()
    await robot.logout()
    // config["bot"] = null
}


finis(async (code, signal, error) => {
    if (robot.logonoff()) {
        await robot.logout()
        config["users"] = null
        config["rooms"] = null
        console.log('Bot is offline')
    } else {
        console.log('Bot is offline')
    }
    await robot.stop()
    console.log(`Service exit ${code} because of ${signal}/${error})`)
    process.exit(1)
})

module.exports = {startRobot, robot, logout}