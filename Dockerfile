FROM zixia/wechaty

ADD ./listeners /wk/listeners
ADD ./route /wk/route
ADD ./package.json /wk/
ADD ./config.js /wk/
ADD ./index.js /wk/
ADD ./robot.js /wk/

WORKDIR /wk

RUN npm install --production


EXPOSE 3000

CMD["node","index.js"]
