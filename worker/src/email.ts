
 import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';

// const transporter = nodemailer.createTransport({
//   host: "test-p7kx4xwmkz2g9yjr.mlsender.net",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USERNAME,
//     pass: process.env.SMTP_PASSWORD, 
//   },
// });
export async  function sendEmail(to:string,body:string){

const mailjet = new Client({
  apiKey: process.env.MAILJET_API_KEY || "",
  apiSecret: process.env.MAILJET_API_SECRET || ""
});

(async () => {
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: 'hasanalipali2@gmail.com',
          Name: 'Mailjet Pilot',
        },
        To: [
          {
            Email: to,
          },
        ],
       
        Subject: 'Your email flight plan!',
        HTMLPart: `<h3>${body}</h3>`
        
      },
    ],
  };

  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
          .post('send', { version: 'v3.1' })
          .request(data);

  const { Status } = result.body.Messages[0];
})();
}

// f1e2cbcf445de14c244c0e0a75197d3b
// 544c3e47533fba5f13a8c34a2c25b9df