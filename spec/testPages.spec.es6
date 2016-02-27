import * as request from 'request';
import {app} from './helpers/app.js';
import SpelledRight from '../spelledright.js';
import {DOMParser} from 'xmldom';

const baseUrl = `http://localhost:${app.PORT}`;

describe('test pages', () => {
	beforeAll(() => {
	});

	afterAll(() => {
	});

	it('will load a library with all usable methods', (done) => {
		const url = `${baseUrl}/no-typos-page.html`;

		request.get(url, (e, res, body) => {
			expect(res.statusCode).toBe(200);

			let doc = new DOMParser().parseFromString(body, 'text/xml');
			var spelledright = new SpelledRight(doc);

			expect(typeof spelledright.getSentences).toBe('function');
			expect(typeof spelledright.init).toBe('function');
			//expect(typeof spelledright.options).toBe('function');

			done();
		});
	});

	it('will load a page with no typos', (done) => {
		const url = `${baseUrl}/no-typos-page.html`;

		request.get(url, (e, res, body) => {
			expect(res.statusCode).toBe(200);

			let doc = new DOMParser().parseFromString(body, 'text/xml');
			var spelledright = new SpelledRight(doc);

			let misspellings = spelledright.getMisspellings();
			console.log(`misspellings are ${misspellings}`);
			expect(misspellings).toEqual(0);

			done();
		});
	});

	it('will load a page with typos', (done) => {
		done();
	});
});
