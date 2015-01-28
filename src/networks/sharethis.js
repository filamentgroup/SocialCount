(function( $, SocialCount ) {

	// ShareThis Widget plugin for SocialCount
	// ShareThis is JavaScript only and does not appear in the raw HTML.
	// Make sure you uncomment the ShareThis entry in the service.

	SocialCount.selectors.sharethis = '.sharethis';
	SocialCount.sharethisHtml = '<li class="sharethis"><a><span class="icon icon-share"></span><span class="count"></span></a></li>';

	SocialCount.plugins.init.push(function() {
		var $el = this,
			$sharethisNode = $( SocialCount.sharethisHtml );

		$sharethisNode.find( '.count' ).html( 'Share' ).end();
		$el.append( $sharethisNode );
	});

	SocialCount.plugins.bind.push(function(bind, url, isSmall) {
		var $el = this;

		bind( $el.find( SocialCount.selectors.sharethis ),
			// st_sharethis_custom
			'<span class="st_sharethis" displayText="' + ( isSmall ? '' : 'Share' ) + '" st_url="' + url + '"></span>',
			'http://w.sharethis.com/button/buttons.js' );
	});

})( jQuery, window.SocialCount );