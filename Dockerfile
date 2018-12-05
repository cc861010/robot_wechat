FROM zixia/wechaty


ADD ./listeners /bot/listeners
ADD ./route /bot/route
ADD ./package.json /bot
ADD ./config.js /bot
ADD ./index.js /bot
ADD ./robot.js /bot

RUN npm install --production


EXPOSE 3000

CMD ["node","index.js"]
