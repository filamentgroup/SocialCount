<?php
require_once('SocialCount.php');

if( !SocialCount::REQUIRE_LOCAL_URL || SocialCount::isLocalUrl( $_GET['url'] ) ) {

	try {
		$social = new SocialCount($_GET['url']);

		$social->addNetwork(new Twitter());
		$social->addNetwork(new Facebook());
		$social->addNetwork(new GooglePlus());
		// $social->addNetwork(new ShareThis());
		$social->addNetwork(new Pinterest());

		echo $social->toJSON();
	} catch(Exception $e) {
		echo '{"error": "' . $e->getMessage() . '"}';
	}
} else {
	echo '{"error": "URL not authorized (' . $_SERVER['HTTP_HOST'] . ')"}';
}
