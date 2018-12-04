FROM node:latest as dep
RUN mkdir /sample
WORKDIR /sample
ADD package.json .
RUN ["npm", "i", "--only=production"]


 FROM cc861010/puppeteer:latest
 ADD ./listeners /wk/listeners
 ADD ./route /wk/route
 ADD ./package.json /wk/
 ADD ./config.js /wk/
 ADD ./index.js /wk/
 ADD ./robot.js /wk/
 WORKDIR /wk
 COPY --from=dep /sample/node_modules ./node_modules
 RUN ["npm", "rebuild", "-q"]
 #RUN ["npm", "i", "--only=production"]

 EXPOSE 3000
