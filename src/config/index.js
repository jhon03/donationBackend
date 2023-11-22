const gmailApi   =   require('./gmailApi');
const outlookapi =  require('./outlookApi');
const database   =   require('./database');
const mail       =   require('./outlookApi');





module.exports = {
    ...database,
    ...mail,

}
