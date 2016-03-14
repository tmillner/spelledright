import Typo from 'typo-js';
import 'xmldom';

/* eslint guard-for-in: "off" */
export default class SpelledRight {
  /* TODO:
  * - Accept string and a real XML node?
  * - Handle case sensitivity in whitelist
  * - Return misspelings as a map with count occurences
  * - Add toggle to check -, ., :, /, delimited words?
  */
  constructor(node, options) {
    const DICTS = {en_US : 'en_US'}; // eslint-disable-line

    this.sentences = [];
    this.words = [];
    this.dict = new Typo(DICTS.en_US);
    this.mispellings = {count: 0};
    this.options = options || {
      ignoreAllCaps: true,
      ignoreComments: true,
      whitelist: [/* /regex/ */]
    };

    this.extendWhitelist = this.extendWhitelist.bind(this);
    this.init = this.init.bind(this);
    this.getMisspellings = this.getMisspellings.bind(this);
    this.getSentences = this.getSentences.bind(this);
    this._storeText = this._storeText.bind(this);
    this._parseDom = this._parseDom.bind(this);
    this._isWhitelisted = this._isWhitelisted.bind(this);

    /* Initialize the library at body node */
    this.init(node, this.options);
  }

  extendWhitelist([...args]) {
    this.options.whitelist.push(...args);
  }

  init(startNode, options) {
    this.startNode = startNode;
    this.options = options;
  }

  getMisspellings() {
    let sentences = this.getSentences();
    for (let i in sentences) {
      // Remove non letter gunk
      let sentence = sentences[i].replace(/[^a-zA-Z0-9\s]+/g, '');

      console.log(`the sentence is ${sentence}`);
      let words = [...sentence.split(/\s+/)];
      for (let j in words) {
        let word = words[j];
        let isWordCorrect = this.dict.check(word);
        /* Pre-check to see if need to do whitelist */
        if (isWordCorrect) {
          continue;
        }
        // If the word has a # in it (ex username), skip
        if (word.search(/[0-9]/g) !== -1 ||
          this._isWhitelisted(word)) {
          continue;
        }

        this.mispellings[word] = this.mispellings[word] ?
           this.mispellings[word] + 1 : 1;
        console.log(`The word '${word}' is NOT okay`);
        this.mispellings.count++;
      }
    }
    return this.mispellings;
  }

  getSentences() {
    this._parseDom(this.startNode, this._storeText);
    return this.sentences;
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

  _storeText(node) {
    let text = node.nodeValue ? node.nodeValue.trim() : "";
    if (text && (node.nodeName !== "SCRIPT") && (node.nodeName !== "STYLE")) {
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
