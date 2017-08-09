define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    'dojo/_base/lang',
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-class"
], function(declare, _WidgetBase, lang, domConstruct, domAttr, domClass) {
    "use strict";

    // Declare widget"s prototype.
    return declare("EnumClass.widget.EnumClass", [_WidgetBase], {

        // Set in Modeler
        name: "",
        enumvalues: [], // Value array, keep it compatible with mx4
        glyphicon: "",
        applyToEnum: "",
        associationClassName: "",

        // internal variables
        caption: [],
        classnames: [],
        replacements: [],
        curindex: 0,
        element: null,
        defaultClass: "",
        elementToApplyTo: null,
        showWidget: true,
        referenceEntity: null,
        _referenceName: null,
        attributeType: "primitive",

        postCreate: function() {

            // Polyfill so we can use element.closest in IE
            // matches polyfill
            window.Element && function(ElementPrototype) {
                ElementPrototype.matches = ElementPrototype.matches ||
                    ElementPrototype.matchesSelector ||
                    ElementPrototype.webkitMatchesSelector ||
                    ElementPrototype.msMatchesSelector ||
                    function(selector) {
                        var node = this,
                            nodes = (node.parentNode || node.document).querySelectorAll(selector),
                            i = -1;
                        while (nodes[++i] && nodes[i] != node);
                        return !!nodes[i];
                    }
            }(Element.prototype);

            // closest polyfill
            window.Element && function(ElementPrototype) {
                ElementPrototype.closest = ElementPrototype.closest ||
                    function(selector) {
                        var el = this;
                        while (el.matches && !el.matches(selector)) el = el.parentNode;
                        return el.matches ? el : null;
                    }
            }(Element.prototype);

            // End polyfill

            // Style by reference
            if (this.referenceEntity) {
                this._referenceName = this.referenceEntity.split("/")[0];
            }

            this.caption = [];
            this.classnames = [];
            this.replacements = [];
            // Copy data from object array
            for (var i = 0; i < this.enumvalues.length; i++) {
                this.caption.push(this.enumvalues[i].captions);
                this.classnames.push(this.enumvalues[i].classnames);
                this.replacements.push(this.enumvalues[i].replacements);
            }

            this.element = domConstruct.create("span");

            switch (this.applyToEnum) { // Select the right element to apply the class too
                case "SELF":
                    this.elementToApplyTo = this.element;
                    break;
                case "ROW":
                    this.elementToApplyTo = this.element.closest(".mx-templategrid-row");
                    break;
                case "ITEM":
                    this.elementToApplyTo = this.element.closest(".mx-listview-item");
                    break;
                case "PARENT":
                    this.elementToApplyTo = this.domNode.parentElement;
                    break;
                case "SIBLING":
                    this.elementToApplyTo = this.domNode.previousSibling;
                    break;
                case "TARGET_SELECTOR":
                    this.elementToApplyTo = this.domNode.closest(this.targetClassName);
                    break;
                default:
                    this.elementToApplyTo = this.element;
            }

            if (!this.showWidget && this.elementToApplyTo) {
                this.domNode.appendChild(this.element);
                domAttr.set(this.element, "style", "display:none;");
            }

            if (!this.elementToApplyTo) {
                var alertDiv = document.createElement("div");
                    alertDiv.setAttribute("class", "alert alert-danger");
                    var alertContent = document.createTextNode("Custom widget '" + this.id + "' could not find the element to apply the class"); 
                    alertDiv.appendChild(alertContent);
                    this._markerNode.parentNode.insertBefore(alertDiv, this._markerNode); 
            }
            // ET 12/7/16 -- Removed in favor of the dom-class module so two EnumClass widgets can peacefully coexist
            // this.defaultClass = domAttr.get(this.elementToApplyTo, "class");

            // if (this.defaultClass !== "") {
            //     this.defaultClass += " ";
            // }
        },

        update: function(obj, callback) {
            if (obj && this.elementToApplyTo) {
                // Check reference
                if (this._referenceName && obj.get(this._referenceName) !== "") {
                    // Set the classes
                    domClass.add(this.elementToApplyTo, this.associationClassName);
                } else {
                    domClass.remove(this.elementToApplyTo, this.associationClassName);
                }
            }
            this._resetSubscriptions();
            callback();
        },

        _setValueAttr: function(value) {
            if (this.attributeType == "reference") {
                if (value) {
                    value = "true";
                } else {
                    value = "false";
                }
            }

            if (value === true) {
                value = "true";
            } else if (value === false) {
                value = "false";
            }

            var i = this.caption.indexOf(value);
            var classname = "";
            var toDisplay = "";

            if ((i >= 0) && (i < this.caption.length)) {
                this.curindex = i;
                classname = this.classnames[i];
            } else {
                this.curindex = 0;
                classname = "";
            }

            if (this.replacements[i] !== "" && typeof this.replacements[i] !== "undefined") {
                toDisplay = this.replacements[i];
            } else {
                toDisplay = value;
            }

            if (this.glyphicon !== "") {
                classname = classname + " glyphicon glyphicon-" + this.glyphicon + " ";
            }
            // domAttr.set(this.elementToApplyTo, "class", this.defaultClass + classname); // Set the class to the existing class + enum-determined-class
            for (var i = 0; i < this.classnames.length; i++) {
                if (classname !== this.classnames[i]) {
                    domClass.remove(this.elementToApplyTo, this.classnames[i]);
                }
            }
            domClass.add(this.elementToApplyTo, classname);

            if (this.glyphicon !== "") {
                domAttr.set(this.element, "innerHTML", "");
                domAttr.set(this.element, "title", toDisplay); // Set innerHTML empty and tooltip to caption
            } else {
                domAttr.set(this.element, "innerHTML", toDisplay); // Set the innerHTML to the value of the attribute
            }
        },

        _getValueAttr: function(value) {
            return this.caption[this.curindex];
        },

        // Stub function, will be used or replaced by the client environment
        onChange: function() {},

        textChange: function(e) {
            this.onChange();
        },

        _resetSubscriptions: function() {
<<<<<<< HEAD
<<<<<<< HEAD
=======
            if (!this.elementToApplyTo) {
                return;
            }
            this.unsubscribeAll();
>>>>>>> 72e4281... fixup! Add support target selector
=======
            this.unsubscribeAll();
>>>>>>> c8461ed... Simply subscription
            var attributeName = this.name;
            if (this.attributeType == "reference") {
                attributeName = this._referenceName;
            }

            if (this.mxcontext && this.mxcontext.getTrackId()) {
                this.subscribe({
                    guid: this.mxcontext.getTrackId(),
                    attr: this.name,
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        this._setValueAttr(attrValue);
                    })
                });
            }
        }
    });
});

require(["EnumClass/widget/EnumClass"]);
