/*global describe, it, expect, module*/

// Small boilerplate just in case someone runs the tests in node.js
if (typeof module !== 'undefined' && module.exports) {
    var expect = require('chai').expect,
        fs = require('fs'),
        vm = require('vm'),
        utils = fs.readFileSync(__dirname + '/../lib/utils.js', 'utf8');

    // this sounds pretty much like an eval =\
    vm.runInThisContext(utils);
}

describe('Utils - Test Suite', function () {
    describe('_', function () {
        it('should be an object with properties', function () {
            expect(_).to.be.an('object');
            expect(_.is).to.be.an('object');
            expect(Object.keys(_.is).length).to.be.above(0);
            expect(_.$).to.be.a('function');
            expect(_.$$).to.be.a('function');
        });
    });

    describe('$', function () {

        if (typeof document !== 'undefined') {
            it('should have length above zero', function () {
                expect(_.$('body').length).to.be.above(0);
            });

            it('result should be instance of NodeList', function () {
                expect(_.$('body')).to.satisfy(function (list) {
                    return !!(list instanceof NodeList || (typeof list.length === 'number' &&
                            typeof list.item !== 'undefined' &&
                            typeof list.nextNode === 'function' &&
                            typeof list.reset === 'function'));
                });
            });

        } else {
            it('this suit should only ran in the browser');
        }
    });

    describe('$$', function () {
        if (typeof document !== 'undefined') {

            it('should return DOM element', function () {
                expect(_.$$('div')).to.satisfy(function (el) {
                    return (typeof HTMLElement === "object" ?
                            el instanceof HTMLElement : //DOM2
                            el &&
                                typeof el === "object" &&
                                el.nodeType === 1 &&
                                typeof el.nodeName === "string");
                });
            });

            it('Element should be div', function () {
                expect(_.$$('div').tagName).to.equal('DIV');
            });

            it('Element should be have the correct content', function () {
                expect(_.$$('div', {html: 'Hello World'}).innerHTML).to.equal('Hello World');
            });

            it('Element should be have the correct attributes', function () {
                var div = _.$$('div', {
                        id: 'id',
                        'class': 'class',
                        name: 'testDiv',
                        html: 'HelloWorld'
                    });

                expect(div.getAttribute('id')).to.equal('id');
                expect(div.getAttribute('class')).to.equal('class');
                expect(div.getAttribute('name')).to.equal('testDiv');
                expect(div.innerHTML).to.equal('HelloWorld');
            });

        } else {
            it('this suit should only ran in the browser');
        }
    });

    describe('is', function () {

        describe('Object', function () {
            it('empty object should be true', function () {
                expect(_.is.object({})).to.be.ok;
            });

            it('object should be true', function () {
                expect(_.is.object({'a': 'b', 'c': 1})).to.be.ok;
            });

            it('number should be false', function () {
                expect(_.is.object(1)).to.be.falsy;
            });

            it('string should be false', function () {
                expect(_.is.object("a")).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.object([])).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.object(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.object(function () {})).to.be.falsy;
            });
        });

        describe('Array', function () {
            it('empty array should be true', function () {
                expect(_.is.array([])).to.be.ok;
            });

            it('array should be true', function () {
                expect(_.is.array(['a', 'b', 'c', 1])).to.be.ok;
            });

            it('number should be false', function () {
                expect(_.is.array(1)).to.be.falsy;
            });

            it('string should be false', function () {
                expect(_.is.array("a")).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.array({})).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.array(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.array(function () {})).to.be.falsy;
            });
        });

        describe('String', function () {
            it('empty string should be true', function () {
                expect(_.is.string("")).to.be.ok;
            });

            it('string should be true', function () {
                expect(_.is.string('abc1')).to.be.ok;
            });

            it('number should be false', function () {
                expect(_.is.string(1)).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.string([])).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.string({})).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.string(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.string(function () {})).to.be.falsy;
            });
        });

        describe('Number', function () {
            it('number should be true', function () {
                expect(_.is.number(0)).to.be.ok;
            });

            it('string should be false', function () {
                expect(_.is.number('1')).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.number([])).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.number({})).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.number(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.number(function () {})).to.be.falsy;
            });
        });

        describe('Falsy (undefined, null, NaN)', function () {
            it('undefined should be true', function () {
                expect(_.is.falsy(undefined)).to.be.ok;
            });

            it('null should be true', function () {
                expect(_.is.falsy(null)).to.be.ok;
            });

            it('NaN should be true', function () {
                expect(_.is.falsy(NaN)).to.be.ok;
            });

            it('false should be true', function () {
                expect(_.is.falsy(false)).to.be.ok;
            });

            it('zero should be true', function () {
                expect(_.is.falsy(0)).to.be.ok;
            });

            it('string should be false', function () {
                expect(_.is.falsy('1')).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.falsy([])).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.falsy({})).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.falsy(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.falsy(function () {})).to.be.falsy;
            });
        });

        describe('Punctuation', function () {
            it('[ should be true', function () {
                expect(_.is.punctuation('[')).to.be.ok;
            });

            it('] should be true', function () {
                expect(_.is.punctuation(']')).to.be.ok;
            });

            it('( should be true', function () {
                expect(_.is.punctuation('(')).to.be.ok;
            });

            it(') should be true', function () {
                expect(_.is.punctuation(')')).to.be.ok;
            });

            it('; should be true', function () {
                expect(_.is.punctuation(';')).to.be.ok;
            });

            it(': should be true', function () {
                expect(_.is.punctuation(':')).to.be.ok;
            });

            it(', should be true', function () {
                expect(_.is.punctuation(',')).to.be.ok;
            });

            it('{ should be true', function () {
                expect(_.is.punctuation('{')).to.be.ok;
            });

            it('} should be true', function () {
                expect(_.is.punctuation('}')).to.be.ok;
            });

            it('a should be false', function () {
                expect(_.is.punctuation('a')).to.be.falsy;
            });

            it('zero should be false', function () {
                expect(_.is.punctuation(0)).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.punctuation({})).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.punctuation([])).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.punctuation(/\w/)).to.be.falsy;
            });

            it('undefined should be false', function () {
                expect(_.is.punctuation(undefined)).to.be.falsy;
            });

            it('null should be false', function () {
                expect(_.is.punctuation(null)).to.be.falsy;
            });
        });

        describe('Boolean', function () {
            it('true should be true', function () {
                expect(_.is.boolean(true)).to.be.ok;
            });

            it('false should be true', function () {
                expect(_.is.boolean(false)).to.be.ok;
            });

            it('"true" should be false', function () {
                expect(_.is.boolean("true")).to.be.falsy;
            });

            it('"false" should be false', function () {
                expect(_.is.boolean("false")).to.be.falsy;
            });

            it('1 should be false', function () {
                expect(_.is.boolean(1)).to.be.falsy;
            });

            it('0 should be false', function () {
                expect(_.is.boolean(0)).to.be.falsy;
            });

            it('undefined should be false', function () {
                expect(_.is.boolean(undefined)).to.be.falsy;
            });

            it('null should be false', function () {
                expect(_.is.boolean(null)).to.be.falsy;
            });

            it('NaN should be false', function () {
                expect(_.is.boolean(NaN)).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.boolean([])).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.boolean({})).to.be.falsy;
            });
        });

        describe('RegExp', function () {
            it('/\w/ should be true', function () {
                expect(_.is.regex(/w/)).to.be.ok;
            });

            it('/[a-z]/ should be true', function () {
                expect(_.is.regex(/[a-z]/)).to.be.ok;
            });

            it('/a/g should be true', function () {
                expect(_.is.regex(/a/g)).to.be.ok;
            });

            it('"/a/g" should be false', function () {
                expect(_.is.regex("/a/g")).to.be.falsy;
            });

            it('"/[a|b|c]{3}/" should be false', function () {
                expect(_.is.regex("/[a|b|c]{3}/")).to.be.falsy;
            });

            it('new RegExp("/[a|b|c]{3}/") should be true', function () {
                expect(_.is.regex(new RegExp("/[a|b|c]{3}/"))).to.be.ok;
            });
        });

        describe('RegExp String', function () {
            it('/\w/ should be false', function () {
                expect(_.is.regexStr(/w/)).to.be.falsy;
            });

            it('"/[a-z]/" should be true', function () {
                expect(_.is.regexStr("/[a-z]/")).to.be.ok;
            });

            it('/a/g should be false', function () {
                expect(_.is.regexStr(/a/g)).to.be.falsy;
            });

            it('"/a/g" should be true', function () {
                expect(_.is.regexStr("/a/g")).to.be.ok;
            });

            it('"/[a|b|c]{3}/" should be true', function () {
                expect(_.is.regexStr("/[a|b|c]{3}/")).to.be.ok;
            });

            it('new RegExp("/[a|b|c]{3}/") should be false', function () {
                expect(_.is.regexStr(new RegExp("/[a|b|c]{3}/"))).to.be.falsy;
            });
        });

        describe('Function', function () {
            it('function should be true', function () {
                expect(_.is.fun(function () {})).to.be.ok;
            });

            it('string should be false', function () {
                expect(_.is.fun('abc1')).to.be.falsy;
            });

            it('number should be false', function () {
                expect(_.is.fun(1)).to.be.falsy;
            });

            it('array should be false', function () {
                expect(_.is.fun([])).to.be.falsy;
            });

            it('object should be false', function () {
                expect(_.is.fun({})).to.be.falsy;
            });

            it('regex should be false', function () {
                expect(_.is.fun(/\w/)).to.be.falsy;
            });

            it('function should be false', function () {
                expect(_.is.fun(function () {})).to.be.falsy;
            });
        });
    });
});
