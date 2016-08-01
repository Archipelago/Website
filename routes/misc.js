module.exports = function(app) {
  app.get('/', function(req, res) {
    res.renderDefaultPage(req, res);
  });
}
