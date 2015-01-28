(function( $, SocialCount ) {

  SocialCount.selectors.facebook = '.facebook';

  SocialCount.getFacebookAction = function( $el ) {
    return ( $el.attr('data-facebook-action' ) || 'like' ).toLowerCase();
  };

  SocialCount.plugins.init.push(function() {
    var $el = this;
    $el.addClass( SocialCount.getFacebookAction( $el ) );
  });

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this,
      facebookAction = SocialCount.getFacebookAction( $el );

    bind( $el.find( SocialCount.selectors.facebook + ' a' ),
      '<div class="fb-like" data-href="' + url + '" data-layout="button"' + 
        ' data-action="' + facebookAction + '" data-show-faces="false"' + 
        ' data-share="false"></div>',
      '//connect.facebook.net/' + ( SocialCount.locale || 'en_US' ) + '/sdk.js#xfbml=1&version=v2.0',
      function( el ) {
        FB.XFBML.parse( el );
      });
  });

})( jQuery, window.SocialCount );


