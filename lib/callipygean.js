/*jshint nomen:false, browser: true, white: false, regexp:false, bitwise:false */
/*global exports*/

/*!
 * callipygean
 * https://github.com/Couto/callipygean
 *
 * Copyright (c) 2012 Couto
 * Licensed under the MIT license.
 * http://couto.mit-license.org
 */

(function (exports) {
    'use strict';

    //#include "utils.js";

    var syntax = {
        PrismJS : //#include "syntax/prism.json";,
        Prettify: //#include "syntax/prettify.json";
    };

    //#include "collapsable.js";

    /**
     * Callipygean
     *
     * @constructor
     */
    function Callipygean(options) {
        this.syntax = syntax[options.syntax];
        this.collapsed = options.collapsed || false;
        this.collapsableCollection = [];

        if (!_.is.object(this.syntax)) {
            throw new Error('Please pick a valid syntax. Possible values are: ' + Object.keys(syntax).join(', '));
        }
    }

    Callipygean.prototype = {

        constructor: Callipygean,

        /**
         * Converts an object to a HTML node with all necessary
         * events already binded.
         *
         * If a function is given as a callback, this method is going to
         * be asyncronous, passing the resulting DOM element as the first
         * argument
         *
         * @method
         * @public
         *
         * @param    {Object}    obj  JSON Object
         * @param    {Function}  [cb] function to be called as callback
         * @return   {Element}        DOM element
        */
        convert: function (obj, cb) {
            obj = (_.is.string(obj)) ? JSON.parse(obj) : obj;

            var ul = _.$$('ul', { 'class' : 'callipygean' }),
                counter = _.keys(obj).length,
                async = (cb && _.is.fun(cb)) ? true : false,
                child;

            _.forOwn(obj, function (key, val) {
                counter -= 1;
                child = _.$$('li');

                child.appendChild(this.buildKey(key));

                if (_.is.object(val)) {
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '{'
                    }));
                    child.appendChild(this.buildObject(val));
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '}'
                    }));
                    child.setAttribute('class', 'expandable object');
                    this.collapsableCollection.push(new Collapsable(child));
                } else if (_.is.array(val)) {
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '['
                    }));
                    child.appendChild(this.buildArray(val));
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : ']'
                    }));
                    child.setAttribute('class', 'expandable array');
                    this.collapsableCollection.push(new Collapsable(child));
                } else { child.appendChild(this.buildStandard(val)); }

                if (counter) {
                    child.appendChild(_.$$('span', {
                        'class': this.syntax.tokenClass + ' ' + this.syntax.punctuation, html: ','
                    }));
                }

                ul.appendChild(child);

                if (async && counter === 0) { cb(ul); }

            }, this, async);

            return (async) ? this : ul;
        },

        buildObject: function (obj) {
            var ul = _.$$('ul', {'class': 'object'}),
                counter = _.keys(obj).length,
                child,
                keyEl;

            _.forOwn(obj, function (key, val) {
                counter -= 1;

                child = _.$$('li');
                keyEl = this.buildKey(key);
                child.appendChild(keyEl);

                if (_.is.array(val)) {
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '['
                    }));
                    child.appendChild(this.buildArray(val));
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : ']'
                    }));
                    child.setAttribute('class', 'expandable array');
                    this.collapsableCollection.push(new Collapsable(child));

                } else if (_.is.object(val)) {

                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '{'
                    }));
                    child.appendChild(this.buildObject(val));
                    child.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '{'
                    }));
                    child.setAttribute('class', 'expandable object');
                    this.collapsableCollection.push(child);

                } else { child.appendChild(this.buildStandard(val)); }

                if (counter) {
                    child.appendChild(_.$$('span', {
                        'class': this.syntax.tokenClass + ' ' + this.syntax.punctuation, html: ','
                    }));
                }

                ul.appendChild(child);


            }, this);

            return ul;
        },

        buildArray: function (arr) {
            var ul = _.$$('ul', {'class': 'array'}),
                li,
                counter = arr.length;

            _.forEach(arr, function (val) {
                counter -= 1;

                li = _.$$('li');
                if (_.is.object(val)) {
                    li.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '{'
                    }));
                    li.appendChild(this.buildObject(val));
                    li.appendChild(_.$$('span', {
                        'class' : this.syntax.tokenClass + ' ' + this.syntax.punctuation,
                        'html' : '}'
                    }));
                    li.setAttribute('class', 'expandable object');
                } else if (_.is.array(val)) { li = this.buildArray(val); }
                else { li = this.buildStandard(val, 'li'); }

                if (counter) {
                    li.appendChild(_.$$('span', {'class': this.syntax.tokenClass + ' ' + this.syntax.punctuation, html: ','}));
                }


                ul.appendChild(li);
                this.collapsableCollection.push(new Collapsable(li));
            }, this);


            return ul;
        },

        buildKey: function (key) {
            return _.$$('span', {
                'class' : 'key ' + this.syntax.tokenClass + ' ' + this.syntax.string,
                'html' : '"' + key + '":'
            });
        },

        buildStandard: function (data, el) {
            var type = this.type(data);

            return _.$$(el || 'span', {
                'class': this.syntax.tokenClass + ' value ' + (this.syntax[type] || type),
                'html' : (type === 'string') ? ('"' + data + '"') : data
            });
        },

        /**
         * Converts an object to a DOM Element in an asynchronous way
         *
         * @method
         * @public
         *
         * @param    {Object}   obj JSON Object
         * @param    {Function} cb  function to be called as a callback
         * @return   {Element}      DOM Element
         */
        convertAsync: function (obj, cb) {

        },

        type: function (val) {
            var type = (typeof val);

            if (type === 'object') {

                if (_.is.array(val)) {
                    return 'array';
                }

                if (_.is.regex(val)) {
                    return 'regex';
                }
            }

            if (type === 'string') {
                if (_.is.regexStr(val)) {
                    return 'regex';
                }
            }

            return type;
        },

        dealloc: function () {
            var i = this.collapsableCollection.length - 1;
            for (i; i >= 0; i -= 1) {
                this.collapsableCollection[i].dealloc();
            }
        }


    };

    /**
     * [callipygean description]
     *
     * @function
     * @public
     *
     * @param   {Object} options A set of options to adapt the instance
     * @example
     *
     *      var collapsed = ({
     *          syntax: 'PrismJS',
     *          collapsed: true,
     *      });
     *
     *      var htmlNode = collapsed.convert({
     *          "string": "hi",
     *          "array" : ["1", "2", "3"],
     *          "object": {
     *              "item1" : "somewhere",
     *              "item2" : "over the",
     *              "item3" : "rainbow"
     *          }
     *      }, function (el) {});
     *
     * @return   {Object}   Returns a ready to use Callipygean instance
     */
    exports.callipygean = function (options) {
        return new Callipygean(options);
    };

}(typeof exports === 'object' && exports || this));
