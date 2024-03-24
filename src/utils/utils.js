const sharp = require("sharp");
const s3 = require("../../config/S3_config/s3.config");
let upload = require("../../config/S3_config/multer.config");
const { v1: uuidv4 } = require("uuid");
const fs = require("fs-extra");
const path = require("path");
const AWS = require("aws-sdk");
//*******************************{RENDER BAD REQUEST}*******************************
const RENDER_BAD_REQUEST = (res, error) => {
  console.log(error);
  if (error.message) {
    res.status(400).json({
      message: error.message,
    });
  } else {
    res.status(400).send(error);
  }
};
//*******************************{change order in delete case}*******************************
const CHANGE_DEL_ORDER = async (current_order, schema) => {
  let doc = await schema.find({
    order: {
      $gte: current_order,
    },
  });
  const promise = doc.map(async (Obj) => {
    Obj.order = Obj.order - 1;
    await Obj.save();
  });
  await Promise.all(promise);
};
//*******************************{ORDER_CHANGE_TO_LOWER}*******************************
const ORDER_CHANGE_TO_LOWER = async (current_order, past_order, schema) => {
  let doc = await schema.find({
    order: {
      $gte: current_order,
      $lte: past_order,
    },
  });
  console.log(doc, "doc");
  const promise = doc.map(async (Obj) => {
    Obj.order = Obj.order + 1;
    await Obj.save();
  });
  await Promise.all(promise);
};
//*******************************{_ORDER_CHANGE_TO_UPPER}*******************************
const ORDER_CHANGE_TO_UPPER = async (current_order, past_order, schema) => {
  let doc = await schema.find({
    order: {
      $gte: past_order,
      $lte: current_order,
    },
  });
  console.log(doc, "this is doc");
  const promise = doc.map(async (Obj) => {
    Obj.order = Obj.order - 1;
    await Obj.save();
  });
  await Promise.all(promise);
};
//*******************************{MAX_ORDER}*******************************
const MAX_ORDER = async (modelName, query_obj = {}) => {
  let max_order = 0;
  let x;
  x = await modelName
    .findOne(query_obj)
    .sort({ order: -1 })
    .limit(1)
    .select({ order: 1, _id: 0 });
  if (x) {
    max_order = x.order;
  }
  return max_order;
};
//*******************************{SEND_EMAIL}*******************************
const SEND_EMAIL = async (code, receiver) => {
  require("dotenv").config();
  const sg_mail = require("@sendgrid/mail");
  console.log(process.env.EMAIL_API_KEY, "KEY");
  sg_mail.setApiKey(process.env.EMAIL_API_KEY);
  const message = {
    to: receiver,
    from: process.env.EMAIL_FROM,
    subject: "Verification code",
    text: `Here is code you can use to reset password ${code}`,
    //html: "<h1>This is html</h1>",
  };
  const result = await sg_mail
    .send(message)
    .then((res) => {
      console.log("Email Sent");
      return res;
    })
    .catch((err) => {
      console.log("Email did not  Send", err);
      return err;
    });
  return result;
};
//*******************************{  UPLOAD AUDIO FILE}*******************************
const UPLOAD_AUDIO_FILE = async (files, resp) => {
  const myPromise = new Promise(async (resolve, reject) => {
    try {
      let image_file = files.audio;
      let file_name = path.extname(files.audio.name);
      //define upload file name store url
      let audio_file_name = uuidv4() + file_name;
      let audio_path = audio_file_name;
      let file_path = "./src/utils/audio/" + audio_file_name;
      fs.mkdirsSync("./src/utils/audio/");
      image_file.mv(file_path, async (err) => {
        if (err) {
          resp.error = true;
          resp.error_message = err;
          return resp;
        } else {
          resolve(audio_path);
        }
      });
    } catch (error) {
      resp.error = true;
      resp.error_message = error;
      return resp;
    }
  });

  return myPromise;
};
//*******************************{UPLOAD AND RESIZE FILE}*******************************
const UPLOAD_AND_RESIZE_FILE = async (image_buffer_data, dir, image_size) => {
  const myPromise = new Promise(async (resolve, reject) => {
    try {
      let image_name = uuidv4() + ".jpeg";
      await sharp(image_buffer_data)
        .jpeg({
          quality: 100,
          chromaSubsampling: "4:4:4",
        })
        .resize(image_size)
        .toFile(dir + image_name, async (err, info) => {
          if (err) resolve(false);
        });
      resolve(image_name);
    } catch (error) {
      console.log(error, "error in uploading");
      resolve(false);
    }
  });

  return myPromise;
};
//*******************************{UPLOAD IMAGE ON S3}*******************************
const UPLOAD_S3_IMAGE = async (img_name, dir, image_data) => {
  let response = {};
  let image_file_name = "";
  let savePath = dir;
  image_file_name = img_name;

  sharp(image_data)
    .resize(300, 300)
    .toBuffer(async (err, info) => {
      if (err) {
        console.log(err, "toBuffer error in uploader");
      } else {
        upload.single("file");
        const s3Client = s3.s3Client;
        const params = s3.uploadParams;
        params.Key = savePath + image_file_name;
        params.Body = info;
        params.ContentType = "image/jpeg";
        try {
          let result = await s3Client.upload(params).promise();
          response = image_file_name;
        } catch (err) {
          console.log("error in s3 uploading", err);
        }
      }
    });

  return response;
};
//*******************************{SEND NOTIFICATION}*******************************
const SEND_NOTIFICATION = async (message) => {
  // Send a message to devices subscribed to the provided topic.
  return admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
//*******************************{AWS SES Email}*******************************
const NOTIFY_BY_EMAIL_FROM_SES = async (
  email,
  subject,
  email_body,
  attachments_file_array = []
) => {
  const SES_CONFIG = {
    accessKeyId: "AKIASFHMCRVPU3V2LPUW",
    secretAccessKey: "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",
    region: "us-west-1",
  };

  const AWS_SES = new AWS.SES(SES_CONFIG);

  let params = {
    Source: "Meta Logix Tech<support@metalogixtech.com>",
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: ["support@metalogixtech.com"],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email_body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise(); // or something
};

// Function to send an email using Mailgun
const sendEmail = async (sender_email, receiver_email, email_subject, email_body) => {
  let API_KEY = 'key-fc10e270908d140be45ea9e56cb44f0d';
  let DOMAIN = 'mail.cardup.me';
  console.log("here");
  const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

  const data = {
    "from": sender_email,
    "to": receiver_email,
    "subject": email_subject,
    "html": email_body
  };
  mailgun.messages().send(data, (error, body) => {
    if (error) console.log(error)
    else console.log(body.message);
  });
}


const email_template_code_verification_function = async (
 code
) => {

  let email_template = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Validation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
              color: #333333;
          }
          p {
              color: #666666;
          }
          .code {
              background-color: #f0f0f0;
              padding: 10px;
              border-radius: 5px;
              font-family: monospace;
              font-size: 16px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Email Validation</h2>
          <p>Hello there,</p>
          <p>Please use the following code to validate your email address:</p>
          <p class="code">${code}</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Thank you!</p>
      </div>
  </body>
  </html>
  `

  return email_template
};

const property_email_template_function = async (
  background_image,
  price,
  address,
  bed_room,
  bath_room,
  living_area,
  lot_size_unit
) => {

  let email_template = `<!DOCTYPE html>
  <html>
  
  <head>
      <title>Page Title</title>
  </head>
  
  <body>
      <table role="article" aria-label="MLS" lang="en" cellpadding="0" cellspacing="0" border="0"
          style="width:100%;text-align:center;vertical-align:middle;margin:0 auto;table-layout:fixed">
          <tbody>
              <tr>
                  <td align="center" bgcolor="#ffffff">
                      <img src="https://ci3.googleusercontent.com/meips/ADKq_Nau0NCBnvOS-zNxlJq9aHl3f5N7Bo-UR5f21lsT3bvdKmtff-wenIvc0MqBET51WsbkKVvHqNCD9_-17dAfR2wTURIDTRa2SYE0hhVGv9U8kOMxxRdG5f5dHIVTvx20X9iZq2_jReWp9Z_aDQkbnj2e3OI-YV9j8mVfZiwK5J-VdHNYC1y5Pk3vv0Jk-qwP=s0-d-e1-ft#https://www.zillow.com/app/?tok=40207f35-f49a-4f6e-9469-6a4f83ac8327~X1-ZUqywfty9tym15_6ikyk&amp;service=emailtrackingservice"
                          width="1" height="1" style="display:none" class="CToWUd" data-bit="iit" />
  
  
                      <div
                          style="display:none!important;display:none;overflow:hidden;float:left;width:0px;max-height:0px;max-width:0px;line-height:0px">
                          Daily result straight to your
                          inbox.͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>&nbsp;
                      </div>
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center" style="padding:0px 20px">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:32px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <h1 style="margin:0 auto;padding:0">
                                                          <a border="0" style="text-decoration:none" href="#"
                                                              target="_blank"> <img
                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NaieuIl3qqXHajhbbsv5emFqTdr04vEFQhaXleSXSv04j5fH0-06OOiF8igOQ1p7_I9XmDooc2f1EPcCdWWwRo8LAt_XOt8yavGpmMngFHkbLM5J2z3GQsSygOL=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/Zillow_Logo_300x64.png"
                                                                  alt="MLS" border="0" height="32" width="150"
                                                                  style="display:block;color:#006aff;font-family:Arial,sans-serif;font-weight:bold;font-size:32px;line-height:1;text-align:center;text-decoration:none;margin:0 auto;padding:0;max-width:100%;height:auto"
                                                                  class="CToWUd" data-bit="iit">
  
                                                              <div style="display:none">
                                                                  <img src="https://ci3.googleusercontent.com/meips/ADKq_NYZ5M6ZbzeB9lx6Sflloxg577pmLXNWxNuwA_e7G03gD8eCO307XlvqAJ_y7WdMv1qBngOvaEcNzjnWfyc2lqoQ6YQBuhUAls_V-s0P9uNOb_BdRXeabkwObAVBOfx0=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/Zillow_Logo_300x64_dm.png"
                                                                      alt="MLS" border="0" height="32" width="150"
                                                                      style="display:block;color:#ffffff;font-family:Arial,sans-serif;font-weight:bold;font-size:32px;line-height:1;text-align:center;text-decoration:none;margin:0 auto;padding:0;max-width:100%;height:auto"
                                                                      class="CToWUd" data-bit="iit">
                                                              </div>
  
                                                          </a>
                                                      </h1>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
  
  
  
  
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:504px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:24px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center" style="padding:0px 20px">
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td
                                                                      style="border-bottom:2px solid #ffd237;width:152px;font-size:0;height:0;line-height:0">
                                                                      &nbsp;</td>
                                                              </tr>
                                                              <tr>
                                                                  <td class="m_-2346107395176450950lh24"
                                                                      style="font-size:0px;line-height:40px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <p class="m_-2346107395176450950font14"
                                                          style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:400;font-size:16px;line-height:24px;color:#2a2a33;text-align:center;margin:0;padding:0">
                                                          Check out this property. </p>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="m_-2346107395176450950lh24"
                                                                      style="font-size:0px;line-height:40px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
  
  
  
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td align="center" style="padding:0px 10px">
                                                      <table role="presentation" class="m_-2346107395176450950w100p"
                                                          align="center" cellpadding="0" cellspacing="0" border="0"
                                                          style="width:534px;border:1px solid #d1d1d5;border-radius:4px">
                                                          <tbody>
                                                              <tr>
                                                                  <td align="center"
                                                                      background="${background_image}"
                                                                      style="background-repeat:no-repeat;background-position:center;background-size:cover;border-radius:4px 4px 0px 0px;background-color:#f1f1f4">
  
                                                                      <a style="text-decoration:none" href="#"
                                                                          target="_blank"
                                                                          data-saferedirecturl="https://www.google.com/url?q=https://click.mail.zillow.com/f/a/tnYggP3Bxo9rwmBXYaISwA~~/AAAAAQA~/RgRn4SfnP0UkZW1vLWluc3RhbnRzZWFyY2hkaWdlc3QtZm9yc2FsZWltYWdlBFcGemlsbG93Qgpl-eei_mXJEOppUhdhc2hpcWFyc2xhbjY2QGdtYWlsLmNvbVgEAAAAAA~~?target%3Dhttps%253A%252F%252Fwww.zillow.com%252Frouting%252Femail%252Fproperty-notifications%252Fzpid_target%252F7808149_zpid%252FX1-SSde72yuxlr60g0000000000_3xvey_sse%252F%253Fz%2526rtoken%253D40207f35-f49a-4f6e-9469-6a4f83ac8327%25257EX1-ZUqywfty9tym15_6ikyk%2526utm_campaign%253Demo-instantsearchdigest%2526utm_source%253Demail%2526utm_term%253Durn%253Amsg%253A20240323093737b4b41ec22cdd12ef%2526utm_medium%253Demail%2526utm_content%253Dforsaleimage&amp;source=gmail&amp;ust=1711278125410000&amp;usg=AOvVaw04Nr_7wnQu0CE2yszPwy-Y">
                                                                          <span>
                                                                              <table role="presentation"
                                                                                  class="m_-2346107395176450950w100p"
                                                                                  align="center" cellpadding="0"
                                                                                  cellspacing="0" border="0"
                                                                                  style="width:532px">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td align="left" valign="top"
                                                                                              height="24"
                                                                                              style="height:24px;padding:8px">
                                                                                          </td>
                                                                                          <td align="right" valign="top"
                                                                                              height="24"
                                                                                              style="height:24px;padding:8px">
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td colspan="2"
                                                                                              class="m_-2346107395176450950h134"
                                                                                              height="258"
                                                                                              style="height:258px"></td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td colspan="2" align="right"
                                                                                              valign="bottom" height="30"
                                                                                              style="height:30px;padding:8px">
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </span>
                                                                      </a>
  
                                                                  </td>
                                                              </tr>
                                                              <tr>
                                                                  <td>
                                                                      <a style="text-decoration:none" href="#"
                                                                          target="_blank" <span>
                                                                          <table role="presentation" width="100%"
                                                                              cellpadding="0" cellspacing="0" border="0">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td class="m_-2346107395176450950padl04 m_-2346107395176450950padr08"
                                                                                          align="left"
                                                                                          style="padding-left:12px;padding-right:16px;padding-top:8px;padding-bottom:12px">
                                                                                          <table
                                                                                              class="m_-2346107395176450950w100p"
                                                                                              role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0"
                                                                                              width="500"
                                                                                              style="margin-left:4px">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="middle"
                                                                                                          align="left">
                                                                                                          <table
                                                                                                              role="presentation"
                                                                                                              cellpadding="0"
                                                                                                              cellspacing="0"
                                                                                                              border="0"
                                                                                                              align="left"
                                                                                                              style="padding-right:16px;display:block">
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td valign="middle"
                                                                                                                          align="left">
                                                                                                                          <strong
                                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:24px;line-height:32px;font-weight:700;color:#2a2a33">${price}</strong>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                          <table
                                                                                                              role="presentation"
                                                                                                              cellpadding="0"
                                                                                                              cellspacing="0"
                                                                                                              border="0"
                                                                                                              align="left">
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td valign="middle"
                                                                                                                          align="left">
  
                                                                                                                          <table
                                                                                                                              role="presentation"
                                                                                                                              cellpadding="0"
                                                                                                                              cellspacing="0"
                                                                                                                              border="0">
                                                                                                                              <tbody>
                                                                                                                                  <tr>
                                                                                                                                      <td
                                                                                                                                          style="font-size:0px;line-height:4px">
                                                                                                                                          &nbsp;
                                                                                                                                      </td>
                                                                                                                                  </tr>
                                                                                                                              </tbody>
                                                                                                                          </table>
  
                                                                                                                          <p
                                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:24px;color:#2a2a33;font-style:normal;margin:0;padding:0">
                                                                                                                              ${bed_room} bd<span
                                                                                                                                  style="color:#d1d1d5">&nbsp;|&nbsp;</span>
                                                                                                                                  ${bath_room} ba
                                                                                                                              <span
                                                                                                                                  style="color:#d1d1d5">&nbsp;|&nbsp;</span>
                                                                                                                              ${living_area}
                                                                                                                              ${lot_size_unit}
                                                                                                                          </p>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p class="m_-2346107395176450950font14"
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#2a2a33;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                              Builder: Staman-Thomas
                                                                                          </p>
                                                                                          <p class="m_-2346107395176450950font14"
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#2a2a33;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                           ${address}</p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0"
                                                                                              style="margin:4px 0 4px 0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="middle"
                                                                                                          style="padding-right:4px">
                                                                                                          <img src="https://ci3.googleusercontent.com/meips/ADKq_NYWwB-YtSgeQBP1vrIdXr3QyC5H2gamGeyf_jNIA91Bz0sNFo3RuKUdCqOopW9uWATZ-VEYEwznQzWAZHcQf3OfPhYxrddWYayRjNHuNQf6KgE=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/For_sale.png"
                                                                                                              width="16"
                                                                                                              align="left"
                                                                                                              alt=""
                                                                                                              style="display:block"
                                                                                                              class="CToWUd"
                                                                                                              data-bit="iit">
                                                                                                      </td>
                                                                                                      <td valign="middle">
                                                                                                          <b
                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;line-height:24px;color:#2a2a33">For
                                                                                                              sale</b>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;line-height:24px;color:#e96e2f;margin:0 0 0 4px;padding:0">
                                                                                              Open: Sat. 1-4pm</p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td
                                                                                                          style="font-size:0px;line-height:8px">
                                                                                                          &nbsp;</td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;color:#596b82;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                              ARMLS
                                                                                              <br>
                                                                                              Russ Lyon Sotheby's
                                                                                              International Realty
                                                                                          </p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td
                                                                                                          style="font-size:0px;line-height:8px">
                                                                                                          &nbsp;</td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                          </span>
                                                                      </a>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td style="font-size:0px;line-height:32px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
  
                                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:16px">&nbsp;</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center" style="padding:0px 20px">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:504px">
                                          <tbody>
                                              <tr>
                                                  <td align="center">
                                                      <a class="m_-2346107395176450950lh13 m_-2346107395176450950ctaPrimary"
                                                          style="display:inline-block;line-height:17px;margin:0;text-align:center;text-decoration:none;width:auto;border-radius:4px;border:1px solid #006aff;padding:12px 0;background-color:#006aff;font-size:16px;color:#ffffff"
                                                          href="#" target="_blank"
                                                          style="letter-spacing:14px">&nbsp;</i><span
                                                              style="margin:0;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700">View
                                                              on website</span><i
                                                              style="letter-spacing:14px">&nbsp;</i></a>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td style="font-size:0px;line-height:48px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0" cellspacing="0"
                          border="0" style="width:600px">
                          <tbody>
                              <tr>
                                  <td style="border-bottom:1px solid #d1d1d5;font-size:0;height:0;line-height:0">&nbsp;
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:24px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <p class="m_-2346107395176450950font14"
                                                          style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-style:normal;margin:0;padding:0;color:#54545a">
                                                          MLS Assistangt is better with the app.
                                                          <a class="m_-2346107395176450950txtLinkPrimary"
                                                              style="color:#0d4599;text-decoration:underline;font-weight:700"
                                                              href="#" target="_blank" </p>
                                                              <table role="presentation" cellpadding="0" cellspacing="0"
                                                                  border="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style="font-size:0px;line-height:16px">
                                                                              &nbsp;</td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                              <table role="presentation" cellpadding="0" cellspacing="0"
                                                                  border="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="m_-2346107395176450950padr16"
                                                                              style="padding-right:24px">
                                                                              <a href="#" target="_blank" <img
                                                                                  style="display:block;padding:0;margin:0;max-width:100%;text-decoration:none;color:#0d4599;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px"
                                                                                  border="0"
                                                                                  alt="Download on the App Store"
                                                                                  width="144"
                                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NaC4zXcGrkBXkIfbfExwD_WZ_X0usOGv0dg-EOHC5KLxfRJjBGN57Yx61eKhaHV6yxn6MfoboQIuKcYlTAdZrosSQB2DchPW4iqQT5h0s4Ei6UnWZqvzjrF=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/apple-app-badge.png"
                                                                                  class="CToWUd" data-bit="iit">
                                                                              </a>
                                                                          </td>
                                                                          <td>
                                                                              <a href="#" target="_blank" <img
                                                                                  style="display:block;padding:0;margin:0;max-width:100%;text-decoration:none;color:#0d4599;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px"
                                                                                  alt="Get it on Google Play" width="161"
                                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NbQNdmK88_EoP5whQZF6fBGqnvU7bnWVJ60wWD79ZHRa-1ok7iFkmqG9-m0h2On6rSGUxYRDozaBRroHd0NkvtkXLY_VlSLYCOzsJTb_n70qOdy_aV8bFUU9w=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/google-app-badge.png"
                                                                                  class="CToWUd" data-bit="iit">
                                                                              </a>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  
  </html>
  
  
  
  
  </body>
  </html>`;
  return email_template;
};

module.exports = {
  RENDER_BAD_REQUEST,
  CHANGE_DEL_ORDER,
  ORDER_CHANGE_TO_LOWER,
  ORDER_CHANGE_TO_UPPER,
  MAX_ORDER,
  SEND_EMAIL,
  UPLOAD_AND_RESIZE_FILE,
  UPLOAD_AUDIO_FILE,
  UPLOAD_S3_IMAGE,
  SEND_NOTIFICATION,
  NOTIFY_BY_EMAIL_FROM_SES,
  sendEmail,
  email_template_code_verification_function,
  property_email_template_function
};
