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

export const ListContainer = styled.ul`
  width: 450px;
  margin: 100px auto;
  padding: 10px;
  background-color: #eee;
`;

export const List = styled.li`
  margin: 10px 0;
  padding: 10px;
  background-color: white;
  display: flex;
  justify-content: space-between;
`;

export const CategoryInput = styled(SignInput)`
  width: 50%;
`;

export const ModalBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;
