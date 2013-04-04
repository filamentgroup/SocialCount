# SocialCount (simplified)

Original plugin: [Filamentgroup's SocialCount](https://github.com/filamentgroup/SocialCount/)

The problems with social networking widgets are [well documented][zurb]. They're heavy and slow to load especially on high-latency mobile connections.

[zurb]: http://www.zurb.com/article/883/small-painful-buttons-why-social-media-bu

SocialCount is a small jQuery plugin for progressively enhanced, lazy loaded, mobile friendly social networking widgets.

 * Currently supports Facebook, Twitter, Google Plus, VK.com and odnoklassniki.ru.
 * 1 JS request, 1 CSS request, 1 request for font (compared to 25 total requests for Facebook, Twitter, and Google Plus widgets)
 * Easy to fit in with existing page design
  * Works with mouse, touchscreen, or keyboard.
	 * Mouse: On hover, loads a social network's native widget so that the user can Like/Recommend/+1 without leaving the current page.
	 * Touch screen: simple redirects to dedicated network share pages.
	 * Keyboard: Concise tab order.
 * Intelligent client-side caching so that two or more widgets with the same share URL only make one AJAX request.
 * Requires jQuery and Modernizr

### [SocialCount Demo][demourl]

[demourl]: http://scarfacedeb.github.com/SocialCount/

Style's inspired by: [Social sign in buttons by Ilya Gorenburg][style]     
Font for symbols: [Grands][grands] (I added odnoklassniki.ru symbol to it)     

[style]: http://faveup.com/free-psd-files/social-sign-in-buttons/88872
[grands]: http://grawl.github.com/Grands/
        

## Getting Started

Add this scripts/stylesheet to your head:
	
	<link rel="stylesheet" href="../src/socialcount.css">
	<script src="../src/vendor/modernizr.custom.04153.js"></script>
	<script src="../src/socialcount.js"></script>


And this markup to the page:

	<ul class="socialcount" id="socialcount" data-url="http://www.google.com/" data-share-text="My Custom Share Text" data-vk-api="3542794"></ul>


Basic initializing code:
	
	$('#socialcount').socialCount();


### Default options:

	// css classes that would be added on specific actions
	classes: {
		active: 'active',
		touch: 'touch',
		hover: 'hover',
		activateOnHover: 'activate-on-hover',
		activateOnClick: 'activate-on-click',
	},
	activateOnClick: false, // false - active on hover
	// list of social sites, which buttons would be added to the page
	socialSites: [ 'facebook', 'twitter', 'googleplus', 'vk', 'odnoklassniki' ],
	// config for social sites
	sitesConfig: {
		facebook: {
			label: 'Like', // label on the button
			url: 'https://www.facebook.com/sharer/sharer.php' // fallback link
		},
		twitter: {
			label: 'Tweet',
			url: 'https://twitter.com/intent/tweet'
		},
		googleplus: {
			label: '+1',
			url: 'https://plus.google.com/share'
		},
		vk: {
			label: 'Like',
			url: 'https://vk.com/share.php'
		},
		odnoklassniki: {
			label: 'Класс',
			url: 'http://connect.mail.ru/share'
		}
	},
	googleplusTooltip: 'table.gc-bubbleDefault', // selector for g+ popup
	vkElementID: 'vk_like' // ID of vk.com element


You can choose what sites you want to show by changing *socialSites* option. (it's a list, see default options)


### Note
Vk.com examples work only on localhost.com because it's API ID is linked to this domain. (you can create this alias for localhost in your hosts file). You'll need to add `data-vp-api="YOUR_SITE_API_ID"` to ul for vk.com likes to work.

### Download [socialcount.zip][zipfile]

[zipfile]: https://github.com/scarfaceDeb/SocialCount/zipball/master

## Release History
* `v0.1.0` Initial release
* `v0.1.1` Fix for IE (tested up to 9) issue with iframes and :hover rules
* `v0.1.2` Default AJAX request for counts to false, added zip download, better documentation for counts service.
* `v0.1.3` Added code to normalize service url directory (easier configuration).
* `v0.1.4` Fix for twitter widget share of non-current page URL. Added data-share-text.
* `v0.1.5` Option for activate on click, instead of hover. i18n Code, adds de_DE support. Fix for Google+ issue with disappearing tooltip.


## TODO
- Testing
- More testing
- Vk.com pageTitle, odnoklassniki title
- Is _isGradeA function needed?
- Better fallback
- Locale support
- Replace ul > li with div > a?


## License
Copyright (c) 2012 Filament Group, developed by @zachleat. MIT licensed.     
Refactored by @scarfacedeb, 2013. MIT licensed.