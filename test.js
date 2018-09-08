const core = require('./TnuCore');

console.log(core.TnuSchools);
var ictu = core.Open("ICTU");
ictu.Login("DTC145D4801030038", "password").then(function (session) {
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
