const core = require('./TnuCore');

// console.log(core.TnuSchools);

var ictu = core.Open("ICTU");
ictu.Login(process.argv[2], process.argv[3]).then(function (session) {
    if (session) {
        // ictu.GetNews().then(function (news) {
        //     console.log("\n\nDữ liệu về thông báo tại trang chủ:");
        //     console.log(news);
        //     ictu.GetNewsDetail(news[0].Id).then(function (detail) {
        //         console.log("\n\nDữ liệu về thông báo đầu tiên:");
        //         console.log(detail);
        //     }, console.log);
        // }, function (err) {
        //     console.log(err);
        // });
        // ictu.GetProfile().then(function (resp) {
        //     console.log("\n\nThông tin tài khoản:");
        //     console.log(resp);
        // }, console.log);
        ictu.GetSemestersOfStudy().then(function (resp) {
            // console.log("\n\nDanh sách kỳ học:");
            // console.log(resp);
            var code = resp[2];
            console.log("Get: ", code);
            ictu.GetTimeTableOfStudy(code.Code).then(function (resp) {
                console.log("\n\nLịch học:");
                console.log(JSON.stringify(resp));
                // resp.forEach(function (x) {
                //     console.log(x);
                // });
            }, console.log);
        }, console.log);
        // ictu.GetSemestersOfExam().then(function (resp) {
        //     console.log("\n\nDanh sách kỳ thi:");
        //     console.log(resp);
        // }, console.log);
    }
}, function (err) {
    console.log(err);
});
