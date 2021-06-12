const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const producerRouter = require("../routes/producer");
const AppWatchDog = require("../tools/appWatchDog");
const locals = require("../config/locals");

const app = express();
app.locals = locals;
app.locals.appWatchDog = new AppWatchDog(app);
//console.log(app.locals);

const specs = swaggerJsDoc(app.locals.swaggerJsDocOptions);
app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use("/producer", producerRouter);
module.exports = app