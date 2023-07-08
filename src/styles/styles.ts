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
  background-color: #f7f7f7;
  justify-content: flex;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SignInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  &:focus {
    color: white;
    background-color: #5476d7;
  }
`;

export const TabButton = styled.button<{ isChosenTab?: boolean }>`
  height: 50px;
  transition: all 0.5s;
  color: ${({ isChosenTab }) => (isChosenTab ? "white" : "black")};
  background-color: ${({ isChosenTab }) =>
    isChosenTab ? "#5476d7" : "transparent"};
  &:hover {
    background-color: #5476d7;
    color: white;
  }
`;

export const NavBarContainer = styled.div<{ isWindowScrollOnTop: boolean }>`
  width: 100vw;
  min-width: 600px;
  height: 50px;
  padding: 0 30px;
  background-color: #f7f7f7;
  border-bottom: ${({ isWindowScrollOnTop }) =>
    isWindowScrollOnTop ? "2px solid transparent" : "2px solid #5476d7"};
  position: fixed;
  top: 0;
  z-index: 50;
`;

export const NavBarSection = styled.section`
  max-width: 1000px;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;

export const ListContainer = styled.ul`
  width: 850px;
  margin: 100px auto;
  padding: 10px;
  background-color: #eee;
  @media screen and (max-width: 1002px) {
    width: 600px;
  }
`;

export const List = styled.li`
  min-height: 125px;
  margin: 10px 0;
  padding: 10px;
  background-color: white;
`;

export const ModalBackground = styled.div<{ isModalVisible: boolean }>`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  display: ${({ isModalVisible }) => (isModalVisible ? "display" : "none")};
  z-index: 100;
`;

export const Button = styled(TabButton)`
  height: 30px;
  margin-right: 5px;
  border-radius: 8px;
  border: 1px solid #e84b35;
  background-color: transparent;
  color: #e84b35;
  &:hover {
    border: 1px solid #5476d7;
  }
`;

export const Title = styled.h2`
  margin: 8px 0;
  text-align: center;
  color: #b5b5b5;
`;
