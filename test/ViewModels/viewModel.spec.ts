import { expect } from "chai";
import { IViewModel, IViewProperty } from "../../src/helpers/vash/vashInterface";

class TestViewModel implements IViewModel {
    firstname: IViewProperty = {
        type: String,
        path: "firstname",
        name: "Firstname",
        maxlength: 10,
        minlength: 4
    };
}

describe("ViewModel Class", () => {
    it('View Model Property "firstname" should have a name of "Firstname"', () => {
        let m = new TestViewModel();
        expect(m.firstname.name).equals("Firstname");
    });

    it('View Model Property "firstname" should maxlength of "10"', () => {
        let m = new TestViewModel();
        expect(m.firstname.maxlength).equals(10);
    });

    it('View Model Property "firstname" has a minlength of "4"', () => {
        let m = new TestViewModel();
        expect(m.firstname.minlength).equals(4);
    });

    it('View Model Property "firstname" should not have property "required"', () => {
        let m = new TestViewModel();
        expect(m.firstname.required).equals(undefined);
    });
});
