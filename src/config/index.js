const database   =   require('./database');
const mail       =   require('./gmailApi');





module.exports = {
    ...database,
    ...mail,

}
