import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
  h1, h2, h3, h4, h5 {
    margin: 0;
    text-align: center;
  }
  button {
    cursor: pointer;
  }
`;
