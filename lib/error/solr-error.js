/**
 * Module dependencies
 */

var HTTPError = require('httperror'),
   util = require('util');

/**
 * Expose `SolrError`
 */

module.exports = SolrError;

/**
 * Create a new `SolrError`
 * @constructor
 *
 * @return {SolrError}
 * @api private
 */

function SolrError(req,res,htmlMessage){
   let solrMessage = '';
   if(htmlMessage){
       try {
           // maybe it's a JSON?
           let objectMessage = JSON.parse(htmlMessage);
           solrMessage = objectMessage.error.msg;
       } catch (e) {
           // so it's not a JSON :(
           let matches = htmlMessage.match(/<pre>([\s\S]+)<\/pre>/);
           solrMessage = decode((matches || ['', htmlMessage])[1].trim());
       }
   }
   HTTPError.call(this, req, res, solrMessage);
   Error.captureStackTrace(this,arguments.callee);
   this.statusCode = res.statusCode;
   this.message = `[${res.statusMessage}] ${solrMessage}`;
   this.name = 'SolrError';
}

util.inherits(SolrError, HTTPError);

/**
 * Decode few HTML entities: &<>'"
 *
 * @param {String} str -
 *
 * @return {String}
 * @api private
 */
function decode(str) {
  return str.replace(/&amp;/g,'&')
            .replace(/&lt;/gm, '<')
            .replace(/&gt;/gm, '>')
            .replace(/&apos;/gm, '\'')
            .replace(/&quot;/gm, '"');
};
