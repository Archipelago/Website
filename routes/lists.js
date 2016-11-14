let apiRequest = require('../api_request');

module.exports = function(app) {
  app.get('/lists', function(req, res) {
    apiRequest(req, res, 'get', '/lists', function(e, r, b) {
      res.renderView('lists', {lists: b});
    });
  });
}
