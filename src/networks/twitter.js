(function( $, SocialCount ) {

  SocialCount.selectors.twitter = '.twitter';

  SocialCount.plugins.bind.push(function(bind, url) {
    var $el = this,
      shareText = SocialCount.getShareText( $el );

    bind( $el.find( SocialCount.selectors.twitter + ' a' ),
      '<a href="https://twitter.com/share" class="twitter-share-button"' +
        ' data-url="' + url + '"' +
        ( shareText ? ' data-text="' + shareText + '"': '' ) +
        ' data-count="none" data-dnt="true">Tweet</a>',
      '//platform.twitter.com/widgets.js',
      function( el ) {
        twttr.widgets.load( el );
      });
  });

})( jQuery, window.SocialCount );


