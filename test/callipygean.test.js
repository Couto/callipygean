/*jslint browser: true*/
/*global describe, it, expect, module, exist*/

var fixture;
if (typeof module !== 'undefined' && module.exports) {
    var expect = require('chai').expect,
        callipygean = require('../dist/callipygean').callipygean,

        fs = require('fs');

    fixture = function (path) {
        return fs.readFileSync(__dirname + '/' + path, 'utf8');
    };

} else {
    fixture = function (path) {
        var ajax = new XMLHttpRequest();
        // yes... sync... couldn't care less..
        ajax.open('GET', path, false);
        ajax.send();
        if (ajax.status === 200) {
            return ajax.responseText;
        }
    };
}

describe('Callipygean', function () {
    describe('Initialization', function () {
        it('should exist', function () {
            expect(callipygean).to.exist;
        });

        it('should return a instance of Callipygean', function () {
            var col = callipygean({
                syntax: 'PrismJS',
                collapsed: true
            });

            expect(col).to.be.instanceOf(col.constructor);
        });

        it('should have syntax property', function () {
            var col = callipygean({
                syntax: 'PrismJS',
                collapsed: true
            });

            expect(col.syntax).to.exist;
            expect(col.syntax).to.be.an('object');
        });

        it('syntax property should match the correct syntax object', function () {
            var syntaxobj = {
                    PrismJS : fixture('../lib/syntax/prism.json'),
                    Prettify: fixture('../lib/syntax/prettify.json')
                },
                colPrism = callipygean({
                    syntax: 'PrismJS',
                    collapsed: true
                }),
                colPretty = callipygean({
                    syntax: 'Prettify',
                    collapsed: true
                });

            expect(colPrism.syntax).to.eql(JSON.parse(syntaxobj.PrismJS));
            expect(colPretty.syntax).to.eql(JSON.parse(syntaxobj.Prettify));
        });
    });
});

if (typeof module !== 'undefined' && module.exports) {
    it('further tests should be run in a browser');
} else {
    // This is tdd
    // kinda awkawrd to mix this in the same file
    // but i'm a lazy guy...
    mocha.setup('tdd');

    suite('Functioning', function () {
        var col,
            basic = JSON.parse(fixture('_fixtures/json/basic.json')),
            obj = JSON.parse(fixture('_fixtures/json/object.json')),
            mixed = JSON.parse(fixture('_fixtures/json/mixed.json'));

        beforeEach(function () {
            col = callipygean({
                syntax: 'PrismJS',
                collapsed: true
            });
        });

        afterEach(function () {
            col.dealloc();
        });


        test('should return an DOM Element', function () {
            var result = col.convert({'a': 'b'});
            expect(result).to.be.instanceOf(HTMLElement);
        });

        test('should be an ul', function () {
            var result = col.convert(basic);
            expect(result).to.be.instanceOf(HTMLUListElement);
        });

        test('should have one li element as child node', function () {
            var result = col.convert(basic);
            expect(result.childNodes.length).to.equal(3);
            expect(result.childNodes[0]).to.be.instanceOf(HTMLLIElement);
        });

        test('should have spans inside li representing keys and values', function () {
            var result = col.convert(basic);

            expect(result.childNodes[0].childNodes.length).to.equal(2);
            expect(result.childNodes[0].childNodes[0]).to.be.instanceOf(HTMLSpanElement);
            expect(result.childNodes[0].childNodes[1]).to.be.instanceOf(HTMLSpanElement);
        });

        test('number of children elements should match the number of keys', function () {
            var result = col.convert(basic);
            expect(result.childNodes.length).to.equal(3);
        });

        test('children must be li elements', function () {
            var result = col.convert(basic),
                i = result.childNodes.length - 1;

            expect(result.childNodes.length).to.equal(3);

            for (i; i >= 0; i -= 1) {
                expect(result.childNodes[i]).to.be.instanceOf(HTMLLIElement);
            }
        });

        test('each li children must own two span elements matching the object name and value', function () {
            var result = col.convert(basic),
                keys = Object.keys(basic),
                i = result.childNodes.length - 1,
                j;

            expect(result.childNodes.length).to.equal(keys.length);

            for (i; i >= 0; i -= 1) {
                j = result.childNodes[i].childNodes.length - 1;

                for (j; j >= 0; j -= 1) {
                    expect(result.childNodes[i].childNodes[j]).to.be.instanceOf(HTMLSpanElement);
                    expect(result.childNodes[i].childNodes[0].innerHTML).to.equal(keys[i]);
                    expect(result.childNodes[i].childNodes[1].innerHTML).to.equal(basic[keys[i]]);
                }
            }
        });

        test('if the object contains another object, a new sub-list has to be created', function () {
            var result = col.convert(obj);
            expect(result.childNodes[0].childNodes[1]).to.be.instanceOf(HTMLUListElement);
        });

        test('value must have a class equal it\'s type', function () {
            var result = col.convert(mixed);

            expect(result.childNodes[0].childNodes[1].getAttribute('class')).to.contain('object');
            expect(result.childNodes[1].childNodes[1].getAttribute('class')).to.contain('array');
            expect(result.childNodes[2].childNodes[1].getAttribute('class')).to.contain('string');
            expect(result.childNodes[3].childNodes[1].getAttribute('class')).to.contain('number');
            expect(result.childNodes[4].childNodes[1].getAttribute('class')).to.contain('regex');
        });

        test('if it was defined as collapsed, object must be closed', function () {
            var i = col.collapsableCollection.length - 1;

            expect(col.collapsed).to.be.ok;

            for (i; i >= 0; i -= 1) {
                expect(col.collapsableCollection[i].isOpen).to.be.falsy;
            }

        });

        test('if the sub-list is closed and is clicked, it must open', function (walk) {
            var result = col.convert(obj);

            result.childNodes[0].childNodes[0].addEventListener('opened', function () {
                expect(col.collapsableCollection[0].isOpen).to.be.ok;
                walk();
            });

            expect(col.collapsableCollection[0].isOpen).to.be.falsy;
            result.childNodes[0].childNodes[0].click();

        });

    });
}
