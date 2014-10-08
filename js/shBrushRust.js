(function() {
  // CommonJS
  typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

  function Brush() {
    var keywords =
      'as box break continue crate else enum extern false fn for if impl ' +
      'in let loop match mod mut priv proc pub ref return self static ' +
      'struct super trait true type unsafe use while';

    this.regexList = [
      { regex: SyntaxHighlighter.regexLib.singleLineCComments, css: 'comments' },
      { regex: SyntaxHighlighter.regexLib.multiLineCComments, css: 'comments' },
      { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string' },
      { regex: /#!?\[.*\]/gm, css: 'color1' },
      { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' }
    ];
  }

  Brush.prototype = new SyntaxHighlighter.Highlighter();
  Brush.aliases = ['rust'];

  SyntaxHighlighter.brushes.Rust = Brush;

  // CommonJS
  typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
