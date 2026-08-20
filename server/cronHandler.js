const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const db = require('./mysqlConnector');
const transporter = require('./mailHelper');

let schedule = {};
// Load cron configuration from JSON
const configPath = path.join(__dirname, 'cronjobs.json');


async function updateCron(){
    let select = "select istruzione from medicine";
    const [result] = await db.query(select);
    fs.writeFileSync(configPath,'{"jobs":'+JSON.stringify(result.map(row=>row.istruzione))+'}');   
    return true;
}
exports.run = async function(callback){
    await updateCron();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8',(err)=>{if(err) throw err}));
    // Initialize each job
    config.jobs.forEach(job => {
        job = JSON.parse(job);
        const taskJob = async function (param){
            let select = "select quantità from medicine where nome = '"+job.name+"'";
            var quantità;
            let [result] = await db.query(select);
            console.log(result);
            quantità=result.map(row=>row.quantità);
            if(quantità-job.task<2){
                transporter.sendMail({from:process.env.SENDER,to:process.env.RECEIVERS,subject:'Scorte di '+job.name+' in esaurimento.',text:"Le scorte di "+job.name+" sono attualmente "+quantità+". Ricomprale al più presto e ricordati di aggiungerle sul sito"},function(error,info){
                    if(error) throw error;
                    else console.log(info.response);
                });
            }
            console.log(quantità-job.task);
            let update = "update medicine set quantità = "+(quantità-job.task)+" where nome = '"+job.name+"'";
            if(!quantità-job.task<0){
                result = await db.query(update);
            }
        }

        if (schedule[job.name]) {
            schedule[job.name].destroy();
        }
        // Schedule the job
        const scheduledJob = cron.schedule(job.schedule, () => {
            taskJob();
        });

        schedule[job.name] = scheduledJob;

        console.log(`Job "${job.name}" scheduled at ${job.schedule}`);
    });
} 