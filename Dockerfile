FROM node:8

ENV MASTERMIND_VERSION='"0.1.0"'
ENV MASTERMIND_API_HOST='"localhost"'
ENV MASTERMIND_API_PORT='"3000"'
ENV MASTERMIND_OAUTH_URI='"account.lab.fiware.org"'
ENV MASTERMIND_OAUTH_CLIENT_ID='"cb19b84cbc654af2bdedaab30dc49f38"'

RUN npm install -g serve
RUN mkdir /mastermind
WORKDIR /mastermind
ADD . /mastermind
RUN npm install
RUN npm run build

EXPOSE 8080

ENTRYPOINT NODE_ENV=production serve --single -p 8080 dist
