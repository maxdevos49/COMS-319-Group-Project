//vash throws a fit with typescript. Good Luck if you dare try
import vash from "vash";
import processValidation from "./validation";

/**
 * Module containing useful vash helpers for faster page building
 */

/**
 * LabelFor()
 * @param { Function } property represents the property to select
 * @param { Object } attributes represents html attributes
 * @returns html markup representing a label
 */
vash.helpers.LabelFor = function(model, attributes = {}) {
    let property = model(this.model.model);
    console.log(property)
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
 * @param { Function } property represents the property to select
 * @param { String } value value to give the text box
 * @param { Object } attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.TextBoxFor = function(model, value = "", attributes = {}) {
    let property = model(this.model.model);
    value = model(this.model.data);

    Object.assign(attributes, processValidation(property));

    this.buffer.push(`
            <input 
              type="text" 
              id="${property.path}" 
              name="${property.path}"
              value="${value || ""}"
              ${processAttributes(attributes)} />
        `);
};

/**
 * HiddenFor()
 * @param { Function } property represents the property to select
 * @returns html markup representing a hidden input
 */
vash.helpers.HiddenFor = function(model) {
    let property = model(this.model.model);
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
 * @param { Function } property represents the property to select
 * @param { String } value value to give the input box
 * @param { Object } attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.EditorFor = function(model, value = "", attributes = {}) {
    let property = model(this.model.model);
    value = model(this.model.data);

    let type = property.subtype ? property.subtype : getType(property.type.name);

    Object.assign(attributes, processValidation(property));

    this.buffer.push(`
            <input 
              type="${type}" 
              id="${property.path}" 
              name="${property.path}"
              value="${value || ""}"
              ${processAttributes(attributes)} />
        `);
};

/**
 * PasswordBoxFor()
 * @param { Function } property represents the property to select
 * @param { String } value value to give the input box
 * @param { Object } attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.PasswordBoxFor = function(model, value = "", attributes = {}) {
    let property = model(this.model.model);

    Object.assign(attributes, processValidation(property));

    this.buffer.push(`
            <input 
              type="password" 
              id="${property.path}" 
              name="${property.path}" 
              value="${value || ""}"
              ${processAttributes(attributes)} />
        `);
};

/**
 * ValdidationMessageFor()
 * @param { Function } property represents the property to select
 * @param { String? } value value to give the input box
 * @param { Object } attributes represents html attributes
 * @returns html markup representing validation needed for a specific model property
 */
vash.helpers.ValidationMessageFor = function(model, error = "", attributes = {}) {
    let property = model(this.model.model);

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
 * @param { Function } property represents the property to select
 * @returns the value of a model property
 */
vash.helpers.DisplayFor = function(model) {
    let property = model(this.model.data);

    if (property === 0) {
        property = property.toString();
    }

    this.buffer.push(property || "");
};

/**
 * DisplayNameFor()
 * @param { Function } model the propery
 * @returns the name of a model property
 */
vash.helpers.DisplayNameFor = function(model) {
    let property = model(this.model.model);
    this.buffer.push(property.name || property.path);
};

/**
 * @html.Navigator();
 * @param { String } type string represnting the button type
 * @param { String } text string representing what shoulf be shown on the button
 * @param { String } route string representing the route for the link
 * @param { Object } attributes object containing key value pairs of html attributes
 */
vash.helpers.Navigator = function(type, text = null, route = "#", attributes = {}) {
    if (text) {
        text = " " + text;
    } else {
        text = "";
    }

    attributes.class += ` btn ${typeClass(type)}"`;

    this.buffer.push(`
        <a href="${route}" ${processAttributes(attributes)}>
        ${typeIcon(type)}${text}
        </a>
        `);
};

/**
 * @html.Input()
 * @param { String } type string represnting the button type
 * @param { String } text string representing what shoulf be shown on the button
 * @param { Object } attributes object containing key value pairs of html attributes
 */
vash.helpers.Input = function(type, text = null, attributes = {}) {
    if (text) {
        text = " " + text;
    } else {
        text = "";
    }

    attributes.class += ` btn ${typeClass(type)}"`;

    this.buffer.push(`
        <button ${processAttributes(attributes)}>
        ${typeIcon(type)}${text}
        </button>
        `);
};

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
 * @param { String } type
 * @returns { String } bootstrap 4 classes for backgrounds
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
 * @returns { String } representing the icon html
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
    } else {
        return "";
    }
}

/**
 * Generates the form type based on the type of property
 * @param { * } giventype
 * @returns { String } representing the type of the property
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
 * @param { Object } attributes represents html attributes in key value form
 * @returns a string of html attributes
 */
function processAttributes(attributes) {
    return Object.keys(attributes)
        .map(function(attribute) {
            return `${attribute}="${attributes[attribute]}"`;
        })
        .join(" ");
}
