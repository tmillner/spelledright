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
    const URL = `${baseUrl}/no-typos-page.html`;

    request.get(URL, (e, res, body) => {
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

  it('will load a simple page, with default options, ' +
      'with no whitelisted misspellings', done => {
    const URL = `${baseUrl}/no-typos-page.html`;

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc);
      let misspellings = spelledright.getMisspellings();

      expect(misspellings.count).toEqual(5);
      expect(misspellings.Sa).toEqual(1);
      expect(misspellings.philE).toEqual(1);

      done();
    });
  });

  it('will load a simple page, with options, ' +
      'with no whitelisted misspellings', done => {
    const URL = `${baseUrl}/no-typos-page.html`;

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc, {
        ignoreCase: true,
        ignoreComments: false,
        whitelist: []
      });
      let misspellings = spelledright.getMisspellings();

      expect(misspellings.count).toEqual(9);
      expect(misspellings.sa).toEqual(1);
      expect(misspellings.phile).toEqual(1);
      expect(misspellings.mispelllling).toEqual(1);

      done();
    });
  });

  it('will load a complex page with, with basic initial whitelist, ' +
      ' and all whitelisted misspellings', done => {
    const URL = `${baseUrl}/live-github-page.html`;
    const INITIAL_WHITELIST = ["Unwatch", "Unstar", "cfinke", 'Typo.js',
        "Wiki", "JavaScript", "spellchecker", 'Hunspell-style', "CSS",
        "SVN", "passphrase", "GitHub", "URLs", "Permalink", 'NodeJS',
        'testcases', 'Node.js', 'README.md', 'license.txt', "HTTPS",
        'manifest.json', 'typo.js', 'node.js', 'typo-js', "mispelled",
        "Hunspell", "PFX", "SFX", "COMPOUNDMIN", "COMPOUNDRULE",
        "ONLYINCOMPOUND", "KEEPCASE", "NOSUGGEST", "NEEDAFFIX", "API", "Blog",
        'http://www.chrisfinke.com/files/typo-demo',
        'examples/node/index.js'];

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      // http://www.w3school.com.cn/xmldom/dom_document.asp
      var spelledright = new SpelledRight(doc.getElementById('main-content'), {
        ignoreCase: false,
        ignoreComments: true,
        whitelist: INITIAL_WHITELIST
      });
      let misspellings = spelledright.getMisspellings();
      console.log(misspellings);
      expect(misspellings.count).toEqual(1);
      expect(misspellings.mispeling).toEqual(1);

      done();
    });
  });

  it('will load a complex page with, with initial regex whitelist, ' +
      ' and all whitelisted misspellings', done => {
    const URL = `${baseUrl}/live-github-page.html`;
    const INITIAL_WHITELIST = ["Unwatch", "Unstar", "cfinke", "Hunspell",
        "Blog", "Wiki", "JavaScript", "spellchecker", 'Hunspell-style',
        "passphrase", "GitHub", "URLs", "Permalink", "mispelled", 'typo-js',
        'NodeJS', 'testcases',
        /^[A-Z]+$/ /* All caps letters */,
        /\.[a-zA-Z]{2,}$/ /* Anything with a file extension */,
        /^[a-zA-Z]{3,}:.*/ /* Any protocol followed by colon */
        ];

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc.getElementById('main-content'), {
        ignoreCase: false,
        ignoreComments: true,
        whitelist: INITIAL_WHITELIST
      });
      let misspellings = spelledright.getMisspellings();
      console.log(misspellings);
      expect(misspellings.count).toEqual(1);
      expect(misspellings.mispeling).toEqual(1);

      done();
    });
  });

  it('will load a complex page with, with extended whitelist, ' +
      ' and all whitelisted misspellings', done => {
    const URL = `${baseUrl}/live-github-page.html`;
    const INITIAL_WHITELIST = ["Unwatch", "Unstar", "cfinke", 'Typo.js',
        "Wiki", "JavaScript", "spellchecker", 'Hunspell-style', "CSS",
        "SVN", "passphrase", "GitHub", "URLs", "Permalink", 'NodeJS',
        'testcases', 'Node.js', 'README.md', 'license.txt', "HTTPS"];
    const EXTENDED_WHITELIST = ['manifest.json', 'typo.js', 'node.js',
        'typo-js', "mispelled", "Hunspell", "PFX", "KEEPCASE",
        "SFX", "COMPOUNDMIN", "COMPOUNDRULE", "ONLYINCOMPOUND",
        "NOSUGGEST", "NEEDAFFIX", "API", "Blog", 'examples/node/index.js',
        'http://www.chrisfinke.com/files/typo-demo'];

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      var spelledright = new SpelledRight(doc.getElementById('main-content'), {
        ignoreCase: false,
        ignoreComments: true,
        whitelist: INITIAL_WHITELIST
      });
      spelledright.extendWhitelist(EXTENDED_WHITELIST);
      let misspellings = spelledright.getMisspellings();
      expect(misspellings.count).toEqual(1);
      expect(misspellings.mispeling).toEqual(1);

      done();
    });
  });
});
