const request = require('request');
const jsdom = require('jsdom');
var ictu = require("./DataSource/ICTU");

function Login (username, password) {
    ictu.Login(username, password, function (a,b,c) {
        var dom = new jsdom.JSDOM(c);
        var document = dom.document;
        console.log(dom.window.document.forms[0].formData);
    });
}

exports.Login = Login;

exports.test = function () {
    request("http://dangkytinchi.ictu.edu.vn/kcntt/login.aspx", function (err, resp, body) {
        console.log(body);
    });
};
