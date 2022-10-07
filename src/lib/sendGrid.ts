import sgMail from '@sendgrid/mail'

// export const sendEmail = async (recipientAddress:string, pin:string) => {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
//     const msg = {
//       to: recipientAddress, 
//       from: process.env.SENDER_EMAIL!, 
//       text: "Use this pin to create new password" ,
//       html: `<strong>${pin}</strong>`         
//     }
//     await sgMail.send(msg)
// }

export const sendEmail = async (recipientAddress:string,pin:string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  const msg = {
    to: recipientAddress, // Change to your recipient
    from: process.env.SENDER_EMAIL!, // Change to your verified sender
    subject: "product_data",
    text: "Use this pin to create new password:" ,
    html: ` <strong>${pin}</strong>`,
  }
  await sgMail.send(msg)
}