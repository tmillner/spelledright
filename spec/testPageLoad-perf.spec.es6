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
    driver.get(URL).then(() => {
      console.log('done getting url');
      return driver.getTitle();
    }).then(t => {
      console.log('title is ' + t);
      /* If the below works also try with a passed in element  */
      return driver.executeScript(`
        (function(callback) {
          var imported = document.createElement('script');
          imported.src = 'https://code.jquery.com/jquery-2.2.1.min.js';
          imported.integrity = "sha256-gvQgAFzTH6trSrAWoH1iPo9Xc96QxSZ3feW6kem+O00="
          imported.crossorigin = "anonymous";
          document.head.appendChild(imported);
          imported.onload = imported.onreadystatechange = (function() {
            if (this.readyState == 'loaded' || this.readyState == 'complete') {
                callback();
            }
          });
          callback();
        })(function() {
          $.getScript('../spelledright.js', function() {
            console.log("I'm inside!");
            var spelledright = new SpelledRight(document.body);
            var misspellings = spelledright.getMisspellings();
            console.log(misspellings);
            return misspellings;
          })
        });
      `);
    }).then(misspellings => {
      console.log('Found the misspellings: ' + misspellings);
      console.log('Ok so now I\'m going to quit');
      return driver.quit();
    }).then(() => {
      done();
    });
  });
});
