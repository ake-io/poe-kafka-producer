
const express = require('express');
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerJsdoc = require('swagger-jsdoc');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Kafka-Producer-POE-PublicStashReader:
 *       type: object
 *       required:
 *         - active
 *         - logging
 *       properties:
 *         active:
 *           type: boolean
 *           description: Should service be on?
 *         logging:
 *           type: boolean
 *           description: Should logging be enabled?
 *       example:
 *         active: true
 *         logging: false
 */

 /**
  * @swagger
  * tags:
  *   name: Kafka-Producer-POE-PublicStashReader
  *   description: The Kafka-Producer-POE-PublicStashReader managing API
  */

 /**
 * @swagger
 * /producer:
 *   get:
 *     summary: Returns the status of the producer
 *     tags: [Kafka-Producer-POE-PublicStashReader]
 *     responses:
 *       200:
 *         description: The status of the producer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Kafka-Producer-POE-PublicStashReader'
 */
 router.get('/', (req, res) => {
    res.send({
        'active': req.app.locals.active,
        'logging': req.app.locals.logging
    });
  });

/**
 * @swagger
 * /producer:
 *   post:
 *     summary: Set the status of the producer
 *     tags: [Kafka-Producer-POE-PublicStashReader]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Kafka-Producer-POE-PublicStashReader'
 *     responses:
 *       200:
 *         description: The status was successfully set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kafka-Producer-POE-PublicStashReader'
 *       500:
 *         description: Some server error
 */

 router.post("/", (req, res) => {
    console.log(req.body)
	try {
        req.app.locals.active = req.body.active;
        req.app.locals.logging = req.body.logging;
        req.app.locals.eventEmitter.emit('active-'+req.body.active,req.app.locals.producer);
        req.app.locals.eventEmitter.emit('logging-'+req.body.logging);
        res.send({
            'active': req.app.locals.active,
            'logging': req.app.locals.logging
        });
	} catch (error) {
		return res.status(500).send(error);
	}
});


module.exports = router


//producer.listen(3000);


/*
let config = {
    headers: {
      header1: value,
    }
  }

  let data = {
    'HTTP_CONTENT_LANGUAGE': self.language
  }

  axios.post(URL, data, config).then(...)*/
//https://stackabuse.com/making-asynchronous-http-requests-in-javascript-with-axios

// async function getNinjaChangeID() {
//     try {
//         console.log("start axios request to poe.ninja");
//         poeNinjaStats = await axios.get('https://poe.ninja/api/data/GetStats', config)
//         return poeNinjaStats.data.next_change_id;
//         // .then(function (response) {
//         //     console.log(response.data.next_change_id)
//         //     return new Promise(function (resolve) {resolve(response.data.next_change_id); })
//         //     // .then(function (response) {
//         //     //     //console.log(response.data);
//         //     //     //console.log(response.status);
//         //     //     //console.log(response.statusText);
//         //     //     //console.log(response.headers);
//         //     //     //console.log(response.config);
//         //     //     console.log(response.data.next_change_id);
//         //     //     return new Promise (resolve => {
//         //     //           resolve(response.data.next_change_id);
//         //     //       });
//         //     //     //run(response.data.next_change_id);
//         // })
//     }
//     catch (error) {
//         // handle error
//         console.log(error);
//     }
//     finally {
//         //process.exit(0);
//     }
// }

/* const sendGetRequest = async () => {
    try {
        const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}; */

// Declare Object
// class ProducerConfig {
//     constructor() {  
//     this.active = false;
//     this.logging = false;
//     };
//     setActive(active) {
//         this.active = active;
//     };
//     getActive(){
//         return this.active;
//     }
//     setLogging(logging) {
//         this.logging = logging;
//     }
//     getLogging(){
//         return this.logging;
//     }    
//   };


// let producerConfig = new ProducerConfig();

// console.log('Active '+ producerConfig.getActive());
// console.log('Logging '+ producerConfig.getLogging());