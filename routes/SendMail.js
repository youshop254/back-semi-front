const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SERVICE_ID,
  MAILING_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;


const oauth2Client = new OAuth2(
    MAILING_SERVICE_ID,
    MAILING_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
    OAUTH_PLAYGROUND

)

const sendEmail = (to, url, txt) => {
oauth2Client.setCredentials({

    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,

})

const accessToken = oauth2Client.getAccessToken()
const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAUTH2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_ID,
        clientSecret: MAILING_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken
    }
})

const mailOptions = {
    from: SENDER_EMAIL_ADDRESS,
    to: to,
    subject: "youShop",
    html: `
    <div>
    <p>almost registered mate! click link below to confirm your account </p>
    <a href=${url}>${txt} </a>

    <div>${url}</div>

    </div>
    
    `
}

smtpTransport.sendMail(mailOptions, (err, info) => {
if(err) return err
return info
    
})

}


module.exports = sendEmail