
 FROM mhart/alpine-node:10
 
 RUN apk update \
    && apk add tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
 
 ADD ./listeners /wk/listeners
 ADD ./route /wk/route
 ADD ./package.json /wk/
 ADD ./config.js /wk/
 ADD ./index.js /wk/
 ADD ./robot.js /wk/
 WORKDIR /wk
 
 RUN apk add --no-cache --virtual .build-deps make gcc g++ python \
 && npm install --production --silent \
 && apk del .build-deps
 

 EXPOSE 3000
