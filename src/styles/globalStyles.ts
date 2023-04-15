import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  body, h1, h2, h3, h4, h5, p {
    margin: 0;
  }
  ul {
    padding-left: 0;
    list-style: none;
  }
`;

export default GlobalStyle;
