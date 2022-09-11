const Agenda = require('agenda');

//tasks
const clearExpiredOtp = require('./tasks/clearExpiredOtp')


const agenda = new Agenda({
db: { 
    address: process.env.MONGO_URI, 
    options: { useUnifiedTopology: true }, 
    },
    processEvery: "30 seconds",
    maxConcurrency: 20,
})


agenda
 .on('ready', () => console.log("Agenda started!"))
 .on('error', (e) => console.log(`agenda Error: ${e}`));

agenda.define("clear-expired-Otp", clearExpiredOtp);




(async function () {
   await agenda.start();
  await agenda.every("1 minutes", "clear-expired-Otp")
})()

module.exports = agenda;