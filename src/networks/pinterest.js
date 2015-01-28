(function( $, SocialCount ) {

  SocialCount.selectors.pinterest = '.pinterest';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this;

    var desc = $el.data('description');
    var media = $el.data('media');

    bind( $el.find( SocialCount.selectors.pinterest ),
      '<a href="http://pinterest.com/pin/create/button/?url=' + url + '&media=' + media + '&description=' + desc + '" class="pin-it-button" count-layout="none"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>',
      '//assets.pinterest.com/js/pinit.js',
      function( el ) {
        // Thanks http://sourcey.com/dynamically-rendering-ajax-pinterest-buttons/
        // See also https://github.com/pinterest/widgets/blob/master/pinit_main.js
        for( var i in window ) {
          if( i.indexOf( 'PIN_' ) === 0 && typeof window[i] === 'object' ) {
            window[ i ].f.render.buttonPin( $( el ).find( "a" )[ 0 ] );
            return;
          }
        }
      });
  });

})( jQuery, window.SocialCount );


