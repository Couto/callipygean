/**
 * Collapsable object
 * Given a node element, it will allow it to open and close
 *
 * @constructor
 * @public
 *
 * @param    {Element} el
 */
function Collapsable(el) {
    this.el = el;
    this.isOpen = false;
    this.bindEvents();
}

Collapsable.prototype = {
    /**
     * @see Collapsable
     * @type {Function}
     */
    constructor: Collapsable,
    /**
     * open
     * Opens the node
     *
     * @method
     * @public
     * @chainable
     */
    open: function () {
        if (!this.isOpen) {
            this.addClass();
            this.isOpen = true;
            this.triggerEvent('opened');
        }

        return this;
    },
    /**
     * close
     * closes the node
     *
     * @method
     * @public
     * @chainable
     */
    close: function () {
        if (this.isOpen) {
            this.removeClass();
            this.isOpen = false;
            this.triggerEvent('closed');
        }

        return this;
    },
    /**
     * toggle
     * Opens the element if it's closed.
     * Closes if it's open
     *
     * @method
     * @public
     * @chainable
     */
    toggle: function (evt) {
        if (evt) { evt.stopPropagation(); }

        return (this.isOpen) ?
                this.close() :
                this.open();
    },
    /**
     * addClass
     * adds the 'open' class to the element
     *
     * @method
     * @public
     * @chainable
     */
    addClass: function () {
        if (!this.hasClass('opened')) {
            var className = this.el.getAttribute('class');
            this.el.setAttribute('class', className + ' opened');
        }

        return this;
    },
    /**
     * removeClass
     * removes the 'open' class to the element
     *
     * @method
     * @public
     * @chainable
     */
    removeClass: function () {
        var className = this.el.getAttribute('class');

        this.el.setAttribute('class', className.replace(/\sopened/g, ''));

        return this;
    },

    hasClass: function (className) {
        return (this.el.getAttribute('class').indexOf(className) !== -1);
    },
    /**
     * bindEvents
     * Attach the necessary events
     *
     * @method
     * @protected
     * @return   {undefined}
     */
    bindEvents: function () {
        this.el.addEventListener('click', _.bind(this.toggle, this));
    },
    /**
     * bindEvents
     * dettach the necessary events
     *
     * @method
     * @protected
     * @return   {undefined}
     */
    unbindEvents: function () {
        this.el.removeEventListener('click', _.bind(this.toggle, this));
    },

    triggerEvent: function (name) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent(name, true, true);
        this.el.dispatchEvent(event);
    },
    /**
     * dealloc
     * Removes binded events, destroys the element
     *
     * @method
     * @public
     * @return   {undefined}
     */
    dealloc: function () {
        this.unbindEvents();
        this.el.parentNode.removeChild(this.el);
        delete this.el;
        delete this.isOpen;
    }

};
