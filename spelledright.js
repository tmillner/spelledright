'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typoJs = require('typo-js');

var _typoJs2 = _interopRequireDefault(_typoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint guard-for-in: "off" */
module.exports = function () {
  function SpelledRight(node, options) {
    _classCallCheck(this, SpelledRight);

    var DICTS = { en_US: 'en_US' }; // eslint-disable-line
    this.NONALPHANUMERIC = /[^a-zA-Z0-9'\s]+/g; /* but keep single quote */

    this.sentences = [];
    this.words = [];
    this.dict = new _typoJs2.default(DICTS.en_US);
    this.mispellings = { count: 0 };
    this.options = options || {
      ignoreCase: false,
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
    this._isSubwordsValid = this._isSubwordsValid.bind(this);

    /* Initialize the library at target node */
    this.init(node, this.options);
  }

  _createClass(SpelledRight, [{
    key: 'init',
    value: function init(startNode, options) {
      this.startNode = startNode;
      this.options = options;
    }
  }, {
    key: 'extendWhitelist',
    value: function extendWhitelist(_ref) {
      var _options$whitelist;

      var _ref2 = _toArray(_ref);

      var args = _ref2;

      (_options$whitelist = this.options.whitelist).push.apply(_options$whitelist, _toConsumableArray(args));
    }
  }, {
    key: 'getMisspellings',
    value: function getMisspellings() {
      var sentences = this.getSentences();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sentences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sentence = _step.value;

          console.log('the sentence is ' + sentence);
          var words = [].concat(_toConsumableArray(sentence.split(/\s+/)));

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = words[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var word = _step2.value;

              var isWordCorrect = this.dict.check(word);
              /* Pre-check to see if need to do whitelist */
              if (isWordCorrect) {
                continue;
              }

              /* If the word ends with puncutation, get rid of it */
              if (word.slice(-1).search(this.NONALPHANUMERIC) === 0) {
                word = word.slice(0, -1);
              }

              /* If the word has a # in it (ex. username), skip */
              if (word.search(/[0-9]/g) !== -1 || this._isSubwordsValid(word) || this._isWhitelisted(word)) {
                continue;
              }

              this.mispellings[word] = this.mispellings[word] ? this.mispellings[word] + 1 : 1;
              console.log('The word \'' + word + '\' is NOT okay');
              this.mispellings.count++;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this.mispellings;
    }
  }, {
    key: '_isWhitelisted',
    value: function _isWhitelisted(word) {
      var isWhitelisted = false;
      var whitelist = this.options.whitelist;
      for (var i in whitelist) {
        if (word.search(whitelist[i]) !== -1) {
          isWhitelisted = true;
          break;
        }
      }
      return isWhitelisted;
    }
  }, {
    key: '_isSubwordsValid',
    value: function _isSubwordsValid(word) {
      var isSubwordValid = true;
      var sanitizedWordArray = word.split(this.NONALPHANUMERIC);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sanitizedWordArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var subWord = _step3.value;

          if (!subWord) {
            continue;
          }
          if (!this.dict.check(subWord)) {
            isSubwordValid = false;
            break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return isSubwordValid;
    }
  }, {
    key: 'getSentences',
    value: function getSentences() {
      this._parseDom(this.startNode, this._storeText);
      return this.sentences;
    }
  }, {
    key: '_storeText',
    value: function _storeText(node) {
      var text = node.nodeValue ? node.nodeValue.trim() : "";
      if (text && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
        if (this.options.ignoreComments && node.nodeType === 8) {
          return;
        }
        if (this.options.ignoreCase) {
          text = text.toLowerCase();
        }
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
