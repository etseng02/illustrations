import React from "react";
import ReactDOM from 'react-dom';

import HostRoom from "../HostRoom";

import '@testing-library/jest-dom/extend-expect'

import { 
  fireEvent,
  waitForElement,
  getByText,
  render,
  cleanup 
} 
  from "@testing-library/react"; 



afterEach(cleanup);

describe("Host Room", () => {

  it("Displays Room Code when rendered", () => {
    const { getByText } = render(<HostRoom />);

    expect(getByText("Room Code:")).toBeInTheDocument();
  });

});//end of describe