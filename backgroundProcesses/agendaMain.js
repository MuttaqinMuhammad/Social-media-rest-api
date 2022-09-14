
const Agenda = require('agenda');
const config = require('config')
//tasks
const clearExpiredOtp = require('./tasks/clearExpiredOtp')

const MONGO_URI = config.get('MONGO_URI')

const agenda = new Agenda({
db: { 
    address:MONGO_URI, 
    options: { useUnifiedTopology: true }, 
    },
    processEvery: "30 seconds",
    maxConcurrency: 20,
})

agenda.on('ready', () => console.log("Agenda started!"))

agenda.define("clear-expired-Otp", clearExpiredOtp);




(async function () {
   await agenda.start();
  await agenda.every("1 minutes", "clear-expired-Otp")
})()

module.exports = agenda;