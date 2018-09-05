const request = require('request');

module.exports = {
    Headers: {},
    Get: function (url, callback) {
        request(
            {
              url: url,
              headers: this.Headers
            },
            callback
        );
    },
    Post: function (url, data, callback) {
        request.post(
            {
              url: url,
              headers: this.Headers,
              form: data
            },
            callback
        );
    }
};
