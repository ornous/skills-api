FROM node:8-alpine
RUN yarn add cucumber selenium-webdriver@3.4.0 chromedriver@2.29.0

CMD [ "./node_modules/.bin/cucumber.js", "--dry-run", "--no-strict" ]
