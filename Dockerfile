FROM zixia/wechaty

ONBUILD ARG NODE_ENV
ONBUILD ENV NODE_ENV $NODE_ENV

ONBUILD WORKDIR /bot

ONBUILD COPY package.json .
ONBUILD RUN jq 'del(.dependencies.wechaty)' package.json | sponge package.json \
    && npm install \
    && sudo rm -fr /tmp/* ~/.npm
ONBUILD COPY . .

CMD [ "npm", "start" ]



# FROM zixia/wechaty
# ADD ./listeners /bot/listeners
# ADD ./route /bot/route
# ADD ./package.json /bot
# ADD ./config.js /bot
# ADD ./index.js /bot
# ADD ./robot.js /bot
# RUN npm install --production
# EXPOSE 3000
# CMD ["node","index.js"]
