import sgMail from '@sendgrid/mail'

export const sendEmail = async (recipientAddress:String, pin:String) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
      to: "simon.kovacsp22@gmail.com", 
      from: process.env.SENDER_EMAIL!, 
      text: "Use this pin to create new password "+ pin ,
      html: `<p>Use this pin to create new password</p>
            <p>
            <strong>${pin}</strong>
            </p> <p> this pin will expire shortly</p>`,
    }
    await sgMail.send(msg)
}