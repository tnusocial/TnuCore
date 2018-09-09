const md5 = require('md5');
const moment = require('moment');

const TnuBase = require('./TnuBase');
const TnuFile = require('../DataStruct/TnuFile');
const TnuNews = require('../DataStruct/TnuNews');
const TnuNewsDetail = require('../DataStruct/TnuNewsDetail');

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

    var User = {};

    this.Login = function (username, password) {
        username = username || false;
        password = password || false;
        return new Promise(function(resolve, reject) {
            if (!username || !password) {
                resolve(false);
            }
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
                            if (resp.indexOf("(" + username + ")") > -1) {
                                resolve(true);
                                User.Username = username;
                                User.Password = password;
                            } else {
                                resolve(false);
                            }
                        }, function (err) {
                            if (!!err.response.headers["set-cookie"]) {
                                resolve(true);
                                base.SetCookies(err.response.headers["set-cookie"]);
                                User.Username = username;
                                User.Password = password;
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        reject(err);
                    }
                });
            }, reject);
        });
    };

    this.GetNews = function () {
        return new Promise(function(resolve, reject) {
            base.Get(Endpoints.Home()).then(function (resp) {
                    var $ = base.ParseHtml(resp);
                    try {
                        var arr = [];
                        $("#ctl05_MyList").find(".important_news A").each(function (k, A) {
                            var A = $(A);
                            var uri = A.attr("href");
                            var link = Endpoints.Make(uri);
                            var id = uri.substr(uri.indexOf("?IDThongBao=") + "?IDThongBao=".length);
                            var _class = "important_news";
                            var title = A.text().trim();
                            var time = moment(title.substr(-11,10), "dd/mm/YYYY").toDate();

                            arr.push(new TnuNews(id, _class, link, time, title));
                        });
                        $("#ctl05_MyList").find(".old_news A").each(function (k, A) {
                            var A = $(A);
                            var uri = A.attr("href");
                            var link = Endpoints.Make(uri);
                            var id = uri.substr(uri.indexOf("?IDThongBao=") + "?IDThongBao=".length);
                            var _class = "old_news";
                            var title = A.text().trim();
                            var time = moment(title.substr(-11,10), "dd/mm/YYYY").toDate();

                            arr.push(new TnuNews(id, _class, link, time, title));
                        });
                        resolve(arr);
                    }catch(err) {
                        reject(err);
                    }
                }, function (err) {
                    reject(err);
                }
            );
        });
    }

    this.GetNewsDetail = function (id) {
        return new Promise(function(resolve, reject) {
            var uri = "HomeDetail.aspx?IDThongBao=" + id;
            var link = Endpoints.Make(uri);
            base.Get(link).then(function (resp) {
                var $ = base.ParseHtml(resp);

                var title = $("#lblTieude").text().trim(),
                    time = moment(title.substr(-11,10), "dd/mm/YYYY").toDate(),
                    tomtat = $("#lblTomtat").text().trim(),
                    content = $("#lblChitiet").html(),
                    files = [];

                $("#pnlFile ul li a").each(function (k, A) {
                    A = $(A);
                    files.push(new TnuFile(A.attr("href"), A.text().trim()));
                });

                resolve(new TnuNewsDetail(id, link, time, title, tomtat, content, files));
            }, reject);
        });
    }

    this.GetProfile = function () {
        return new Promise(function(resolve, reject) {
            base.Get(Endpoints.Make("MarkAndView.aspx")).then(function (resp) {
                var $ = base.ParseHtml(resp);

            }, reject);
        });
    }
};

module.exports["Name"] = "ICTU";
module.exports["Title"] = "Đại học Công Nghệ Thông Tin và Truyền Thông";
module.exports["Description"] = "ICTU";
