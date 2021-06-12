let locals = [];

locals.appName = "poe-kafka-producer"
locals.appHost = "localhost"
locals.active = false;
locals.logging = true;
locals.appWatchDogSleepTime = 5000;
locals.next_change_id='';
locals.PORT = process.env.PORT || 3000;
locals.kafkaProducerName = locals.appName;
locals.kafkaHostName = "LOCALHOST";
locals.kafkaPort = "9093";
locals.kafkaHost = [locals.kafkaHostName+":"+locals.kafkaPort];
locals.swaggerJsDocOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: locals.appName+" Library API",
			version: "0.0.1",
			description: "A "+locals.appName+" Library API",
		},
		servers: [
			{
				url: "http://"+locals.appHost+":"+locals.PORT,
			},
		],
	},
	apis: ["./routes/*.js"],
};
module.exports = locals;