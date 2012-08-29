/*jshint nomen:false, browser: true, white: true, regexp:false, bitwise:false *//*global exports*//*!
 * callipygean
 * https://github.com/Couto/callipygean
 *
 * Copyright (c) 2012 Couto
 * Licensed under the MIT license.
 * http://couto.mit-license.org
 */(function(exports) {
    "use strict";
    function Collapsable(el) {
        this.el = el;
        this.isOpen = !1;
        this.bindEvents();
    }
    function Callipygean(options) {
        this.syntax = syntax[options.syntax];
        this.collapsed = options.collapsed || !1;
        this.collapsableCollection = [];
        if (!_.is.object(this.syntax)) throw new Error("Please pick a valid syntax. Possible values are: " + Object.keys(syntax).join(", "));
    }
    var _ = {
        $: function(selector) {
            return document.querySelectorAll(selector);
        },
        $$: function(el, attr) {
            var element = document.createElement(el), k;
            if (attr && attr.hasOwnProperty("html")) {
                element.innerHTML = attr.html;
                delete attr.html;
            }
            for (k in attr) attr.hasOwnProperty(k) && element.setAttribute(k, attr[k]);
            return element;
        },
        bind: function(bind) {
            var slice = Array.prototype.slice;
            return bind && typeof bind == "function" ? function(fn, ctx) {
                var args = slice.call(arguments, 2);
                return bind.apply(fn, [ ctx ].concat(args));
            } : function(fn, ctx) {
                var args = slice.call(arguments, 2);
                return function() {
                    fn.apply(ctx, args.concat(slice.call(arguments)));
                };
            };
        }(Function.prototype.bind),
        keys: function(obj) {
            var k, keys = [];
            for (k in obj) obj.hasOwnProperty(k) && keys.push(k);
            return keys;
        },
        forOwn: function(obj, fn, ctx, async) {
            var k, context = ctx || this;
            for (k in obj) obj.hasOwnProperty(k) && (async ? setTimeout(this.bind(fn, context, k, obj[k], obj), 0) : fn.call(context, k, obj[k], obj));
            return obj;
        },
        forEach: function(arr, fn, ctx) {
            var i = 0, len = arr.length, context = ctx || this;
            for (i; i < len; i += 1) fn.call(context, arr[i], i, arr);
            return arr;
        },
        is: {
            _toString: function(data) {
                return Object.prototype.toString.call(data);
            },
            object: function(obj) {
                return obj && this._toString(obj) === "[object Object]" && !this.falsy(obj.isPrototypeOf);
            },
            array: function(arr) {
                return this._toString(arr) === "[object Array]";
            },
            string: function(str) {
                return this._toString(str) === "[object String]";
            },
            number: function(num) {
                return this._toString(num) === "[object Number]";
            },
            falsy: function(value) {
                return value === undefined || value === null || this.number(value) && value !== +value || !value;
            },
            punctuation: function(str) {
                return this.string(str) && /[{}\[\];(),.:]/g.test(str);
            },
            "boolean": function(bol) {
                return bol === !0 || bol === !1 || this._toString(bol) === "[object Boolean]";
            },
            regex: function(reg) {
                return this._toString(reg) === "[object RegExp]";
            },
            regexStr: function(str) {
                return /(^|[^\/])\/(?!\/)(\[.+?\]|\\.|[^\/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g.test(str);
            },
            fun: function(fn) {
                return this._toString(fn) === "[object Function]";
            }
        }
    }, syntax = {
        PrismJS: {
            tokenClass: "token",
            comment: "comment",
            string: "string",
            regex: "regex",
            keyword: "keyword",
            "boolean": "boolean",
            number: "number",
            operator: "operator",
            ignore: null,
            punctuation: "punctuation"
        },
        Prettify: {
            string: "str",
            keyword: "kwd",
            comment: "com",
            type: "typ",
            literal: "lit",
            punctuation: "pun",
            plain: "pln",
            tag: "tag",
            declaration: "dec",
            source: "src",
            attribute_name: "atn",
            attribute_value: "atv",
            nocode: "nocode"
        }
    };
    Collapsable.prototype = {
        constructor: Collapsable,
        open: function() {
            if (!this.isOpen) {
                this.addClass();
                this.isOpen = !0;
                this.triggerEvent("opened");
            }
            return this;
        },
        close: function() {
            if (this.isOpen) {
                this.removeClass();
                this.isOpen = !1;
                this.triggerEvent("closed");
            }
            return this;
        },
        toggle: function(evt) {
            evt && evt.stopPropagation();
            return this.isOpen ? this.close() : this.open();
        },
        addClass: function() {
            if (!this.hasClass("opened")) {
                var className = this.el.getAttribute("class");
                this.el.setAttribute("class", className + " opened");
            }
            return this;
        },
        removeClass: function() {
            var className = this.el.getAttribute("class");
            this.el.setAttribute("class", className.replace(/\sopened/g, ""));
            return this;
        },
        hasClass: function(className) {
            return this.el.getAttribute("class") && this.el.getAttribute("class").indexOf(className) !== -1;
        },
        bindEvents: function() {
            this.el.addEventListener("click", _.bind(this.toggle, this));
        },
        unbindEvents: function() {
            this.el.removeEventListener("click", _.bind(this.toggle, this));
        },
        triggerEvent: function(name) {
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent(name, !0, !0);
            this.el.dispatchEvent(event);
        },
        dealloc: function() {
            this.unbindEvents();
            this.el.parentNode.removeChild(this.el);
            delete this.el;
            delete this.isOpen;
        }
    };
    Callipygean.prototype = {
        constructor: Callipygean,
        convert: function(obj, cb) {
            obj = _.is.string(obj) ? JSON.parse(obj) : obj;
            var ul = _.$$("ul", {
                "class": "callipygean"
            }), counter = _.keys(obj).length, async = cb && _.is.fun(cb) ? !0 : !1, child;
            _.forOwn(obj, function(key, val) {
                counter -= 1;
                child = _.$$("li");
                child.appendChild(this.buildKey(key));
                if (_.is.object(val)) {
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "{"
                    }));
                    child.appendChild(this.buildObject(val));
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "}"
                    }));
                    child.setAttribute("class", "expandable object");
                    this.collapsableCollection.push(new Collapsable(child));
                } else if (_.is.array(val)) {
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "["
                    }));
                    child.appendChild(this.buildArray(val));
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "]"
                    }));
                    child.setAttribute("class", "expandable array");
                    this.collapsableCollection.push(new Collapsable(child));
                } else child.appendChild(this.buildStandard(val));
                counter && child.appendChild(_.$$("span", {
                    "class": this.syntax.tokenClass + " punctuation",
                    html: ","
                }));
                ul.appendChild(child);
                async && counter === 0 && cb(ul);
            }, this, async);
            return async ? this : ul;
        },
        buildObject: function(obj) {
            var ul = _.$$("ul", {
                "class": "object"
            }), counter = _.keys(obj).length, child, keyEl;
            _.forOwn(obj, function(key, val) {
                counter -= 1;
                child = _.$$("li");
                keyEl = this.buildKey(key);
                child.appendChild(keyEl);
                if (_.is.array(val)) {
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "["
                    }));
                    child.appendChild(this.buildArray(val));
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "]"
                    }));
                    child.setAttribute("class", "expandable array");
                    this.collapsableCollection.push(new Collapsable(child));
                } else if (_.is.object(val)) {
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "{"
                    }));
                    child.appendChild(this.buildObject(val));
                    child.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "{"
                    }));
                    child.setAttribute("class", "expandable object");
                    this.collapsableCollection.push(child);
                } else child.appendChild(this.buildStandard(val));
                counter && child.appendChild(_.$$("span", {
                    "class": this.syntax.tokenClass + " punctuation",
                    html: ","
                }));
                ul.appendChild(child);
            }, this);
            return ul;
        },
        buildArray: function(arr) {
            var ul = _.$$("ul", {
                "class": "array"
            }), li, counter = arr.length;
            _.forEach(arr, function(val, idx) {
                counter -= 1;
                li = _.$$("li");
                if (_.is.object(val)) {
                    li.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "{"
                    }));
                    li.appendChild(this.buildObject(val));
                    li.appendChild(_.$$("span", {
                        "class": this.syntax.tokenClass + " punctuation",
                        html: "}"
                    }));
                    li.setAttribute("class", "expandable object");
                } else _.is.array(val) ? li = this.buildArray(val) : li = this.buildStandard(val, "li");
                counter && li.appendChild(_.$$("span", {
                    "class": this.syntax.tokenClass + " punctuation",
                    html: ","
                }));
                ul.appendChild(li);
                this.collapsableCollection.push(new Collapsable(li));
            }, this);
            return ul;
        },
        buildKey: function(key) {
            return _.$$("span", {
                "class": "key " + this.syntax.tokenClass + " string",
                html: '"' + key + '":'
            });
        },
        buildStandard: function(data, el) {
            var type = this.type(data);
            console.log(data, type);
            return _.$$(el || "span", {
                "class": this.syntax.tokenClass + " value " + type,
                html: type === "string" ? '"' + data + '"' : data
            });
        },
        convertAsync: function(obj, cb) {},
        type: function(val) {
            var type = typeof val;
            if (type === "object") {
                if (_.is.array(val)) return "array";
                if (_.is.regex(val)) return "regex";
            }
            return type === "string" && _.is.regexStr(val) ? "regex" : type;
        },
        dealloc: function() {
            var i = this.collapsableCollection.length - 1;
            for (i; i >= 0; i -= 1) this.collapsableCollection[i].dealloc();
        }
    };
    exports.callipygean = function(options) {
        return new Callipygean(options);
    };
})(typeof exports == "object" && exports || this);