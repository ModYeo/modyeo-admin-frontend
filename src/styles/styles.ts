import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignForm = styled.form`
  width: 350px;
  height: 200px;
  padding: 12px;
  box-sizing: border-box;
  background-color: #eee;
  justify-content: flex;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SignInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
`;

export const SignButton = styled.button`
  height: 50px;
`;
