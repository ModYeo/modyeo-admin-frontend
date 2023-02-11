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
  height: 250px;
  padding: 12px;
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
`;

export const SignButton = styled.button`
  height: 50px;
`;

export const NavBarContainer = styled.div`
  width: 100vw;
  height: 50px;
  padding: 0 30px;
  background-color: #eee;
`;

export const NavBarSection = styled.section`
  max-width: 1000px;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;
