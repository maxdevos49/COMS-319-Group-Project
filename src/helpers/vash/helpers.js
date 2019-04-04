const vash = require("vash");
import processValidation from "./validation";
import { InputType } from "./vashInterface";
/**
 * Module containing useful vash helpers for faster page building
 */
/**
 * LabelFor()
 * @param property represents the property to select
 * @param attributes represents html attributes
 * @returns html markup representing a label
 */
vash.helpers.LabelFor = function (model, attributes) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
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
 * @param property represents the property to select
 * @param value value to give the text box
 * @param attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.TextBoxFor = function (model, value, attributes) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
    //dont throw undefined for lack of data
    if (this.model.data)
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
 * @param property represents the property to select
 * @returns html markup representing a hidden input
 */
vash.helpers.HiddenFor = function (model, value) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
    //dont throw undefined for lack of data
    if (this.model.data)
        value = model(this.model.data);
    this.buffer.push(`
            <input
              type="hidden"
              name="${property.path}"
              value="${value || ""}"/>
        `);
};
/**
 * EditorFor()
 * @param property represents the property to select
 * @param value value to give the input box
 * @param attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.EditorFor = function (model, value, attributes) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
    let type = getType(property.type.name); //property.subtype ? property.subtype :
    Object.assign(attributes, processValidation(property));
    this.buffer.push(`
            <input
              type="${type || "text"}"
              id="${property.path}"
              name="${property.path}"
              value="${value || ""}"
              ${processAttributes(attributes)} />
        `);
};
/**
 * PasswordBoxFor()
 * @param property represents the property to select
 * @param value value to give the input box
 * @param attributes represents html attributes
 * @returns html markup representing a text box
 */
vash.helpers.PasswordBoxFor = function (model, value, attributes = {}) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
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
 * @param property represents the property to select
 * @param value value to give the input box
 * @param attributes represents html attributes
 * @returns html markup representing validation needed for a specific model property
 */
vash.helpers.ValidationMessageFor = function (model, error, attributes) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
    this.buffer.push(`
            <div
              class="text-danger field-validation-valid"
              data-valmsg-for="${property.path}"
              data-valmsg-replace="true"
              ${processAttributes(attributes)}>
              <span>${error || ""}</span>
            </div>
        `);
};
/**
 * DisplayFor()
 * @param property represents the property to select
 * @returns the value of a model property
 */
vash.helpers.DisplayFor = function (model) {
    let value = model(this.model.data);
    //0 is falsy but we still want to display it so lets make it a string
    if (typeof value === "number")
        if (value === 0)
            value.toString();
    this.buffer.push(value || "");
};
/**
 * DisplayNameFor()
 * @param model the propery
 * @returns the name of a model property
 */
vash.helpers.DisplayNameFor = function (model) {
    let m = this.model.viewModel.toObject();
    let property = model(m);
    this.buffer.push(property.name || property.path);
};
/**
 * @html.Navigator();
 * @param type string represnting the button type
 * @param text string representing what shoulf be shown on the button
 * @param route string representing the route for the link
 * @param attributes object containing key value pairs of html attributes
 */
vash.helpers.Navigator = function (type, text, route, attributes = {}) {
    if (text)
        text = " " + text;
    else
        text = "";
    attributes.class += ` btn ${typeClass(type)}"`;
    this.buffer.push(`
        <a href="${route || "#"}" ${processAttributes(attributes)}>
        ${typeIcon(type)}${text || ""}
        </a>
        `);
};
/**
 * @html.Input()
 * @param type string represnting the button type
 * @param text string representing what shoulf be shown on the button
 * @param attributes object containing key value pairs of html attributes
 */
vash.helpers.Input = function (type, text, attributes = {}) {
    if (text) {
        text = " " + text;
    }
    else {
        text = "";
    }
    attributes.class += ` btn ${typeClass(type)}"`;
    this.buffer.push(`
        <button ${processAttributes(attributes)}>
        ${typeIcon(type)}${text || ""}
        </button>
        `);
};
var ButtonTypes;
(function (ButtonTypes) {
    ButtonTypes[ButtonTypes["Create"] = 0] = "Create";
    ButtonTypes[ButtonTypes["Edit"] = 1] = "Edit";
    ButtonTypes[ButtonTypes["Details"] = 2] = "Details";
    ButtonTypes[ButtonTypes["Delete"] = 3] = "Delete";
    ButtonTypes[ButtonTypes["Download"] = 4] = "Download";
    ButtonTypes[ButtonTypes["Save"] = 5] = "Save";
    ButtonTypes[ButtonTypes["Back"] = 6] = "Back";
})(ButtonTypes || (ButtonTypes = {}));
// /**
//  * Navigator/Input style types
//  */
vash.helpers.Create = 0;
vash.helpers.Edit = 1;
vash.helpers.Details = 2;
vash.helpers.Delete = 3;
vash.helpers.Download = 4;
vash.helpers.Save = 5;
vash.helpers.Back = 6;
/**
 * @param type
 * @returns  bootstrap 4 classes for backgrounds
 */
function typeClass(type) {
    if (type === ButtonTypes.Create) {
        return "btn-primary";
    }
    else if (type === ButtonTypes.Edit) {
        return "btn-warning";
    }
    else if (type === ButtonTypes.Details) {
        return "btn-info";
    }
    else if (type === ButtonTypes.Download) {
        return "btn-warning";
    }
    else if (type === ButtonTypes.Delete) {
        return "btn-danger";
    }
    else if (type === ButtonTypes.Back) {
        return "btn-secondary";
    }
    else if (type == ButtonTypes.Save) {
        return "btn-success";
    }
    return "btn-success";
}
/**
 * @param type
 * @returns representing the icon html
 */
function typeIcon(type) {
    if (type === ButtonTypes.Create) {
        return `<i class="fa fa-plus fa-lg"></i>`;
    }
    else if (type === ButtonTypes.Edit) {
        return `<i class="fa fa-edit fa-lg"></i>`;
    }
    else if (type === ButtonTypes.Details) {
        return `<i class="fa fa-info-circle fa-lg"></i>`;
    }
    else if (type === ButtonTypes.Delete) {
        return `<i class="fa fa-trash fa-lg"></i>`;
    }
    else if (type === ButtonTypes.Download) {
        return '<i class="fa fa-save fa-lg"></i>';
    }
    else if (type === ButtonTypes.Back) {
        return `<i class="fa fa-caret-left fa-lg"></i>`;
    }
    else if (type === ButtonTypes.Save) {
        return `<i class="fa fa-save fa-lg"></i>`;
    }
    else {
        return "";
    }
}
/**
 * Generates the form type based on the type of property
 * @param giventype
 * @returns representing the type of the property
 */
function getType(giventype) {
    if (giventype === InputType.String) {
        return "text";
    }
    else if (giventype === InputType.Date) {
        return "date";
    }
    else if (giventype === InputType.Boolean) {
        return "check";
    }
    else if (giventype === InputType.Number) {
        return "number";
    }
    else {
        return "";
    }
}
/**
 * Helper function that turns the attribute object into a html attribute string for insertsion into an html tag
 * @param attributes represents html attributes in key value form
 * @returns a string of html attributes
 */
function processAttributes(attributes) {
    if (!attributes)
        return "";
    return Object.keys(attributes)
        .map(function (attribute) {
        return `${attribute}="${attributes[attribute]}"`;
    })
        .join(" ");
}
//# sourceMappingURL=helpers.js.map