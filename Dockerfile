FROM node:6
RUN mkdir /mastermind
WORKDIR /mastermind
ADD . /mastermind
RUN npm cache clean && npm install
EXPOSE 8080
ENTRYPOINT npm run dev
