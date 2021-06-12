const ExpressAppKafka = require("./kafka/producer");
class AppWatchDog{
	constructor(app) {
		this.app = app;
		this.producer = new ExpressAppKafka({
			"clientId": this.app.locals.kafkaProducerName,
			"brokers": this.app.locals.kafkaHost
		});
		this.run();
	}
	async run(){
		try {
			while(true) {
				if (this.app.locals.logging) console.log("WatchDog: Active: "+this.app.locals.active+" Logging: "+this.app.locals.logging)
				if (this.app.locals.logging) console.log("WatchDog: sleeping for "+this.app.locals.appWatchDogSleepTime/1000 +" seconds ...");
				if (!this.producer.getStatus() && this.app.locals.active) {
					this.producer.wakeUp();
				} else if (this.producer.getStatus() && !this.app.locals.active) {
					this.producer.sleep();
				}
				else {
					if (this.app.locals.logging) console.log("WatchDog: Keine Änderung")
				}
				//console.log(app.locals)
				await new Promise(r => setTimeout(r, this.app.locals.appWatchDogSleepTime));
			}
		}
		catch (error) {
			console.log(error)
			if (this.app.locals.logging) console.log("WatchDog: has ended!");
		}
		finally{
			if (this.app.locals.logging) console.log("WatchDog: has ended!")
		}
	}

}

async function appWatchDog(app){
	try {
		while(true) {
			if (app.locals.logging) console.log("WatchDog: Active: "+app.locals.active+" Logging: "+app.locals.logging)
			if (app.locals.logging) console.log("WatchDog: sleeping for "+app.locals.appWatchDogSleepTime/1000 +" seconds ...");
			//console.log(app.locals)
			await new Promise(r => setTimeout(r, app.locals.appWatchDogSleepTime));
		}
	}
	catch (error) {
		console.log(error)
		if (app.locals.logging) console.log("WatchDog: has ended!");
	}
	finally{
		if (app.locals.logging) console.log("WatchDog: has ended!")
	}

}
module.exports =  AppWatchDog