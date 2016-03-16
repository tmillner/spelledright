import Typo from 'typo-js';
import {DOMParser} from 'xmldom';

/* eslint guard-for-in: "off" */
export default class SpelledRight {
  constructor(node, options) {
    const DICTS = {en_US : 'en_US'}; // eslint-disable-line
    this.NONALPHANUMERIC = /[^a-zA-Z0-9'\s]+/g; /* but keep single quote */

    this.sentences = [];
    this.words = [];
    this.dict = new Typo(DICTS.en_US);
    this.mispellings = {count: 0};

    this.extendWhitelist = this.extendWhitelist.bind(this);
    this.init = this.init.bind(this);
    this.getMisspellings = this.getMisspellings.bind(this);
    this.getSentences = this.getSentences.bind(this);
    this._storeText = this._storeText.bind(this);
    this._parseDom = this._parseDom.bind(this);
    this._isWhitelisted = this._isWhitelisted.bind(this);
    this._isSubwordsValid = this._isSubwordsValid.bind(this);

    /* Initialize the library at target node */
    this.init(node, options);
  }

  init(startNode, options) {
    if (typeof startNode === 'string') {
      startNode = new DOMParser().parseFromString(startNode, 'text/xml');
    }
    this.startNode = startNode;
    this.options = options || {
      ignoreCase: false,
      ignoreComments: true,
      whitelist: [/* /regex/ */]
    };
  }

  extendWhitelist([...args]) {
    this.options.whitelist.push(...args);
  }

  getMisspellings() {
    let sentences = this.getSentences();
    for (let sentence of sentences) {
      let words = [...sentence.split(/\s+/)];

      for (let word of words) {
        let isWordCorrect = this.dict.check(word);
        /* Pre-check to see if need to do whitelist */
        if (isWordCorrect) {
          continue;
        }

        /* If the word ends with puncutation, get rid of it */
        if (word.slice(-1).search(this.NONALPHANUMERIC) === 0) {
          word = word.slice(0, -1);
        }

        /* If the word has a # in it (ex. username), skip */
        if (word.search(/[0-9]/g) !== -1 ||
          this._isSubwordsValid(word) ||
          this._isWhitelisted(word)) {
          continue;
        }

        this.mispellings[word] = this.mispellings[word] ?
           this.mispellings[word] + 1 : 1;
        this.mispellings.count++;
      }
    }
    return this.mispellings;
  }

  _isWhitelisted(word) {
    let isWhitelisted = false;
    let whitelist = this.options.whitelist;
    for (let i in whitelist) {
      if (word.search(whitelist[i]) !== -1) {
        isWhitelisted = true;
        break;
      }
    }
    return isWhitelisted;
  }

  _isSubwordsValid(word) {
    let isSubwordValid = true;
    let sanitizedWordArray = word.split(this.NONALPHANUMERIC);
    for (let subWord of sanitizedWordArray) {
      if (!subWord) {
        continue;
      }
      if (!this.dict.check(subWord)) {
        isSubwordValid = false;
        break;
      }
    }
    return isSubwordValid;
  }

  getSentences() {
    this._parseDom(this.startNode, this._storeText);
    return this.sentences;
  }

  _storeText(node) {
    let text = node.nodeValue ? node.nodeValue.trim() : "";
    if (text && (node.nodeName !== "SCRIPT") && (node.nodeName !== "STYLE")) {
      if (this.options.ignoreComments && node.nodeType === 8) {
        return;
      }
      if (this.options.ignoreCase) {
        text = text.toLowerCase();
      }
      this.sentences.push(text.toString());
    }
  }

  _parseDom(targetNode, func) {
    func(targetNode);
    targetNode = targetNode.firstChild;

    while (targetNode) {
      this._parseDom(targetNode, func);
      targetNode = targetNode.nextSibling;
    }
  }
}
