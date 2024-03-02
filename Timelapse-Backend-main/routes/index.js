var express = require('express');
var router = express.Router();
var multer  = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const braintree = require('braintree');
const sendGridMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
require('dotenv').config();

ffmpeg.setFfmpegPath(ffmpegStatic);

var uploadCounter = 1;
var upload_url = "./public/uploads";
var video_save = "./public/videos";
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const gateway = new braintree.BraintreeGateway({
  // environment: braintree.Environment.Production,
  // merchantId: process.env.PRODUCTION_MERCHANT_ID,
  // publicKey: process.env.PRODUCTION_PUBLIC_KEY,
  // privateKey: process.env.PRODUCTION_PRIVATE_KEY
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.SANDBOX_MERCHANT_ID,
  publicKey: process.env.SANDBOX_PUBLIC_KEY,
  privateKey: process.env.SANDBOX_PRIVATE_KEY
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ success: true });
});

router.post("/", function (req, res, next) {
  res.json({ success: true });
});

router.post("/create-video", function (req, res, next) {
  // Generate a random folder name
  var folderName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  var folderPath = path.join(upload_url, folderName);
  fs.mkdirSync(folderPath, { recursive: true });

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, "img" + uploadCounter++ + ".png");
    },
  });

  var upload = multer({ storage: storage }).array("images");

  upload(req, res, function (err) {
    if (err) {
      return next(err);
    }

    const video_name = `${Date.now()}${Math.floor(Math.random() * 100)}.mp4`;
    ffmpeg()
      .input(`${folderPath}/img%d.png`)
      .inputFPS(10)
      .outputOptions([
        "-vf scale=1920:1080",
        "-c:v libx264",
        "-r 30",
        "-pix_fmt yuv420p",
      ])
      .output(`${video_save}/${video_name}`)
      .on("end", function () {
        fs.rmdirSync(folderPath, { recursive: true }); // delete the entire folder
        exec(
          `ffmpeg -i ${video_save}/${video_name} -i ${upload_url}/left-mark.png -i ${upload_url}/right-mark.png -filter_complex "[1]format=rgba,colorchannelmixer=aa=0.8[left_logo];[2]format=rgba,colorchannelmixer=aa=0.8[right_logo];[0][left_logo]overlay=x=10:y=main_h-overlay_h-10[left_watermarked];[left_watermarked][right_logo]overlay=x=main_w-overlay_w-10:y=main_h-overlay_h-10:format=auto,format=yuv420p" -c:a copy ${video_save}/final_${video_name}`,
          (error) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }

            fs.unlink(`${video_save}/${video_name}`, (err) => {
              if (err) {
                console.error(err.message);
                return;
              }
            });
            res
              .status(200)
              .json({ message: "success", url: `final_${video_name}` });
          }
        );
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .run();
    uploadCounter = 1;
  });
});

router.get('/get_client_token', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send('Error generating token');
    } else {
      res.send(response.clientToken);
    }
  });
});

router.post('/process-payment', (req, res) => {  
  const { paymentMethodNonce, amount } = req.body;
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: paymentMethodNonce,
    options: {
      submitForSettlement: true,
    },
  }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (result.success) {
      res.json({ success: true, transaction: result.transaction });
    } else {
      res.status(500).json({ error: result.errors });
    }
  });
});

router.post('/refund', (req, res) => {
  const { transactionId, amount } = req.body;

  gateway.transaction.refund(transactionId, amount, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.success) {
      res.json({ success: true, transaction: result.transaction });
    } else {
      res.status(500).json({ error: result.message });
    }
  });
});

router.post('/void', (req, res) => {
  console.log(req.body)
  const { transactionId } = req.body;

  gateway.transaction.void(transactionId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.success) {
      res.json({ success: true, transaction: result.transaction });
    } else {
      res.status(500).json({ error: result.message });
    }
  });
});

router.get('/check-payment/:transactionId', (req, res) => {
  console.log(req.params)
  const transactionId = req.params.transactionId;

  gateway.transaction.find(transactionId, (err, transaction) => {
    if (err) {
      // Handle errors (e.g., transaction not found or API errors)
      res.status(500).json({ error: err.message });
    } else {
      // Check the transaction status
      switch (transaction.status) {
        case 'submitted_for_settlement':
        case 'settling':
        case 'settled':
          res.json({ success: true, status: transaction.status });
          break;
        default:
          res.json({ success: false, status: transaction.status });
          break;
      }
    }
  });
});

router.post('/sendVerificationMail', async (req, res) => {
  const { email, name } = req.body;
  const randNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  try {
    await sendGridMail.send({
      to: email,
      from: 'no-reply@designtimelapse.com',
      subject: 'Verify your email address',
      text: "Please verify your email address to complete registration",
      html: `
        <h4>Hi, ${name} </h4>
        <h4>Thanks for your interest in joining DesignTimelapse! To complete your registration, we need you to verify your email address.</h4>
        <h3>${randNum}</h3>
      `
    });
    return res.json({ code: 200, success: true, verifyNum: `${randNum}`});
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
})

module.exports = router;