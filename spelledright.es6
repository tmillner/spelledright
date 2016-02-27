import Typo from 'typo-js';
import 'xmldom';

export default class SpelledRight {
	// TODO: Accept string and a real XML node
	constructor(node, options) {
		const DICTS = {'en_US' : 'en_US'};

		this.sentences = [];
		this.words = [];
		this.dict = new Typo(DICTS.en_US);
		this.mispellings = [];
		this.options = options || {
			'ignoreAllCaps' : true,
			'ignoreComments' : true,
			'whitelist' : [ /* /regex/ */ ]
		};

		this.extendWhitelist = this.extendWhitelist.bind(this);
		this.init = this.init.bind(this);
		this.getMisspellings = this.getMisspellings.bind(this);
		this.getSentences = this.getSentences.bind(this);
		this._storeText = this._storeText.bind(this);
		this._parseDom = this._parseDom.bind(this);

		/* Initialize the library at body node */
		this.init(node, options);
	};

	extendWhitelist([...args]) {
		this.options.whitelist.push(...args);
	};

	init(startNode, options) {
		this.startNode = startNode;
		this.options = options;
	};

	getMisspellings() {
		let sentences = this.getSentences();
		for (let i in sentences) 
		{	
			let sentence = sentences[i];
			let words = [...sentence.split(/\s+/)];
			for (let j in words) 
			{
				let word = words[j];
				/* TODO Don't read numbers or characters */
				/* TODO Don't mark whitelist items */
				this.words.push(word);
				let is_word_okay = this.dict.check(word);
				console.log(`The word '${word} is okay? ${is_word_okay}`);
			};
		};
		return this.words;
	};

	getSentences() {
		this._parseDom(this.startNode, this._storeText);
		return this.sentences;
	};

	_storeText(node) {
		let text = node.nodeValue ? node.nodeValue.trim() : "";
		if (text && (node.nodeName !== "SCRIPT") && (node.nodeName !== "STYLE")) {
			this.sentences.push(text.toString());
		};
	};

	_parseDom(targetNode, func) {
		func(targetNode);
		targetNode = targetNode.firstChild;

		while(targetNode) {
			this._parseDom(targetNode, func);
			targetNode = targetNode.nextSibling;
		};
	};
};
