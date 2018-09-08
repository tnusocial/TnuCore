const request = require('request');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

var ICTU = require("./DataSource/ICTU");

function Login (username, password) {
    var ictu = new ICTU();

    ictu.Login(username, password).then(function (session) {
        if (session) {
            ictu.GetHome().then(function (resp) {
                console.log(resp);
            }, function (err) {
                console.log(err);
            });
        }
    }, function (err) {
        console.log(err);
    });
};

exports.Login = Login;

exports.test = function () {
    Login("DTC145D4801030038", "0neloveM@yy");
    return;
    request("http://localhost:8080/DangNhap.html", function (err, resp, body) {
        var $ = cheerio.load(body);

        console.log($("#Form1").serializeArray());
    });
};
