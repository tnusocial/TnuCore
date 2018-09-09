const core = require('./TnuCore');

console.log(core.TnuSchools);

var ictu = core.Open("ICTU");
ictu.Login(process.argv[2], process.argv[3]).then(function (session) {
    if (session) {
        ictu.GetNews().then(function (news) {
            console.log(news);
        }, function (err) {
            console.log(err);
        });
        ictu.GetNewsDetail("41CCA65E8A984934BA47494596CA2F7C").then(function (detail) {
            console.log(detail);
        }, console.log);
    }
}, function (err) {
    console.log(err);
});
