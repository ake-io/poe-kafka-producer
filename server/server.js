const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const producerRouter = require("../routes/producer");
//const AppWatchDog = require("../tools/appWatchDog");
var events = require('events-async');
const ExpressAppKafka = require("../tools/kafka/producer");
const locals = require("../config/locals");

const app = express();
app.locals = locals;
app.locals.producer = new ExpressAppKafka({
    "clientId": app.locals.kafkaProducerName,
    "brokers": app.locals.kafkaHost
});
//app.locals.appWatchDog = new AppWatchDog(app);
//console.log(app.locals);
app.locals.eventEmitter = new events.EventEmitter();
app.locals.eventEmitter.on('active-true', app.locals.producer.myEventHandlerActiveTrue);
app.locals.eventEmitter.on('active-false', app.locals.producer.myEventHandlerActiveFalse);

const specs = swaggerJsDoc(app.locals.swaggerJsDocOptions);
app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use("/producer", producerRouter);
module.exports = app