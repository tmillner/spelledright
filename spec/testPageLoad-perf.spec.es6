import webdriver from 'selenium-webdriver';
import {app} from './helpers/app.js';
import SpelledRight from '../spelledright.js';

const baseUrl = `http://localhost:${app.PORT}`;

describe('test pages', () => {
  let loader = (URL, MARKER, done) => {
    let driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.get(URL).then(() => {
      return driver.executeScript(`
        return document.getElementsByTagName('body')[0];
      `);
    }).then(node => {
      return node.getInnerHtml();
    }).then(inner => {
      console.time(MARKER);
      let spelledright = new SpelledRight(inner);
      console.log('Misspellings are: ' +
        JSON.stringify(spelledright.getMisspellings()));
      console.timeEnd(MARKER);
      return driver.quit();
    }).then(() => {
      done();
    });
  };

  it('Will send off benchmark load time data for simple page', done => {
    const URL = `${baseUrl}/no-typos-page.html`;
    loader(URL, "SIMPLE_PAGE_BENCHMARK", done);
  });

  it('Will send off benchmark load time data for detailed page', done => {
    const URL = `${baseUrl}/live-github-page.html`;
    loader(URL, "DETAILED_PAGE_BENCHMARK", done);
  }, 20000);
});
