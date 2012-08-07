/*jslint nomen:true, browser: true, white: true*/
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

    /**
 * _
 * Object to collect utility functions
 *
 * @type {Object}
 */
var _ = {

    /**
     * $
     * sugar syntax for document.querySelectorAll
     *
     * @memberOf _
     * @static
     *
     * @param    {String} selector CSS Selector
     * @return   {NodeList}
     */
    $: function (selector) {
        // I'm a lazy bum
        return document.querySelectorAll(selector);
    },
    /**
     * $$
     * Creates a DOM element witht the given attributes
     *
     * @memberOf _
     * @static
     *
     * @param    {String} el   Tag name
     * @param    {Object} attr Element attributes
     *
     * @return   {Element}     DOM Element
     */
    $$: function (el, attr) {
        var element = document.createElement(el),
            k;

        if (attr && attr.html) {
            element.innerHTML = attr.html;
            delete attr.html;
        }

        for (k in attr) {
            if (attr.hasOwnProperty(k)) {
                element.setAttribute(k, attr[k]);
            }
        }

        return element;
    },
    /**
     * bind
     *
     * @memberOf _
     * @static
     *
     * @param    {Function} fn      A function whose context is going to be bound
     * @param    {Object}   ctx     Object that will serve as context
     * @param    {Mixed}    [args*] Prearranged arguments
     * @return   {Funciton}         A Function bound to the given context with the pre-arranged arguments
     */
    bind: (function (bind) {
        var slice = Array.prototype.slice;

        return (bind && typeof bind === 'function') ?
                function (fn, ctx) {
                    var args = slice.call(arguments, 2);
                    return bind.apply(fn, [ctx].concat(args));
                } :
                function (fn, ctx) {
                    var args = slice.call(arguments, 2);
                    return function () {
                        fn.apply(ctx, args.concat(slice.call(arguments)));
                    };
                };

    }(Function.prototype.bind)),

    /**
     * _.is
     * collection of validators
     *
     * @memberOf _
     * @type {Object}
     */
    is: {
        /**
         * _toString calls the argument against Object.prototype.toString
         *
         * @method
         * @protected
         *
         * @param    {Mixed} data  value to be tested
         * @return   {String}      [description]
         */
        _toString: function (data) {
            return Object.prototype.toString.call(data);
        },
        /**
         * Tests if value is of type object
         *
         * @method
         * @static
         *
         * @param    {Mixed} obj value to be tested
         * @return   {Boolean}
         */
        object: function (obj) {
            return obj &&
                    this._toString(obj) === '[object Object]' &&
                    (!this.falsy(obj.isPrototypeOf));
        },
        /**
         * Tests if value is of type array
         *
         * @method
         * @static
         *
         * @param    {Mixed} arr value to be tested
         * @return   {Boolean}
         */
        array: function (arr) {
            return (this._toString(arr) === '[object Array]');
        },
        /**
         * Tests if value is of type string
         *
         * @method
         * @static
         *
         * @param    {Mixed} str value to be tested
         * @return   {Boolean}
         */
        string: function (str) {
            return (this._toString(str) === '[object String]');
        },
        /**
         * Tests if value is of type number
         *
         * @method
         * @static
         *
         * @param    {Mixed} num value to be tested
         * @return   {Boolean}
         */
        number: function (num) {
            return (this._toString(num) === '[object Number]');
        },
        /**
         * Tests if value is falsy (undefined, null, NaN, false)
         *
         * @method
         * @static
         *
         * @param    {Mixed} value value to be tested
         * @return   {Boolean}
         */
        falsy: function (value) {
            return (value === undefined || value === null || (this.number(value) && value !== +value) || !value);
        },

        /**
         * Tests if value is string is some sort of punctuation
         *
         * @method
         * @static
         *
         * @param    {Mixed}   str [description]
         * @return   {Boolean}     [description]
         */
        punctuation : function (str) {
            return (this.string(str) && (/[{}\[\];(),.:]/g).test(str));
        },
        /**
         * Tests if value is of type boolean
         *
         * @method
         * @static
         *
         * @param    {Mixed} bol value to be tested
         * @return   {Boolean}
         */
        boolean: function (bol) {
            return (bol === true || bol === false || this._toString(bol) === '[object Boolean]');
        },
        /**
         * Tests if value is of type regex
         *
         * @method
         * @static
         *
         * @param    {Mixed} reg value to be tested
         * @return   {Boolean}
         */
        regex: function (reg) {
            return (this._toString(reg) === '[object RegExp]');
        },

        /**
         * Tests if string represents a regex
         *
         * @method
         * @static
         *
         * @param    {String} str String to be tested
         * @return   {Boolean}
         */
        regexStr: function (str) {
            return (/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g).test(str);
        },
        /**
         * Tests if value is of type function
         *
         * @method
         * @static
         *
         * @param    {Mixed} fn value to be tested
         * @return   {Boolean}
         */
        fun: function (fn) {
            return (this._toString(fn) === '[object Function]');
        }
    }
}
,

        syntax = {
            PrismJS : {
    "tokenClass": "token",
    "comment": "comment",
    "string": "string",
    "regex": "regex",
    "keyword" : "keyword",
    "boolean" : "boolean",
    "number" : "number",
    "operator" : "operator",
    "ignore" : null,
    "punctuation" : "punctuation"
}
,
            Prettify: {
    "string" : "str",
    "keyword" : "kwd",
    "comment" : "com",
    "type" : "typ",
    "literal" : "lit",
    "punctuation" : "pun",
    "plain" : "pln",
    "tag" : "tag",
    "declaration" : "dec",
    "source" : "src",
    "attribute_name": "atn",
    "attribute_value": "atv",
    "nocode": "nocode"
}

        };

    /**
     * Callipygean
     *
     * @constructor
     */
    function Callipygean(options) {

        this.syntax = syntax[options.syntax];
        this.collapsed = options.collapsed || false;

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
            var ul, li, k,
                mainClass = this.syntax.tokenClass;

            // if there's a function in the arguments
            // then it should call the asynchronous version
            if (cb && _.is.fun(cb)) {
                return this.convertAsync(obj, cb);
            }

            ul = _.$$('ul', {
                'class' : mainClass + ' expandable object'
            });

            (function walk(obj, placeholder, context){
                var k, li, ulsec, type;

                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        li = _.$$('li');
                        type = context.type(obj[k]);

                        if (_.is.object(obj[k])) {

                            ulsec = _.$$('ul', {'class': mainClass + ' expandable object'});
                            walk(obj[k], ulsec, context);
                            li.appendChild(ulsec);

                        } else {

                            li.appendChild(_.$$('span', {
                                'html': k,
                                'class': mainClass + ' string attr'
                            }));

                            li.appendChild(_.$$('span', {
                                'html': obj[k],
                                'class': mainClass + ' ' + type
                            }));
                        }

                        placeholder.appendChild(li);
                    }
                }
            }(obj, ul, this));

            this.bindEvents(ul);


            return ul;

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

        bindEvents: function (el) {
            el.addEventListener('click', this._clickHandler);
        },

        unbindEvents: function (el) {
            el.removeEventListener('click', this._clickHandler);
        },

        _clickHandler: function (evt) {
            if (evt.currentTarget.getAttribute('class').indexOf('expandable') !== -1) {
                this.expand(evt.currentTarget);
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
