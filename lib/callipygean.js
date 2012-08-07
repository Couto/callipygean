/*jslint nomen:true, browser: true, white: true*/
/*global exports*/

/*!
 * callipygean
 * https://github.com/Couto/callipygean
 *
 * Copyright (c) 2012 Couto
 * Licensed under the MIT license.
 */

(function (exports) {
    'use strict';

    //#include "utils.js";,

        syntax = {
            PrismJS : //#include "syntax/prism.json";,
            Prettify: //#include "syntax/prettify.json";
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
                                'class': mainClass + ' string'
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
