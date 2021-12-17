const express = require('express');
const date = require('date-and-time');
const app = express();
var path = require('path');
var alert = require('alert');
var mysql = require('mysql2');
var html = require("html");
var flash = require('req-flash');
const pool = mysql.createPool({
    host: "sql5.freesqldatabase.com",
    user: "sql5459626",
    password: "z5eZQnTI7k",
    database: 'sql5459626',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
//global variables declaration
var data = [];
const port = process.env.PORT || 3002;
const bodyparser = require('body-parser');
var reqemail;
var email;
var noofpass;
var finalprice;
var finalpricel;
var boardtime;
var reachtime;
var passclass;
var economyprice;
var businessprice;
var firstclassprice;
var mrms;
var firstname;
var lastname;
var passname;
var to;
var from;
var random_otp_generator = Math.floor(Math.random() * 1000) + 1000;
var pnr = random_otp_generator + 2000;
var dbpnr = "PNR" + pnr;
var cardnumber;
var cardowner;
var upiid;
var bank;

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(bodyparser.urlencoded({
    extended: true
}));


//login
app.post('/', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) throw err;
        email = req.body.email;
        var pwd = req.body.pwd;
        if (email == "") {
            alert("PLEASE ENTER EMAIL");
        } else if (pwd == "") {
            alert("PLEASE ENTER PASSWORD");
        } else {
            con.query(`SELECT gmail,password FROM users WHERE gmail='${email}'`, function(error, result, field) {
                if (result.length > 0) {
                    if (result[0].password == pwd) {
                        var sql = 'SELECT cityname FROM cities';
                        con.query(sql, function(err, data1, fields) {
                            if (err) throw err;
                            res.render('login1.html', { cityname: data1 });
                            data = Array.from(data1);
                        });
                    } else { alert("INCORRECT PASSWORD") };
                } else {
                    res.send("<h2 style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >Account doesn't exist </h2>")
                    alert("INCORRECT DETAILS");

                }

            });
        }
        pool.releaseConnection(con);
    });
});

app.get('/', function(req, res) {
    res.sendFile('/views/login.html', {
        root: path.join(__dirname)
    })
});

//get otp
app.post('/getotp', function(req, res) {
    pool.getConnection(function(err, con) {
        reqemail = req.body.email;
        con.query(`SELECT gmail FROM users WHERE gmail='${reqemail}'`, function(error, result1, field) {
            if (result1) {
                if (reqemail == "") {
                    alert("ENTER VALID EMAIL");
                    res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ENTER VALID MAIL</h2>");
                } else if (result1.length == 0) {
                    alert("ACCOUNT DOESN'T EXIST TO CHANGE PASSWORD");
                    res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ACCOUNT DOESNT EXIST WITH THE ENTERED MAIL</h2>")
                } else if (req.body.email != " ") {
                    var nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'connecting2airways@gmail.com',
                            pass: 'Sainath@2'
                        }
                    });
                    reqemail = req.body.email;
                    var mailOptions = {
                        from: 'connecting2airways@gmail.com',
                        to: reqemail,
                        subject: 'PASSWORD CHANGE REQUEST',
                        text: " The OTP for for changing the password is " + random_otp_generator
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red' >OTP sent to </h2>  " + req.body.email + "  <h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red' >  PLEASE ENTER OTP TO CHANGE YOUR PASSWORD</h2>");
                }
            }
        })
        pool.releaseConnection(con);
    });
})
app.get('/getotp', function(req, res) {
    res.sendFile('/views/forgotpassword.html', {
        root: path.join(__dirname)
    })
})

//forgotpassword
app.post('/f', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) throw err;
        console.log("Connected!");
        var otp = req.body.otp;
        var password = req.body.pwd;
        var cpassword = req.body.cpwd;
        if (password == cpassword) {
            alert("passwords  match");
            if (otp != random_otp_generator) {
                alert("ENTER VALID OTP");
            } else if (otp == random_otp_generator) {
                alert("correct otp");
                con.query(`SELECT gmail FROM users WHERE gmail='${reqemail}'`, function(error, result, field) {
                    var sql1 = `UPDATE users SET password='${password}' WHERE gmail='${reqemail}';`;
                    con.query(sql1, function(err, result1, field1) {
                        if (err) throw err;
                        console.log(reqemail);
                        console.log(result1);
                        console.log(result1.info.split(" ")[2]);
                        if (result1.info.split(" ")[2] != '0') {
                            console.log("ACCOUNT EXISTS");
                            alert("PASSWORD CHANGED");
                            console.log("VALUES UPDATED");
                        } else {
                            alert("ACCOUNT DOESN'T EXIST");
                            console.log("ACCOUNT DOESN'T EXIST");
                        }
                    });
                });
                res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >PASSWORD CHANGED</h2>");
            }
        } else if (password != cpassword) {
            alert("passwords didnt match");
            res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >Passwords didnt match</h2> ");
            console.log(password);
            console.log(cpassword);
        }
        pool.releaseConnection(con);
    });

});
app.get('/f', function(req, res) {
    res.sendFile('/views/forgotpassword.html', {
        root: path.join(__dirname)
    })
});

//new account
app.post('/newaccount', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) throw err;
        console.log("Connected!");
        var email1 = req.body.email;
        var pwd = req.body.pwd;
        var cpwd = req.body.cpwd;
        con.query(`SELECT gmail FROM users WHERE gmail='${email1}'`, function(error, result, field) {
            if (result.length != 0) {
                alert("ACCOUNT EXISTS");
                res.send(" <h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ACCOUNT EXISTS</h2>")
            } else if (result.length == 0) {
                console.log(result);
                console.log("new account");
                if (pwd != cpwd) {
                    alert("PASSWORDS DIDN'T MATCH");
                    res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >PASSWORDS DIDN'T MATCH</h2>");
                } else if (pwd == cpwd) {
                    var sql1 = `INSERT INTO users (gmail,password) VALUES ('${email1}','${pwd}');`;
                    con.query(sql1, function(err, result) {
                        if (err) throw err;
                        console.log("VALUES INSERTED");

                        res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ACCOUNT CREATED SUCCESSFULLY, GO BACK AND LOG IN</h2>");
                    });
                }
            }
        });
        pool.releaseConnection(con);
    });
})
app.get('/newaccount', function(req, res) {
    res.sendFile('/views/newaccount.html', {
        root: path.join(__dirname)
    })
});

//flightdetails
app.get('/flightdetails', function(req, res) {
    pool.getConnection(function(err, con) {
        to = req.query.tocities.toUpperCase();
        from = req.query.fromcities.toUpperCase();
        noofpass = req.query.noofpass;
        console.log(to);
        console.log(from);
        if (to == from) { alert("PLEASE SELECT DIFFERENT CITY");
                         res.send('PLEASE SELECT A DIFFERENT CITY');} else {
            var sql1 = `SELECT *FROM flightinfo WHERE startfrom='${to}' AND destination='${from}';`
            con.query(sql1, function(err, result, field) {
                if (err) throw err;
                var todaydate = new Date();
                console.log(todaydate);
                var selecteddate = req.query.selecteddate;
                console.log(selecteddate);
                var arr = selecteddate.split("-");
                var date1 = new Date(arr[0], arr[1], arr[2]);
                var value = date.subtract(date1, todaydate);
                var absolutevalue = Math.round(value.toDays()) - 30;
                if(absolutevalue<0){res.send("ENTER A VALID DATE");}
                else{
                console.log(absolutevalue);
                console.log(result.length);
                //console.log(result[0].price);
                for (let index = 0; index < result.length; index++) {
                    result[index].flightid = "CAIR" + result[index].flightid;
                     if(absolutevalue<0)
                    {
                       res.send("PLEASE SELECT A CORRECT DATE");
                    }
                    else if (absolutevalue < 5) {
                        result[index].price = Math.round((result[index].price) * 2.5);
                        finalprice = result[index].price;
                    } else if (5 <= absolutevalue < 15) {
                        result[index].price = Math.round((result[index].price) * 2.08);
                        finalprice = result[index].price;
                    } else if (15 <= absolutevalue < 30) {
                        result[index].price = Math.round((result[index].price) * 1.5);
                        finalprice = result[index].price;
                    } else if (absolutevalue >= 30) {
                        result[index].price = result[index].price;
                        finalprice = result[index].price;
                    }
                }
                res.render('login1.html', { result: result, cityname: data })}
            });
        }
        pool.releaseConnection(con);
    });

});
//acount deletion
app.get('/deleteaccount', function(req, res) {
    console.log(email);
    pool.getConnection(function(err, con) {
        if (err) throw err;
        var sqlsn = `DELETE FROM users WHERE gmail='${email}';`;
        con.query(sqlsn, function(err, result, field) {
            if (err) throw err;
        });
        alert("ACCOUNT DELETED SUCCESSFULLY");
        res.render('login.html');
        pool.releaseConnection(con);
    })
})

//flightselection and passenger info
app.post('/passinfo', function(req, res) {
    boardtime = req.body.starttime;
    reachtime = req.body.reachtime;
    var noofpassrr = [];
    finalprice = finalprice * noofpass;
    var economypricestr = finalprice + "Rs";
    var businesspricestr = 3 * finalprice + "Rs";
    var firstclasspricestr = 2 * finalprice + "Rs";
    economyprice = finalprice;
    businessprice = 3 * finalprice;
    firstclassprice = 2 * finalprice;
    for (let ind = 0; ind < noofpass; ind++) {
        noofpassrr[ind] = noofpass;
    }
    res.render('passengerinfo.html', { noofpass: noofpassrr, economypricestr: economypricestr, businesspricestr: businesspricestr, firstclasspricestr: firstclasspricestr });

});

app.post('/paymentoptions', function(req, res) {
    passclass = req.body.classsele;
    mrms = req.body.mrms;
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    if (passclass == "economy") {
        finalpricel = economyprice + 255;
        res.render('paymentoptions.html', { finalpricel: finalpricel });
    } else if (passclass == "business") {
        finalpricel = businessprice + 255;
        res.render('paymentoptions.html', { finalpricel: finalpricel });
    } else if (passclass == "first") {
        finalpricel = firstclassprice + 255;
        res.render('paymentoptions.html', { finalpricel: finalpricel });
    }
    //gettingfullpassengernames
    if (noofpass == 1) {
        passname = mrms + firstname + lastname;

    } else if (noofpass > 1) {
        for (let i = 0; i < mrms.length; i++) {
            passname = mrms[i] + firstname[i] + lastname[i];
        }
    }
});


//paymentoptions
app.post('/payment', function(req, res) {
    var selectedpaymentopt = req.body.payopt;
    console.log(selectedpaymentopt);
    if (selectedpaymentopt == "Creditcard") { res.render('credit.html'); } else if (selectedpaymentopt == "Upi") { res.render('upi.html'); } else if (selectedpaymentopt == "Netbanking") { res.render('netbanking.html'); }
})

//payments with credit or debit
app.post('/cardpayment', function(req, res) {
    cardnumber = req.body.cardnumber;
    cardowner = req.body.cardowner;
    var cvv = req.body.cvv;
    if (cardnumber.length != 16) {
        alert("ENTER VALID CARD NUMBER");
        res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ENTER VALID CARD NUMBER</h2>");
    } else if (cvv.length != 3) {
        alert("ENTER VALID CVV");
        res.send("<h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >ENTER VALID CVV</h2>")
    } else {
        pool.getConnection(function(err, con) {
            if (err) throw err
            var sql = `insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,cardowner,carnumber,bookingstatus)
               values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${cardowner}','${cardnumber}','booked')`;
            if (noofpass == 1) {
                passname = mrms + " " + firstname + " " + lastname;
                con.query(sql, function(err, resul, field) {
                    if (err) throw err
                });
            } else if (noofpass > 1) {
                for (let i = 0; i < mrms.length; i++) {
                    passname = mrms[i] + " " + firstname[i] + " " + lastname[i];
                    con.query(`insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,cardowner,carnumber,bookingstatus)
                    values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${cardowner}','${cardnumber}','booked')`, function(err, resul, field) {
                        if (err) throw err

                    })

                }
            }
            pool.releaseConnection(con);
        })
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'connecting2airways@gmail.com',
                pass: 'Sainath@2'
            }
        });
        var mailOptions = {
            from: 'connecting2airways@gmail.com',
            to: email,
            subject: 'TICKETS BOOKED SUCCESSFULLY',
            text: 'The PNR for your tickets is' + dbpnr
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.send(" <h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:blue;' >Payment Successful,Your tickets are booked and sent to your email</h2>" );

    }
})

//upi payment
app.post('/upipayment', function(req, res) {
    upiid = req.body.upiid;
    let bool1 = upiid.endsWith("@paytm");
    let bool2 = upiid.endsWith("@SBI");
    let bool3 = upiid.endsWith("@icici");
    let bool4 = upiid.endsWith("@PNB");
    let bool5 = upiid.endsWith("@HDFC");
    let bool6 = upiid.endsWith("@axis");
    let bool7 = upiid.endsWith("@YBL");
    let bool8 = upiid.endsWith("@barodapay");
    let bool9 = upiid.endsWith("@upi");
    if (bool1 || bool2 || bool3 || bool4 || bool5 || bool6 || bool7 || bool8 || bool9 == true) {
        pool.getConnection(function(err, con) {
            if (err) throw err
            var sql = `insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,upiid,bookingstatus)
               values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${upiid}','booked')`;
            if (noofpass == 1) {
                passname = mrms + " " + firstname + " " + lastname;
                con.query(sql, function(err, resul, field) {
                    if (err) throw err
                        //    console.log("successfullly entered");
                });
            } else if (noofpass > 1) {
                for (let i = 0; i < mrms.length; i++) {
                    passname = mrms[i] + " " + firstname[i] + " " + lastname[i];
                    con.query(`insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,upiid,bookingstatus)
                    values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${upiid}','booked')`, function(err, resul, field) {
                        if (err) throw err
                            //          console.log("successfullly entered");
                    })

                }
            }
            pool.releaseConnection(con);
        })
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'connecting2airways@gmail.com',
                pass: 'Sainath@2'
            }
        });
        var mailOptions = {
            from: 'connecting2airways@gmail.com',
            to: email,
            subject: 'TICKETS BOOKED SUCCESSFULLY',
            text: 'The PNR for your tickets is' + dbpnr
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.send(" <h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:blue;' >Payment Successful,Your tickets are booked and sent to your email.</h2>" );


    } else {
        res.send(" <h2  style='font-style: italic ; font-family:'Times New Roman', Times, serif; color:red;' >Incorrect UPI ID:</h2>");


    };


})

//netbanking
app.post('/netbanking', function(req, res) {
    bank = req.body.nb;

    var sql = `insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,bankname,bookingstatus)
    values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${bank}','booked')`;
    pool.getConnection(function(err, con) {
        if (noofpass == 1) {
            passname = mrms + " " + firstname + " " + lastname;
            con.query(sql, function(err, resul, field) {
                if (err) throw err
                    //console.log("successfullly entered");
            });
        } else if (noofpass > 1) {
            for (let i = 0; i < mrms.length; i++) {
                passname = mrms[i] + firstname[i] + lastname[i];
                //console.log(passname);
                con.query(
                    `insert into paymentdetails (email,startcity,reachcity,starttime,reachtime,price,pnr,passengername,bankname,bookingstatus)
                values ('${email}','${to}','${from}','${boardtime}','${reachtime}',${finalpricel},'${dbpnr}','${passname}','${bank}','booked')`,
                    function(err, resul, field) {
                        if (err) throw err
                            //  console.log("successfullly entered");
                    })

            }
        }
        pool.releaseConnection(con);
    })
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'connecting2airways@gmail.com',
            pass: 'Sainath@2'
        }
    });
    var mailOptions = {
        from: 'connecting2airways@gmail.com',
        to: email,
        subject: 'TICKETS BOOKED SUCCESSFULLY',
        text: 'The PNR for your tickets is' + dbpnr
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.setHeader('Content-type', 'text/html')
    res.send("<h2 style='font-style: italic ; font-family:'Times New Roman', Times, serif;color:red;'>Payment Successful,Your tickets are booked and sent to your email." );

})

//flightcancellation
app.post('/flightcancellation', function(req, res) {
    var pnrcancel = req.body.pnr.toUpperCase();
    pool.getConnection(function(err, con) {
        var cancelsql = `select pnr from paymentdetails where pnr='${pnrcancel}'`;
        con.query(cancelsql, function(err, result, field) {
            if (err) throw err;

            if (result) {
                con.query(`update paymentdetails set bookingstatus='cancelled' where pnr='${pnrcancel}'`, function(err, resu, field) {
                    if (err) throw err;
                    var nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'connecting2airways@gmail.com',
                            pass: 'Sainath@2'
                        }
                    });
                    var mailOptions = {
                        from: 'connecting2airways@gmail.com',
                        to: email,
                        subject: 'TICKETS CANCELLATION STATUS',
                        text: 'The tickets are cancelled successfully,your refund is initiated.'
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    alert("TICKETS CANCELLED");
                    res.render('login1.html', { cityname: data });
                })
            } else {
                alert("ENTER A VALID PNR");
                res.send("<h2 style='font-style: italic ; font-family:'Times New Roman', Times, serif;color:red;'>ENTER A VALID PNR</h2>");
            }
        })
        pool.releaseConnection(con);
    })


})
app.get('/flightcancellation', function(req, res) {
    res.sendFile('/views/flightcancellation.html', {
        root: path.join(__dirname)
    })
});



app.listen(port);
//screen resolution
//1536x864
