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

  it('will load a library with main usable methods', done => {
    const url = `${baseUrl}/no-typos-page.html`;

    request.get(url, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc);

      expect(typeof spelledright.getSentences).toBe('function');
      expect(typeof spelledright.getMisspellings).toBe('function');
      expect(typeof spelledright.init).toBe('function');
      expect(typeof spelledright.options).toBe('object');

      done();
    });
  });

  it('will load a page with a couple of typos', done => {
    const url = `${baseUrl}/no-typos-page.html`;

    request.get(url, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc);
      let misspellings = spelledright.getMisspellings();

      expect(misspellings.length).toEqual(5);
      expect(misspellings).toContain('Sa');
      expect(misspellings).toContain('philE');

      done();
    });
  });

  it('will load a page with typos', done => {
    done();
  });
});
