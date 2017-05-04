$(function() {
  $('button#addLink').on('click', function() {
    let length = $('textarea[id^=setOfLinks]').length + 1;
    let div = '<div class="form-group">'
	+ '<div class="col-sm-3">'
	+ '<label for="setOfLinks' + length + '" class="control-label">'
	+ $('#setOfLinks > div.form-group:first label').text().split(/\s#/)[0]
	+ ' #' + length + '</label> &nbsp; <select>';
    for (let i = 1; i < 10; ++i) {
      div += '<option value="' + i + '">' + i + '</option>';
    }

    div += '</select></div>'
      + '<div class="col-sm-7 col-xs-11">'
      + '<textarea name="links|' + length + '" class="form-control" id="setOfLinks' + length + '" style="height: 2.5em">'
      + '</textarea></div>'
      + '<div class="col-sm-1 col-xs-1">'
      + '<button type="button" class="close" style="font-size: 2.5em">&times;</button>'
      + '</div></div>';
    $('#setOfLinks').append(div);
  });

  $('div#setOfLinks').on('click', 'button.close', function() {
    $(this).parent().parent().remove();
  });

  $('div#setOfLinks').on('change', 'select', function() {
    $('textarea' ,$(this).parent().parent()).attr('style', 'min-height: 2.5em; height: ' + 1.7 * $(this).val() + 'em');
  });
});
