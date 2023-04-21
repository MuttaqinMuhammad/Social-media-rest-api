const server = require('./app');
const database = require('./database');
const config = require('config');

database().catch((err) => {
  console.log(err);
});

const PORT = config.get('port');
server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
