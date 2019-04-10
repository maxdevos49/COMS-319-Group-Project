import { Response } from "express";
import { config } from "../../config";
import { IViewModel } from "./lib/Interfaces/IViewModel";
import { IModelResult } from "./lib/Interfaces/IModelResult";

/**
	* Creates a IModelResult for a view to use to display data
	* @param givenResponse express response object
	* @param givenModel The view model for the view
	* @param givenData The model to populate the view
	* @returns IModel result containing all the data structured for the view to use
	*/
export function View(givenResponse: Response, givenModel?: IViewModel, givenData?: any): IModelResult {
	//process auth
	let modelResult: IModelResult = {
		authentication: !givenResponse.locals.authentication ? { role: ["public"] } : givenResponse.locals.authentication
	};

	//process viewmodel
	modelResult.viewModel = givenModel;

	//process data
	modelResult.data = givenData;

	// process validation errors
	if (givenResponse.locals.validation) {
		modelResult.validation = givenResponse.locals.validation;
	}

	return modelResult;
}