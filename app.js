const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var nodemailer = require('nodemailer');

app.listen(4030, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Serverul rulează pe portul ' + 4030);
  }
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mong.platform@gmail.com',
    pass: 'MongPlatform'
  }
});

function createTable(rand, loc) {
  var t = '<table style=" font-family: arial, sans-serif;border-collapse: collapse;width: 50%;margin-left:250px;margin-top:50px;margin-bottom:50px;">' +
    '<tr style="border: 1px solid #dddddd;text-align: left;padding: 8px;background-color: #dddddd;"> <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Rand</th> <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;"    >Loc</th> </tr>';
  for (var i = 0; i < rand.length; i++) {
    var tr = "</tr>";
    tr += '<td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + rand[i] + '</td>';
    tr += '<td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">' + loc[i] + '</td>';
    tr += '</tr>';
    t += tr;
  }
  t += "</table>"
  return t;
}

async function getResults(rand, loc) {
  var res = await createTable(rand, loc);
  return res;
}

app.post('/api/notification/reservation', function (req, res) {
  console.log("POST send reservation email");
  res.setHeader('Content-Type', 'application/json');
  let email = req.body.email;
  let fullName = req.body.name;
  let date = req.body.date;
  let concert = req.body.concert;
  let locuri = req.body.locuri.split(",");
  var rand = [];
  var loc = [];
  for (let i = 0; i < locuri.length; i++) {
    let aux = locuri[i].split("/");
    rand.push(aux[0]);
    loc.push(aux[1]);
  }

  console.log(rand);
  console.log(loc);
  let reservation = getResults(rand, loc);

  reservation.then(res => {
    var mailOptions = {
      to: email,
      subject: 'Concert reservation',
      html: '<h1 style="text-align: center; text-shadow: 2px 2px 5px red;">Reservation details</h1>' +
        '<h2>Name: ' + fullName + '</h2>' +
        '<h2>Date: ' + date + '</h2>' +
        '<h2>Concert: ' + concert + '</h2>' + '<h2>' +
        res + '</h2>'
        +
        '<h1 style="text-align: center; text-shadow: 2px 2px 5px red;">Than you for your reservation!</h1>' +
        '<h2 style="text-align: right;margin-left:100px">Have a nice day, </h2>' +
        '<h2 style="text-align: right;margin-left:120px;color:#58a185 ;">ConcertNow team </h2>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.end(JSON.stringify("Email was not sent!"));
        console.log(error);
      } else {
        res.end(JSON.stringify("Email was sent succefully!"));
        console.log('Email sent! ');
        console.log(req.body);
      }
    });
  });

  console.log(req.body);
});


app.post('/api/notification/newMember', function (req, res) {
  console.log("POST send sign in email");
  res.setHeader('Content-Type', 'application/json');

  let email = req.body.email;
  let name = req.body.name;


  var mailOptions = {
    to: email,
    subject: 'Create account confirmation',
    html:
      '<h1 style="text-align: center;">Welcome ' + name + ', to Concert platform!</h1>' +
      '<h2 style="text-align: right;margin-left:120px">ConcertNow team </h2>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.end(JSON.stringify("Email was not sent!"));
      console.log(error);
    } else {
      res.end(JSON.stringify("Email was sent succefully!"));
      console.log('Email sent! ');
      console.log(req.body);
    }
  });
  console.log(req.body);
});