const TnuBase = require('./TnuBase');
const md5 = require('md5');

const Endpoints = {
    Raw: function (path) {
        return "http://dangkytinchi.ictu.edu.vn/" + path;
    },
    Make: function (endpoint) {
        return Endpoints.Raw( "kcntt/" + endpoint );
    }
};
Endpoints.Login = function () {
    // test env
    return "http://localhost:8080/DangNhap.html";
};
Endpoints.Login = function (token) {
    token = token || "";
    return Endpoints.Make(token + "Login.aspx");
};
Endpoints.Home = function (token) {
    token = token || "";
    return Endpoints.Make(token + "Home.aspx");
};

module.exports = function () {
    var __URLTOKEN__ = "";

    var base = new TnuBase();

    this.Login = function (username, password) {
        return new Promise(function(resolve, reject) {
            resolve = resolve || function () {};
            reject = reject || function () {};
            base.Get(Endpoints.Login()).then(function (resp) {
                var $ = base.ParseHtml(resp);
                var post = {};
                $("#Form1").serializeArray().forEach(function (entry) {
                    post[entry.name] = entry.value;
                });

                post["txtUserName"] = username;
                post["txtPassword"] = md5(password);
                post["btnSubmit"] = "Đăng nhập";

                base.Post(Endpoints.Login(), post).then(function (resp) {
                    resolve(resp);
                }, function (err) {
                    if (err.response.statusCode == 302) {
                        __URLTOKEN__ = (err.response.headers.location.match(/\(S\(.*?\)\)/gi)[0] || "") + "/";

                        base.Post(Endpoints.Login(__URLTOKEN__), post).then(function (resp) {
                            resolve(resp.indexOf("(" + username + ")") > -1);
                        }, function (err) {
                            resolve(!!err.response.headers["set-cookie"]);
                            base.SetCookies(err.response.headers["set-cookie"]);
                        });
                    } else {
                        reject(err);
                    }
                });
            }, reject);
        });
    };

    this.GetHome = function () {
        return new Promise(function(resolve, reject) {
            base.Get(Endpoints.Home()).then(function (resp) {
                    var $ = base.ParseHtml(resp);
                    resolve($("#ctl05_MyList").text());
                }, function (err) {
                    reject(err)
                }
            );
        });
    }
};

module.exports["Name"] = "ICTU";
module.exports["Title"] = "Đại học Công Nghệ Thông Tin và Truyền Thông";
module.exports["Description"] = "ICTU";
