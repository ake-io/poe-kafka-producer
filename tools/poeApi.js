const axios = require('axios');
async function getPublicStashTabs(next_change_id) {

    try {
        console.log("poeApi: start request to poe.api with next_change_id: "+ next_change_id);
        let config = {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' }
        }
        response = await axios.get('https://www.pathofexile.com/api/public-stash-tabs?id=' + next_change_id, config)
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
    finally {}
}
module.exports = getPublicStashTabs