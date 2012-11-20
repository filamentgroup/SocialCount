<?php
require('../src/service/SocialCount.php');

// TODO mock service calls
class SocialCount_Service_Test extends PHPUnit_Framework_TestCase
{
	const TEST_URL = 'http://www.google.com/';

	public function testTwitter()
	{
		$twitter = new Twitter();
		$this->assertEquals('twitter', $twitter->getKey());
		$this->assertNotNull($twitter->getShareCount(self::TEST_URL));
	}

	public function testFacebook()
	{
		$facebook = new Facebook();
		$this->assertEquals('facebook', $facebook->getKey());
		$this->assertNotNull($facebook->getShareCount(self::TEST_URL));
	}

	public function testGooglePlus()
	{
		$gplus = new GooglePlus();
		$this->assertEquals('googleplus', $gplus->getKey());
		$this->assertNotNull($gplus->getShareCount(self::TEST_URL));
	}

	public function testShareThis()
	{
		$sharethis = new ShareThis();
		$this->assertEquals('sharethis', $sharethis->getKey());
		$this->assertNotNull($sharethis->getShareCount(self::TEST_URL));
	}

	public function testSocialCountNoNetworksValidJson()
	{
		$social = new SocialCount(self::TEST_URL);

		$json = $social->toJSON();
		$this->assertNotNull($json);
		$this->assertEquals("{}", $json);
	}

	public function testSocialCountValidJson()
	{
		$social = new SocialCount(self::TEST_URL);
		$social->addNetwork(new Twitter());
		$social->addNetwork(new Facebook());
		$social->addNetwork(new GooglePlus());
		$social->addNetwork(new ShareThis());

		$json = $social->toJSON();
		$this->assertNotNull($json);
		$this->assertNotEquals("{}", $json);
	}
}