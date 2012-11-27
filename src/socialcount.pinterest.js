(function( $, SocialCount ) {

	SocialCount.classes.pinterest = '.pinterest';

	SocialCount.plugins.bind.push(function(bind, url, isSmall) {
		var $el = this;

    var desc = $el.data('description');
    var media = $el.data('media');

		bind( $el.find( SocialCount.classes.pinterest ),
      '<a href="http://pinterest.com/pin/create/button/?url=' + url + '&media=' + media + '&description=' + desc + '" class="pin-it-button" count-layout="none"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>',
      '//assets.pinterest.com/js/pinit.js');
	});

})( jQuery, window.SocialCount );


