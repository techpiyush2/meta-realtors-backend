const nodemailer = require("nodemailer"),
  constants = require("./constants.js"),
  moment = require("moment"),
  path = require("path"),
  smtpTransport = require("nodemailer-smtp-transport"),
  config = require("../config/config.js").get(process.env.NODE_ENV || "local");

exports.contactUsEmail = (mailOptions, printContents) => {
  // 1) Creating HTML content
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meta Realtors</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"  crossorigin="anonymous" referrerpolicy="no-referrer" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0px; padding:0px; font-family: 'Open Sans', sans-serif;">
      <Section>
          <center>
              <div style="width: 480px; height:auto; box-shadow: 1px 1px 20px 2px rgb(224, 223, 223); border-radius: 10px;">
                  <div style="  background-color: #FBB84D;  padding: 15px 0px; border-radius: 10px 10px 0px 0px; ">
                      <img src= "https://metarealtors.in/static/media/navlogo.b853379945b2413aa057.jpeg" height="60px" width="100px"   alt="">
                  </div>
                  <div style="text-align: start;  padding: 0px 40px;">
                      <div style="padding-top: 25px; color: rgb(73, 72, 72);">
                          <h1 style="font-size: 28px; font-weight: bold; ">Hi admin,</h1>
                      </div>
                      <div style="border: 1px solid gray; border-radius: 10px;">
                          <div style="padding: 0px 16px;">
                              <h1 style="font-size: 22px; font-weight: bolder; color: rgb(73, 72, 72);">I am ${printContents.name}</h1>
                          <hr>
                          <p for="" style="font-size: 16px; font-style: normal; font-weight: 600; color: rgb(73, 72, 72);"> Email Id : </p>
                          <p>${printContents.email}</p>
    
                          <p for="" style="font-size: 16px; font-style: normal; font-weight: 600; color: rgb(73, 72, 72);"> Contact Number : </p>
                          <p>${printContents.mobileNo}</p>
                          
                          <p for="" style="font-size: 16px; font-style: normal; font-weight: 600; color: rgb(73, 72, 72);"> Message :</p>
                          <p>${printContents.message}</p>
                          <div style="text-align: center;">
                              <button style="background-color: #FBB84D; color: white; padding:15px 40px; border: none; border-radius: 5px; margin: 30px 0px;"> <b>Reply Back</b></button>
                          </div>
                          </div>
                      </div> 
  
                      <hr style="margin: 35px  0px 20px 0px;">
                     <div style="text-align: center; color: gray;">
                  </div>
                  <hr style="margin: 35px  0px 20px 0px;">
                 <div style="text-align:center"

                      <div style="padding: 0px  0px 10px 0px; text-align: center; ">
                              <p>© 2023 Meta Realtors All Right Reserved</p></div>
                     </div>
                  </div>
              </div>
          </center>
      </Section>
  </body>
  </html>`;

  // 2) Setting HTML content to the mail options
  mailOptions.html = html;
  // 3) Actually sending the mail
  return sendEmail(mailOptions);
};

exports.attendece = (mailOptions, printContents) => {
  // 1) Creating HTML content
  const html = `<!DOCTYPE html>
  <html>
  
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
      <title>Attendence</title>
  
  </head>
  
  <body style="font-family:Arial, Helvetica, sans-serif; font-size:1em;">
      <div class="preheader" style="font-size: 1px; display: none !important;"></div>
      <table id="backgroundTable" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
              <td class="body" align="center" valign="top" style="width="100%">
                  <table cellpadding="0" cellspacing="0">
                      <tr>
                          <td width="640">
                          </td>
                      </tr>
                      <tr>
                          <td class="main" width="640" align="center" style="padding: 0 10px;">
                              <table style="min-width: 100%; " class="stylingblock-content-wrapper" width="100%"
                                  cellspacing="0" cellpadding="0">
                                  <tr>
                                      <td class="stylingblock-content-wrapper camarker-inner">
                                          <table class="featured-story featured-story--top" cellspacing="0"
                                              cellpadding="0">
                                              <tr>
                                                  <td style="padding-bottom: 20px;">
                                                      <table cellspacing="0" cellpadding="0">
                                                          <tr>
                                                              <td class="featured-story__inner" style="background:#F0F0F0; width:100%; box-shadow: 0 0 11px rgb(0 0 0 / 29%);    border-radius: 25px;">
                                                                  <table cellspacing="0" cellpadding="0">
                                                                    //   <tr>
                                                                    //       <td class="scalable-image" width="640" align="left">
                                                                          
                                                                    //           <img src="${config.siteURL}assets/template_image/truck-logo.png" width="50px" style="padding: 10px 10px  0 10px;">
                                                                    //       </td>
                                                                    //   </tr>
                                                                      <tr>
                                                                          <td class="featured-story__content-inner" style="width:100%;padding: 0 30px 45px;">
                                                                              <table cellspacing="0" cellpadding="0" width="100%">
                                                                                  <tr style="width: 100%; text-align: center;">
                                                                                      <td class="featured-story__heading featured-story--top__heading">
                                                                                          <table cellspacing="0" cellpadding="0" width="100%" style="text-align: center;">
                                                                                          username                                                       <tr style="margin-bottom: 15px;display: block;text-align: center;">
                                                                                                  <td>
                                                                                                      <img src="${config.siteURL}assets/template_image/shield.png" width="60" style="margin-left: 250px;">
                                                                                                  </td>
                                                                                              </tr>
                                                                                              <tr>
                                                                                                  <td style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 22px; color: #464646;padding-bottom: 13px; margin-bottom:25px"
                                                                                                      width="100%"
                                                                                                      align="center">
                                                                                                      Reset your password
                                                                                                  </td>
                                                                                              </tr>
                                                                                              username                                                   </table>
                                                                                      </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                      <td class="featured-story__copy" style="width="100%" align="center">
                                                                                          <table cellspacing="0" cellpadding="0">
                                                                                              <tr>
                                                                                                  <td style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 16px; line-height: 22px; color: #555555; padding-top: 16px; margin-top: 16px;border-top: 1px solid #F0F0F0;"
                                                                                                      align="center">
                                                                                                      Here is your in and out time for today.
                                                                                                      <td>          
                                                                                                      
                                                                                                  </td>
                                                                                              </tr>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                                  <tr>
                                                                                      <td class="featured-story__copy" style="width="100%" align="center">
                                                                                          <table cellspacing="0" cellpadding="0">
                                                                                              <tr>
                                                                                                  <td style="font-size: 16px; line-height: 22px; color: #555555; padding-top: 10px;"
                                                                                                      align="center">
                                                                                                      <h1 style="font-size: 35px;letter-spacing: 9px;"><strong>${printContents.name}</strong></h1>
                                                                                                      <h1 style="font-size: 35px;letter-spacing: 9px;"><strong>${printContents.EMPCode}</strong></h1>
                                                                                                      <h1 style="font-size: 35px;letter-spacing: 9px;"><strong>${printContents.InTime}</strong></h1>
                                                                                                      <h1 style="font-size: 35px;letter-spacing: 9px;"><strong>${printContents.OutTime}</strong></h1>
                                                                                                      <h1 style="font-size: 35px;letter-spacing: 9px;"><strong>${printContents.ShiftHrs}</strong></h1>

  
                                                                                                  </td>
                                                                                              </tr>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </table>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      </custom>
  </body>
  
  </html>`;

  // 2) Setting HTML content to the mail options
  mailOptions.html = html;

  // 3) Actually sending the mail
  return sendEmail(mailOptions);
};

exports.forgotPasswordEmail = (mailOptions, printContents) => {
  // 1) Creating HTML content
  const html = `
      <!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <title>Verify OTP</title>

</head>

<body style="font-family:Arial, Helvetica, sans-serif; font-size:1em;">
    <table id="backgroundTable" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td class="body" align="center" valign="top" style="width="100%">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="640">
                        </td>
                    </tr>
                    <tr>
                        <td class="main" width="640" align="center" style="padding: 0 10px;">
                            <table style="min-width: 100%; " class="stylingblock-content-wrapper" width="100%"
                                cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="stylingblock-content-wrapper camarker-inner">
                                        <table class="featured-story featured-story--top" cellspacing="0"
                                            cellpadding="0">
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td class="featured-story__inner" style="background:#F0F0F0; width:100%; box-shadow: 0 0 11px rgb(0 0 0 / 29%);    border-radius: 25px;">
                                                                <table cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td class="scalable-image" width="640" align="left">
                                                                            <img src="${config.siteURL}assets/Template_Images/logo.png" width="50px" style="padding: 10px 10px  0 10px;">
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="featured-story__content-inner" style="width:100%;padding: 0 30px 45px;">
                                                                            <table cellspacing="0" cellpadding="0" width="100%">
                                                                                <tr style="width: 100%; text-align: center;">
                                                                                    <td class="featured-story__heading featured-story--top__heading">
                                                                                        <table cellspacing="0" cellpadding="0" width="100%" style="text-align: center;">
                                                                                            <tr style="margin-bottom: 15px;display: block;text-align: center;">
                                                                                                <td>
                                                                                                    <img src="${config.siteURL}assets/template_image/lock.png" width="60" style="margin-left: 250px;">
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td width="100%" align="left">
                                                                                                   <span style="font-family: Geneva, Tahoma, Verdana, sans-serif; font-size: 15px;display: inline-block; color: #464646;padding-bottom: 13px; margin-bottom:5px;border-bottom: 1px solid #F0F0F0;">Hi ${printContents.personName} 
                                                                                                   <br>
                                                                                                   Forgot your password? <br>
                                                                                                   To reset your password click on the button below:
                                                                                                   
                                                                                                   </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="featured-story__copy" style="width="100%" align="center">
                                                                                        <table cellspacing="0" cellpadding="0">
                                                                                            <tr>
                                                                                                <td style="font-size: 16px; line-height: 22px; color: #555555; padding-top: 10px;"
                                                                                                    align="center">
                                                                                                    <button style="font-size: 18px; background-color: #2188f7; border: 2px solid #f0f0f0; cursor :pointer ; border-radius:10px; height: 35px ;color:white "><a href="${printContents.resetLink}" target="_blank">Reset password</a></button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
    </custom>
</body>
</html>`;

  // 2) Setting HTML content to the mail options
  mailOptions.html = html;

  // 3) Actually sending the mail
  return sendEmail(mailOptions);
};
exports.applyJobEmail = (mailOptions, printContents) => {
  // 1) Creating HTML content
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zimo.one</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"  crossorigin="anonymous" referrerpolicy="no-referrer" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0px; padding:0px; font-family: 'Open Sans', sans-serif;">
      <Section>
          <center>
              <div style="width: 800px; height:auto; box-shadow: 1px 1px 20px 2px rgb(224, 223, 223); border-radius: 10px;">
                  <div style="  background-color: #FBB84D;  padding: 15px 0px; border-radius: 10px 10px 0px 0px; ">
                      <img src= "https://www.linkpicture.com/q/logo2_14.png" height="60px" width="100px"   alt="">
                  </div>
                  <div style="text-align: start;  padding: 0px 40px;">
                      <div style="padding-top: 25px; color: rgb(73, 72, 72);">
                          <h1 style="font-size: 28px; font-weight: bold; ">Hi admin,</h1>
                          <p>Application recieved for${
                            printContents.job
                          } </p>
                      </div>
                      <div style="display: flex;">
                          <div><img src="https://www.linkpicture.com/q/thumbnail_7.png" height="40px" width="40px" alt="" style="margin-top: 18px;"></div>
                          <div><h1 style="padding-left: 15px; font-size: 28px; font-weight: bold; color: rgb(73, 72, 72);">${
                            printContents.job
                          }</h1></div>
                      </div>
                      <div style="border: 1px solid gray; border-radius: 10px;">
                          <div style="padding: 0px 16px;">
                              <h1 style="font-size: 22px; font-weight: bolder; color: rgb(73, 72, 72); padding-top: 20px;">${
                                printContents.name
                              }</h1>
                          <hr><br>
                          <div>
                              <p style="color: rgb(78, 77, 77); padding-top: 0px;">${
                                printContents.email
                              }</p>
                              <p style="color: rgb(78, 77, 77); padding-top: 15px;">${
                                printContents.contact
                              }</p>
                              <p style="color: rgb(78, 77, 77); padding-top: 15px;">${
                                printContents.expInYear
                              } Years ${
    printContents.expInMonth
  } Months Experience</p>
                          </div>
                          <div>
                          <a style="text-decoration : none ; color : black; cursor: pointer; "
        href=${
             "https://zimo.one:1337/upload/resume/" + printContents.file
        }><button
            style="background-color: #fcf2e4 ;cursor: pointer;;  padding:8px 20px 13px 8px; border: 1px solid #FBB84D; border-radius: 5px; margin: 30px 0px;">
            <img src="https://www.linkpicture.com/q/doc.svg"
                style="color: #FBB84D; padding: 0px 10px 0px 10px; width: 20px;"> Document.pdf <img
                src="https://www.linkpicture.com/q/download.svg" style="padding-left: 10px; width: 20px;"></button></a>
                          </div>
                          </div>
                      </div>
                      <hr style="margin: 35px  0px 20px 0px;">
                     <div style="text-align: center; color: gray;">
                      <div style="font-size: 30px; padding:0px 0px;">
                         <a style="text-decoration : none" href= "https://www.facebook.com/zimoinfotech/"> <img src= "https://www.linkpicture.com/q/fb.svg" style="width : 50px; margin: 0px 10px;"></img></a>   <a href= "https://www.instagram.com/zimo.one/"><img style="text-decoration : none" src ="https://www.linkpicture.com/q/ig.svg" style="width : 50px; margin: 0px 10px;"></></a>
                         <a style="text-decoration : none" href= "https://twitter.com/zimoinfotech"><img src = "https://www.linkpicture.com/q/twitter_3.svg" style="width : 50px; margin: 0px 10px;"></></a>
                      </div>
                      <div style="padding: 0px  0px 10px 0px; ">
                              <p>© 2022 Zimo.one All Right Reserved</p></div>
                     </div>
                  </div>
              </div>
          </center>
      </Section>
  </body>
  </html>`;

  // 2) Setting HTML content to the mail options
  mailOptions.html = html;

  // 3) Actually sending the mail
  return sendEmail(mailOptions);
};

// const sendEmail = async (mailOptions) => {
//     if (!mailOptions.from) mailOptions.from = config.smtp.mailUserName;

//     if (
//         !mailOptions.from ||
//         !mailOptions.to ||
//         !mailOptions.subject ||
//         !mailOptions.html
//     )
//         return false;

//     // console.log('mailOptions\n\n', mailOptions)

//     /** Creating transporter */
//     const transporter = nodemailer.createTransport(
//         smtpTransport({
//             service: config.smtp.service,
//                port: 587,
//             secure: false,
//             requireTLS: true,
//             host: config.smtp.host,
//             auth: {
//                 user: config.smtp.username,
//                 pass: config.smtp.password,
//             },
//             tls: {
//                 ciphers: 'SSLv3'
//             },
//         })
//     );

//     /** Checking weather the mail response include OK or not */
//     /** If it include then return true otherwise return false */

//     const transporterRes = await transporter.sendMail(mailOptions);

//     return transporterRes.response.includes("OK") ? true : false;

//     //   return (await transporter.sendMail(mailOptions).response.includes('OK')) ? true : false
// };

const sendEmail = async (mailOptions) => {
  if (!mailOptions.from) {
    mailOptions.from = config.smtp.mailUserName;
  }

  if (
    !mailOptions.from ||
    !mailOptions.to ||
    !mailOptions.subject ||
    !mailOptions.html
  ) {
    return false;
  }

  // Creating transporter
  let transporter = smtpProtocol = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "metarealtors3@gmail.com",
        pass: "Realtors56789#"
    }
});

//   const transporter = nodemailer.createTransport(
//     smtpTransport({
//       service: config.smtp.service,

//       port: 587,

//       secure: false,

//       requireTLS: true,

//       host: config.smtp.host,

//       auth: {
//         user: 'metarealtors3@gmail.com',

//         pass: 'SPARJ50VHXEOKN12',
//       },

//       tls: {
//         ciphers: "SSLv3",
//       },
//     })
//   );

  const transporterRes = await transporter.sendMail(mailOptions);

  return transporterRes.response.includes("250") ? true : false;
};
