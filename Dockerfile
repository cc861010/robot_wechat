
 FROM mhart/alpine-node:10
 ADD ./listeners /wk/listeners
 ADD ./route /wk/route
 ADD ./package.json /wk/
 ADD ./config.js /wk/
 ADD ./index.js /wk/
 ADD ./robot.js /wk/
 WORKDIR /wk
 COPY --from=dep /sample/node_modules ./node_modules
RUN ["npm", "i", "--only=production"]

 EXPOSE 3000
