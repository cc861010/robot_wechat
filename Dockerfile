FROM zixia/wechaty

WORKDIR /bot
ADD ./listeners ./listeners
ADD ./route ./route
ADD ./package.json .
ADD ./config.js .
ADD ./index.js .
ADD ./robot.js .

RUN npm install --production


EXPOSE 3000

CMD ["node","index.js"]
