const base = require('./TnuBase');

const Endpoints = {
    Login: "http://dangkytinchi.ictu.edu.vn/kcntt/login.aspx"
};

module.exports = {
    Login: function (username, password, callback) {
        base.Get(Endpoints.Login, callback);
    }
};
