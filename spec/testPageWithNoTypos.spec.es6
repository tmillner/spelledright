const request = require('request');
import {app} from './helpers/app.js';
const baseUrl = `http://localhost:${app.PORT}`;

describe('test page with no typos', () => {
	beforeAll(() => {
	});

	afterAll(() => {
	});

	it('will load a page with no typos', (done) => {
		const url = `${baseUrl}/no-typos-page.html`;

		request.get(url, (e, res, body) => {
			console.log(body);
			expect(res.statusCode).toBe(200);
			// NOT IMPLEMTED
			let misspellings = spelledright.getMisspellingsCount(
				body /* target starting DOM node */,
				{
					'ignoreAllCaps' : true,
					'whitelist' : [ /regex/ ]
				} /* options config */
			);
			expect(misspellings).toEqual(0);
			done();
		});
	});

	it('will load a page with typos', (done) => {
		done();
	});
});
