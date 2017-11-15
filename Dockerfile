FROM node:6
ENV MASTERMIND_VERSION=0.1.0
RUN mkdir /mastermind
WORKDIR /mastermind
ADD . /mastermind
RUN npm cache clean && npm install
EXPOSE 8080
ENTRYPOINT npm run dev
