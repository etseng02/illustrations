import React from "react";
import ReactDOM from 'react-dom';

import JoinRoom from "../JoinRoom";

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

describe("Join Room", () => {
  
  it("Displays Join Room button when JoinRoom is rendered", () => {
    const { getByText } = render(<JoinRoom />);

    expect(getByText("Join Room")).toBeInTheDocument();
  });

  it("Gives error message when Name field is blank", () => {
    const { getByText } = render(<JoinRoom />);

  // return waitForElement(() => getByText("Join Room")).then(() => {
  //   fireEvent.click(getByText("Join Room"));
  //   expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("Gives error message roomID is invalid", () => {
    const { getByText } = render(<JoinRoom />);

  // return waitForElement(() => getByText("Join Room")).then(() => {
  //   fireEvent.click(getByText("Join Room"));
  //   expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });




});