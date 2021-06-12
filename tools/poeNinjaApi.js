const axios = require('axios');

async function getNinjaChangeID() {
    try {
        let config = {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
        }
        console.log("poeNinjaApi: start axios request to poe.ninja");
        response = await axios.get('https://poe.ninja/api/data/GetStats', config)
        return response.data.next_change_id;
    }
    catch (error) {
        // handle error
        console.log(error);
    }
    finally {
        //process.exit(0);
    }
}

module.exports = getNinjaChangeID