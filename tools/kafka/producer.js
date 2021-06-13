const { Kafka } = require("kafkajs")
const getNinjaChangeID = require("../poeNinjaApi")
const getPublicStashTabs = require("../poeApi")

class ExpressAppKafka extends Kafka {
    active = false;
    fetching = false;
    producer = this.producer();
    next_change_id = "";
    
    myEventHandlerActiveTrue = function (producer) {
        producer.wakeUp();
      }
    myEventHandlerActiveFalse = function (producer) {
        producer.sleep();
      } 

    async wakeUp() {
        try{
            if (!this.active){
                console.log("ExpressAppKafka: Ich wache auf");
                this.active = true;
                await this.producer.connect();
                console.log("ExpressAppKafka: Connected!");
                this.next_change_id = await getNinjaChangeID();
                console.log("ExpressAppKafka: Starting with poe.ninja next_change_id: "+this.next_change_id);
                this.fetchData();
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
    async sleep() {
        try{
            while(this.processingN) {
                console.log("ExpressAppKafka: Waiting for processing")
                await new Promise(r => setTimeout(r, 1000));
            }
            if(this.active){
                console.log("ExpressAppKafka: Ich lege mich schlafen")
                this.active = false;
                await this.producer.disconnect();
                console.log("ExpressAppKafka: Disconnected!")
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
    getStatus() {
        return this.active;
    }
    async fetchData() {
        try{
            while (this.active) {
                let data = await getPublicStashTabs(this.next_change_id);
                this.processData(data);
                this.next_change_id = data.next_change_id;
                console.log("ExpressAppKafka: PublicStashTabs next_change_id: "+this.next_change_id);
                await new Promise(r => setTimeout(r, 2000));
                console.log('ExpressAppKafka: Two seconds later, fetching next');
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    }
    async processData(data) {
        try {
            let that = this;
            that.processing = true;
            console.log("ExpressAppKafka: Num-Stashes fetched: " +  Object.keys(data.stashes).length);
            var ultimatumOnlyStashes = JSON.parse(JSON.stringify(data.stashes)).filter(function (entry) {
            return entry.league === 'Ultimatum';
            });
            console.log("ExpressAppKafka: Num-Stashes(Ultimatum): " + Object.keys(ultimatumOnlyStashes).length);
            let no_jewels = 0
            Object.keys(ultimatumOnlyStashes).forEach(async function (key1) {
            //console.log(key1, ultimatumOnlyStashes[key1].accountName);
            Object.keys(ultimatumOnlyStashes[key1].items).forEach(async function (key2) {
            if (ultimatumOnlyStashes[key1].items[key2].extended.category === 'jewels') {
                //console.log(ultimatumOnlyStashes[key1].items[key2]);
                no_jewels = no_jewels + 1;
                try{
                    const result = await that.producer.send({
                        "topic": "Stashes",
                        "messages": [
                            {
                                "value": JSON.stringify(ultimatumOnlyStashes[key1].items[key2]),
                                "partition": 0
                            }
                        ]
                    })
    
                    //console.log(`Send Successfully! ${JSON.stringify(result)}`)
                } catch (error) {
                    console.log(error);
                }
                finally{

                }
                
            } 
            that.processing = false;
        });
        
    });
    console.log("ExpressAppKafka: Num-Jewels transfered(Ultimatum): " + no_jewels);
    
        } catch (error) {
            console.log(error);
            this.processing = false;
        }
        finally{
            this.processing = false;
        }
        
    }
 
}
module.exports = ExpressAppKafka


// async function fetchData(app) {
//     try {
//         const kafka = new Kafka({
//             "clientId": "myapp",
//             "brokers": ["localhost:9093"]
//         });
//         const producer = kafka.producer();
//         console.log("Connecting.....")
//         await producer.connect()
//         console.log("Connected!")
//         next_change_id = await getNinjaChangeID()
//         console.log("Starting with poe.ninja next_change_id: "+next_change_id);
//         while (app.locals.active) {
//             await new Promise(r => setTimeout(r, 2000));
//             console.log('One second later, showing sleep in a loop...');
//             data = await getPublicStashTabs(next_change_id);
//             processData(data,producer);
//             next_change_id = data.next_change_id;
//             console.log("PublicStashTabs next_change_id: "+next_change_id);
//         }
//     }
//     catch (error) {
//         //await producer.disconnect();
//         console.log(error)
//     }
//     finally {
//         //await producer.disconnect();
//         console.log("Disconnected!")
//     }
// }

// function processData(data, producer){
//     console.log("Num-Stashes fetched: " +  Object.keys(data.stashes).length);
//     var ultimatumOnlyStashes = JSON.parse(JSON.stringify(data.stashes)).filter(function (entry) {
//         return entry.league === 'Ultimatum';
//     });
//     console.log("Num-Stashes(Ultimatum): " + Object.keys(ultimatumOnlyStashes).length);
//     no_jewels = 0
//     Object.keys(ultimatumOnlyStashes).forEach(async function (key1) {
//         //console.log(key1, ultimatumOnlyStashes[key1].accountName);
//         Object.keys(ultimatumOnlyStashes[key1].items).forEach(async function (key2) {
//             if (ultimatumOnlyStashes[key1].items[key2].extended.category === 'jewels') {
//                 //console.log(ultimatumOnlyStashes[key1].items[key2]);
//                 no_jewels = no_jewels + 1;
//                 const result = await producer.send({
//                     "topic": "Stashes",
//                     "messages": [
//                         {
//                             "value": JSON.stringify(ultimatumOnlyStashes[key1].items[key2]),
//                             "partition": 0
//                         }
//                     ]
//                 })

//                 //console.log(`Send Successfully! ${JSON.stringify(result)}`)
//             }
//         });
//     });
//     console.log("Num-Jewels transfered(Ultimatum): " + no_jewels);
// }


// ALPHA version
// async function run(next_change_id) {
//     try {
//         await axios.get('https://www.pathofexile.com/api/public-stash-tabs?id=' + next_change_id, config)
//             .then(async function (response) {
//                 console.log(response.data.next_change_id)
//                 var countKey = Object.keys(response.data.stashes).length;
//                 console.log("Num-Stashes: " + countKey);
//                 var my_json = JSON.stringify(response.data.stashes);

//                 var ultimatumOnly = JSON.parse(my_json).filter(function (entry) {
//                     return entry.league === 'Ultimatum';
//                 });

//                 var countKey = Object.keys(ultimatumOnly).length;
//                 console.log("Num-Stashes(Ultimatum): " + countKey);
//                 const kafka = new Kafka({
//                     "clientId": "myapp",
//                     "brokers": ["localhost:9093"]
//                 })

//                 const producer = kafka.producer();
//                 console.log("Connecting.....")
//                 await producer.connect()
//                 console.log("Connected!")
//                 Object.keys(ultimatumOnly[0].items).forEach(async function (key) {
//                     if (ultimatumOnly[0].items[key].extended.category === 'jewels') {
//                         console.log(key, ultimatumOnly[0].items[key]);
//                         //A-M 0 , N-Z 1 
//                         //const partition = msg[0] < "N" ? 0 : 1;
//                         const result = await producer.send({
//                             "topic": "Stashes",
//                             "messages": [
//                                 {
//                                     "value": JSON.stringify(ultimatumOnly[0].items[key]),
//                                     "partition": 0
//                                 }
//                             ]
//                         })

//                         console.log(`Send Successfully! ${JSON.stringify(result)}`)
//                     }
//                 }

//                 );
//                 await producer.disconnect();
//             })
//     }
//     catch (ex) {
//         console.error(`Something bad happened ${ex}`)
//     }
//     finally {
//         //process.exit(0);
//     }


// }