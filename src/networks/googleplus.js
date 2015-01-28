(function( $, SocialCount ) {

  SocialCount.selectors.googleplus = '.googleplus';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this;

    bind( $el.find( SocialCount.selectors.googleplus + ' a' ),
      '<div class="g-plusone" data-size="medium" data-annotation="none" data-href="' + url + '"></div>',
      '//apis.google.com/js/plusone.js',
      function( el ) {
        gapi.plusone.go( el );
      });
  });

})( jQuery, window.SocialCount );


