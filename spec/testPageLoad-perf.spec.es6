import webdriver from 'selenium-webdriver';
// import {until} from 'selenium-webdriver';
import {app} from './helpers/app.js';
// import SpelledRight from '../spelledright.js';

const baseUrl = `http://localhost:${app.PORT}`;

describe('test pages', () => {
  beforeAll(() => {
  });

  afterAll(() => {
  });

  it('Will send off benchmark data for load times', done => {
    const URL = `${baseUrl}/no-typos-page.html`;

    let driver = new webdriver.Builder().forBrowser('firefox').build();
    // driver.manage().timeouts().setScriptTimeout(5000);
    driver.get(URL).then(() => {
      console.log('done getting url');
      return driver.getTitle();
    }).then(t => {
      console.log('title is ' + t);
      /* If the below works also try with a passed in element  */
      return driver.executeScript(`
        return new Promise(function(resolve, reject) {
          try{
            var imported = document.createElement('script');
            imported.src = '../../dist/spelledright.js';
            document.head.appendChild(imported);
            resolve();
          } catch(e) {
            console.log('Nope :(');
            reject();
          }
        });
        `);
    }).then(v => {
      console.log('value is ' + v);
      return driver.executeScript(`
        var spelledright = new window.SpelledRight(document.body);
        var misspellings = spelledright.getMisspellings();;
        return misspellings.count;
      `);
    }).then(m => {
      return driver.wait(() => {
        console.log('m is ' + m);
        return m !== undefined && m !== null;
      }, 2000);
    }).then(misspellings => {
      console.log('Found the misspellings: ' + misspellings);
      console.log('Ok so now I\'m going to quit');
      return driver.quit();
    }).then(() => {
      done();
    });
  });
});
