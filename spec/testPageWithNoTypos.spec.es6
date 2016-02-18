import 'webdriverio';

describe('test page with no typos', () => {

	beforeAll(() => {
		let options = { desiredCapabilities: { browserName: 'firefox' } };
		var client = webdriverio.remote(options);
	});

	afterAll(() => {
		client.end();
	});


	it('will load a page with no typos', () => {
		client
			.init()
			.url('http://www.github.com/');
	});
});
