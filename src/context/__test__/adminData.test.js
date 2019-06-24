// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import { AdminDataProvider } from "../adminData";

describe("<AdminDataProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <AdminDataProvider>
                <div className="test" />
            </AdminDataProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
