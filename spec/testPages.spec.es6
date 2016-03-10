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

  it('will load a simple page, with no whitelisted misspellings', done => {
    const URL = `${baseUrl}/no-typos-page.html`;

    request.get(URL, (e, res, body) => {
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

  it('will load a complex page with all whitelisted misspellings', done => {
    const URL = `${baseUrl}/live-github-page.html`;
    const INITIAL_WHITELIST = ['textarea', 'Unwatch', 'Unstar', 'cfinke', 'Typojs',
        'Wiki', 'clientside', 'JavaScript', 'spellchecker', 'Hunspellstyle',
        'CSS', 'HTTPS', 'SVN', 'repositorys', 'passphrase',
        'GitHub', 'URLs', 'branchestags', 'Permalink', 'Exampledemo',
        'NodeJS', 'testcases', 'Nodejs', 'READMEmd', 'licensetxt',
        'manifestjson'];
    const EXTENDED_WHITELIST = ['manifestversion', 'typojs', 'enUS', 'nodejs',
        'typojs', 'isspelledcorrectly', 'mispelled', 'arrayofsuggestions',
        'Hunspell', 'PFX', 'SFX', 'COMPOUNDMIN', 'NEEDAFFIX',
        'COMPOUNDRULE', 'ONLYINCOMPOUND', 'KEEPCASE', 'NOSUGGEST',
        'doesnt', 'youre', 'httpwwwchrisfinkecomfilestypodemo',
         /* 3 bugs above need to make whitelist & checks, process equally */
        'examplesnodeindexjs', 'API', 'Blog', 'GitHub'];

    request.get(URL, (e, res, body) => {
      expect(res.statusCode).toBe(200);

      let doc = new DOMParser().parseFromString(body, 'text/xml');
      // http://www.w3school.com.cn/xmldom/dom_document.asp
      var spelledright = new SpelledRight(doc.getElementById('main-content'), {
        ignoreAllCaps: true,
        ignoreComments: true,
        whitelist: INITIAL_WHITELIST
      });
      spelledright.extendWhitelist(EXTENDED_WHITELIST);
      let misspellings = spelledright.getMisspellings();
      expect(misspellings.length).toEqual(1);
      expect(misspellings).toContain('mispeling');

      done();
    });
  });

  it('will load accroding to initiated options object', done => {
    done();
  });
});
