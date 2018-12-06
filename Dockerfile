FROM ubuntu:18.04

ENV DEBIAN_FRONTEND     noninteractive
ENV WECHATY_DOCKER      1
ENV LC_ALL              C.UTF-8
ENV NODE_ENV            $NODE_ENV
ENV NPM_CONFIG_LOGLEVEL warn

# Installing the 'apt-utils' package gets rid of the 'debconf: delaying package configuration, since apt-utils is not installed'
# error message when installing any other package with the apt-get package manager.
# https://peteris.rocks/blog/quiet-and-unattended-installation-with-apt-get/
RUN apt-get update && apt-get install -y --no-install-recommends \
    apt-utils \
    bash \
    build-essential \
    ca-certificates \
    curl \
    coreutils \
    ffmpeg \
    figlet \
    git \
    gnupg2 \
    jq \
    libgconf-2-4 \
    moreutils \
    python-dev \
    shellcheck \
    sudo \
    tzdata \
    vim \
    wget \
  && apt-get purge --auto-remove \
  && rm -rf /tmp/* /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge --auto-remove \
    && rm -rf /tmp/* /var/lib/apt/lists/*

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
# https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile
# Install latest chrome dev package.
# Note: this also installs the necessary libs so we don't need the previous RUN command.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y --no-install-recommends \
      google-chrome-unstable \
    && apt-get purge --auto-remove \
    && rm -rf /tmp/* /var/lib/apt/lists/* \
    && rm -rf /usr/bin/google-chrome* /opt/google/chrome-unstable

WORKDIR /bot
ADD ./listeners /bot/listeners
ADD ./route /bot/route
ADD ./package.json /bot
ADD ./config.js /bot
ADD ./index.js /bot
ADD ./robot.js /bot

# RUN npm install && sudo rm -fr /tmp/* ~/.npm

# EXPOSE 3000

# CMD [ "node", "index.js" ]



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
