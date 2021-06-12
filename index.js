const server = require("./server/server");

server.listen(server.locals.PORT, () => console.log(`The server is running on port ${server.locals.PORT}`));