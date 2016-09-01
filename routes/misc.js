module.exports = function(app) {
  app.get('/', function(req, res) {
    res.renderDefaultPage(req, res);
  });

  app.get('/permissions.css', function(req, res) {
    res.write('[class^=\'permission-\'],[class*=\' permission-\']{display:none !important}');
    let permissions = token.getPermissions(req);
    for (let i = 0; i < permissions.length; ++i) {
      res.write('.permission-' + permissions[i].toLowerCase().replace(/_/g, '-'));
      if (i + 1 < permissions.length)
	res.write(',');
    }
    if (permissions.length > 0)
      res.write('{display:initial !important}');
    res.end();
  });
}
