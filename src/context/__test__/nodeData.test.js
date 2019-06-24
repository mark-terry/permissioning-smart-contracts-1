// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import { NodeDataProvider } from "../nodeData";

describe("<NodeDataProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <NodeDataProvider>
                <div className="test" />
            </NodeDataProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
