'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typoJs = require('typo-js');

var _typoJs2 = _interopRequireDefault(_typoJs);

require('xmldom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint guard-for-in: "off" */

var SpelledRight = function () {
  // TODO: Accept string and a real XML node

  function SpelledRight(node, options) {
    _classCallCheck(this, SpelledRight);

    var DICTS = { en_US: 'en_US' }; // eslint-disable-line

    this.sentences = [];
    this.words = [];
    this.dict = new _typoJs2.default(DICTS.en_US);
    this.mispellings = [];
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

  _createClass(SpelledRight, [{
    key: 'extendWhitelist',
    value: function extendWhitelist(_ref) {
      var _options$whitelist;

      var _ref2 = _toArray(_ref);

      var args = _ref2;

      (_options$whitelist = this.options.whitelist).push.apply(_options$whitelist, _toConsumableArray(args));
    }
  }, {
    key: 'init',
    value: function init(startNode, options) {
      this.startNode = startNode;
      this.options = options;
    }
  }, {
    key: 'getMisspellings',
    value: function getMisspellings() {
      var sentences = this.getSentences();
      for (var i in sentences) {
        // Remove non letter gunk
        var sentence = sentences[i].replace(/[^a-zA-Z0-9\s]+/g, '');

        console.log('the sentence is ' + sentence);
        var words = [].concat(_toConsumableArray(sentence.split(/\s+/)));
        for (var j in words) {
          var word = words[j];
          var isWordCorrect = this.dict.check(word);
          /* Pre-check to see if need to do whitelist */
          if (isWordCorrect) {
            continue;
          }
          // If the word has a # in it (ex username), skip
          if (word.search(/[0-9]/g) !== -1 || this._isWhitelisted(word)) {
            continue;
          }

          this.mispellings.push(word);
          console.log('The word \'' + word + '\' is NOT okay');
        }
      }
      return this.mispellings;
    }
  }, {
    key: 'getSentences',
    value: function getSentences() {
      this._parseDom(this.startNode, this._storeText);
      return this.sentences;
    }
  }, {
    key: '_isWhitelisted',
    value: function _isWhitelisted(word) {
      var isWhitelisted = false;
      var whitelist = this.options.whitelist;
      for (var i in whitelist) {
        if (word.search(whitelist[i])) {
          isWhitelisted = true;
          break;
        }
      }
      return isWhitelisted;
    }
  }, {
    key: '_storeText',
    value: function _storeText(node) {
      var text = node.nodeValue ? node.nodeValue.trim() : "";
      if (text && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
        this.sentences.push(text.toString());
      }
    }
  }, {
    key: '_parseDom',
    value: function _parseDom(targetNode, func) {
      func(targetNode);
      targetNode = targetNode.firstChild;

      while (targetNode) {
        this._parseDom(targetNode, func);
        targetNode = targetNode.nextSibling;
      }
    }
  }]);

  return SpelledRight;
}();

exports.default = SpelledRight;
