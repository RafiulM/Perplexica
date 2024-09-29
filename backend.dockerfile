FROM node:lts-slim

ARG SEARXNG_API_URL
ENV SEARXNG_API_URL=${SEARXNG_API_URL}

WORKDIR /home/perplexica

COPY src /home/perplexica/src
COPY tsconfig.json /home/perplexica/
COPY config.toml /home/perplexica/
COPY drizzle.config.ts /home/perplexica/
COPY package.json /home/perplexica/
COPY yarn.lock /home/perplexica/

RUN mkdir /home/perplexica/data

RUN apt-get update || : && apt-get install -y \
    python-is-python3 \
    build-essential

RUN python3 --version

RUN yarn --network-timeout 100000
RUN yarn install 
RUN yarn build

CMD ["yarn", "start"]