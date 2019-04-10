import { IViewModel } from "./Interfaces/IViewModel";
import { IViewProperty } from "./Interfaces/IViewProperty";
import { validation as Validation } from "./validation";
import { InputType } from "./Enums/InputType";

const vash = require("vash");

/**
 * Module containing useful vash helpers for faster page building
 */

/**
 * LabelFor()
 * @param property represents the property to select
 * @param attributes represents html attributes
 * @returns html markup representing a label
 */
vash.helpers.LabelFor = function (model: Function, attributes?: any) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

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
vash.helpers.TextBoxFor = function (model: Function, value?: string | number, attributes?: any) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

	//dont throw undefined for lack of data
	if (this.model.data) value = model(this.model.data);

	Object.assign(attributes, Validation(property));

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
vash.helpers.HiddenFor = function (model: Function, value?: string | number) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

	//dont throw undefined for lack of data
	if (this.model.data) value = model(this.model.data);

	//dont throw undefined for lack of data
	if (this.model.data) value = model(this.model.data);

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
vash.helpers.EditorFor = function (model: Function, value?: string, attributes?: any) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

	//dont throw undefined for lack of data
	if (this.model.data) value = model(this.model.data);

	let type: string = getType(property.type.name as InputType); //property.subtype ? property.subtype :

	Object.assign(attributes, Validation(property));

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
vash.helpers.PasswordBoxFor = function (model: Function, value?: string, attributes: any = {}) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

	Object.assign(attributes, Validation(property));

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
vash.helpers.ValidationMessageFor = function (model: Function, error?: string, attributes?: any) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

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
vash.helpers.DisplayFor = function (model: Function) {
	let value: any = model(this.model.data);

	//0 is falsy but we still want to display it so lets make it a string
	if (typeof value === "number") if (value === 0) value.toString();

	this.buffer.push(value || "");
};

/**
 * ValidationSummary()
 * Displays any validation errors to the page
 */
vash.helpers.ValidationSummary = function () {
	if (this.model.validation) {

		this.model.validation.forEach((info: any) => {

			this.buffer.push(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Validation: </strong>${info.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `);

		});
	}
}

/**
 * DisplayNameFor()
 * @param model the propery
 * @returns the name of a model property
 */
vash.helpers.DisplayNameFor = function (model: Function) {
	let m: IViewModel = new this.model.viewModel();
	let property: IViewProperty = model(m);

	this.buffer.push(property.name || property.path);
};

/**
 * @html.Navigator();
 * @param type string represnting the button type
 * @param text string representing what shoulf be shown on the button
 * @param route string representing the route for the link
 * @param attributes object containing key value pairs of html attributes
 */
vash.helpers.Navigator = function (type: ButtonTypes, text?: string, route?: string, attributes: any = {}) {
	if (text) text = " " + text;
	else text = "";

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
vash.helpers.Input = function (type: ButtonTypes, text?: string, attributes: any = {}) {
	if (text) {
		text = " " + text;
	} else {
		text = "";
	}

	attributes.class += ` btn ${typeClass(type)}"`;

	this.buffer.push(`
        <button ${processAttributes(attributes)}>
        ${typeIcon(type)}${text || ""}
        </button>
        `);
};

enum ButtonTypes {
	Create = 0,
	Edit,
	Details,
	Delete,
	Download,
	Save,
	Back
}

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
function typeClass(type: ButtonTypes): string {
	if (type === ButtonTypes.Create) {
		return "btn-primary";
	} else if (type === ButtonTypes.Edit) {
		return "btn-warning";
	} else if (type === ButtonTypes.Details) {
		return "btn-info";
	} else if (type === ButtonTypes.Download) {
		return "btn-warning";
	} else if (type === ButtonTypes.Delete) {
		return "btn-danger";
	} else if (type === ButtonTypes.Back) {
		return "btn-secondary";
	} else if (type == ButtonTypes.Save) {
		return "btn-success";
	}
	return "btn-success";
}

/**
 * @param type
 * @returns representing the icon html
 */
function typeIcon(type: ButtonTypes): string {
	if (type === ButtonTypes.Create) {
		return `<i class="fa fa-plus fa-lg"></i>`;
	} else if (type === ButtonTypes.Edit) {
		return `<i class="fa fa-edit fa-lg"></i>`;
	} else if (type === ButtonTypes.Details) {
		return `<i class="fa fa-info-circle fa-lg"></i>`;
	} else if (type === ButtonTypes.Delete) {
		return `<i class="fa fa-trash fa-lg"></i>`;
	} else if (type === ButtonTypes.Download) {
		return '<i class="fa fa-save fa-lg"></i>';
	} else if (type === ButtonTypes.Back) {
		return `<i class="fa fa-caret-left fa-lg"></i>`;
	} else if (type === ButtonTypes.Save) {
		return `<i class="fa fa-save fa-lg"></i>`;
	} else {
		return "";
	}
}

/**
 * Generates the form type based on the type of property
 * @param giventype
 * @returns representing the type of the property
 */
function getType(giventype: InputType): string {
	if (giventype === InputType.String) {
		return "text";
	} else if (giventype === InputType.Date) {
		return "date";
	} else if (giventype === InputType.Boolean) {
		return "check";
	} else if (giventype === InputType.Number) {
		return "number";
	} else {
		return "";
	}
}

/**
 * Helper function that turns the attribute object into a html attribute string for insertsion into an html tag
 * @param attributes represents html attributes in key value form
 * @returns a string of html attributes
 */
function processAttributes(attributes?: any): string {
	if (!attributes) return "";

	return Object.keys(attributes)
		.map(function (attribute) {
			return `${attribute}="${attributes[attribute]}"`;
		})
		.join(" ");
}
