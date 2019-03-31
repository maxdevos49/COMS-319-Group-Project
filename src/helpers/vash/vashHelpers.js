const vash = require("vash");
const processValidation = require("./validation.js");

/**
 * Module containing useful vash helpers for faster page building
 */
module.exports = function () {

    /**
     * LabelFor()
     * @returns html markup representing a label
     */
    vash.helpers.LabelFor = function (model, attributes = {}) {
        property = model(this.model.model);

        this.buffer.push(`
            <label 
              for="${property.path}" 
              ${processAttributes(attributes)}>
                ${property.name || property.path}
            </label>
        `);
    };

    /**
     * TextBoxFor()
     * @returns html markup representing a text box
     */
    vash.helpers.TextBoxFor = function (model, value = '', attributes = {}) {
        property = model(this.model.model);
        value = model(this.model.data);

        Object.assign(attributes, processValidation(property));

        this.buffer.push(`
            <input 
              type="text" 
              id="${property.path}" 
              name="${property.path}"
              value="${value || ''}"
              ${processAttributes(attributes)} />
        `);
    };

    /**
     * HiddenFor()
     * @returns html markup representing a hidden input
     */
    vash.helpers.HiddenFor = function (model) {
        property = model(this.model.model);
        value = model(this.model.data);

        this.buffer.push(`
            <input 
              type="hidden" 
              name="${property.path}"
              value="${value}"/>
        `);
    };

    /**
     * EditorFor()
     * @returns html markup representing a text box
     */
    vash.helpers.EditorFor = function (model, value = '', attributes = {}) {
        property = model(this.model.model);
        value = model(this.model.data);

        type = (property.subtype) ? property.subtype : getType(property.type.name);

        Object.assign(attributes, processValidation(property));

        this.buffer.push(`
            <input 
              type="${type}" 
              id="${property.path}" 
              name="${property.path}"
              value="${value || ''}"
              ${processAttributes(attributes)} />
        `);
    };

    /**
     * PasswordBoxFor()
     * @returns html markup representing a text box
     */
    vash.helpers.PasswordBoxFor = function (model, value = '', attributes = {}) {
        property = model(this.model.model);

        Object.assign(attributes, processValidation(property));

        this.buffer.push(`
            <input 
              type="password" 
              id="${property.path}" 
              name="${property.path}" 
              value="${value || ''}"
              ${processAttributes(attributes)} />
        `);
    };

    /**
     * ValdidationMessageFor()
     * @returns html markup representing validation needed for a specific model property
     */
    vash.helpers.ValidationMessageFor = function (model, error = "", attributes = {}) {
        property = model(this.model.model);

        this.buffer.push(`
            <div 
              class="text-danger field-validation-valid" 
              data-valmsg-for="${property.path}"
              data-valmsg-replace="true"
              ${processAttributes(attributes)}>
              <span>${error}</span>
            </div>
        `);
    };

    /**
     * DisplayFor()
     * @returns the value of a model property
     */
    vash.helpers.DisplayFor = function (model, options = null) {
        property = model(this.model.data);
        propertyModel = model(this.model.model);

        // if (propertyModel.type) {
        //     // if (propertyModel.type.name === "Date") {
        //     //     let date = new Date(Date.parse(property));
        //     //     property = `${date.toLocaleString()}`;
        //     // }
        // }

        if (property === 0) {
            property = property.toString();
        }

        this.buffer.push(property || '');
    };

    /**
     * DisplayNameFor()
     * @returns the name of a model property
     */
    vash.helpers.DisplayNameFor = function (model) {
        property = model(this.model.model);
        this.buffer.push(property.name || property.path);
    };


    /**
     * @html.Navigator();
     * @summary used to create similar links and buttons for navigating the website. Not forms.
     */
    vash.helpers.Navigator = function (type, text = null, route = "#", attributes = {}) {

        if (text) {
            text = " " + text;
        } else {
            text = "";
        }

        attributes.class += ` btn ${typeClass(type)}"` 

        this.buffer.push(`
        <a href="${route}" ${processAttributes(attributes)}>
        ${typeIcon(type)}${text}
        </a>
        `);

    }

    /**
     * @html.Input();
     * @summary Used for creating submit buttons or other things for forms
     */
    vash.helpers.Input = function (type, text = null, attributes = {}) {

        if (text) {
            text = " " + text;
        } else {
            text = "";
        }

        attributes.class += ` btn ${typeClass(type)}"` 

        this.buffer.push(`
        <button ${processAttributes(attributes)}>
        ${typeIcon(type)}${text}
        </button>
        `);

    }


    /**
     * Navigator/Input style types
     */
    vash.helpers.Create = "create";
    vash.helpers.Edit = "edit";
    vash.helpers.Details = "details";
    vash.helpers.Delete = "delete";
    vash.helpers.Download = "download";
    vash.helpers.Save = "save";
    vash.helpers.Back = "back";


    /**
     * @param {String} type
     */
    function typeClass(type) {

        if (type === "create") {
            return "btn-primary";
        } else if (type === "edit") {
            return "btn-warning";
        } else if (type === "details") {
            return "btn-info";
        } else if (type === "download") {
            return "btn-warning";
        } else if (type === "delete") {
            return "btn-danger";
        } else if (type === "back") {
            return "btn-secondary";
        } else if (type == "save") {
            return "btn-success";
        } else if (type == null) {
            return "btn-success";
        }

    }

    /**
     * @param {String} type
     */
    function typeIcon(type) {

        if (type === "create") {
            return `<i class="fa fa-plus fa-lg"></i>`;
        } else if (type === "edit") {
            return `<i class="fa fa-edit fa-lg"></i>`;
        } else if (type === "details") {
            return `<i class="fa fa-info-circle fa-lg"></i>`;
        } else if (type === "delete") {
            return `<i class="fa fa-trash fa-lg"></i>`;
        } else if (type === "download") {
            return '<i class="fa fa-save fa-lg"></i>';
        } else if (type === "back") {
            return `<i class="fa fa-caret-left fa-lg"></i>`;
        } else if (type === "save") {
            return `<i class="fa fa-save fa-lg"></i>`;
        }else{
            return "";
        }

    }

    /**
     * Generates the form type based on the type of property
     * 
     * @param {*} giventype
     */
    function getType(giventype) {
        if (giventype === "String") {
            return "text";
        } else if (giventype === "Date") {
            return "date";
        } else if (giventype === "Boolean") {
            return "check";
        } else if (giventype === "Number") {
            return "number";
        }
    }

    /**
     * Helper function that turns the attribute object into a html attribute string for insertsion into an html tag
     * @param {*} attributes 
     * @returns a string of html attributes
     */
    function processAttributes(attributes) {
        return (Object.keys(attributes).map(function (attribute) {
            return `${attribute}="${attributes[attribute]}"`;
        }).join(" "));
    }

}
