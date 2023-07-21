import React from "react";
import styled from "styled-components";
import { RequiredInputItem } from "./SubmitForm";
import COLOR_CONST from "../../constants/colorConst";
import Button from "../atoms/Button";

const Input = styled.input`
  width: 80%;
  height: 40px;
  padding: 10px;
  border: 1px solid ${COLOR_CONST.BLUE};
  border-radius: 5px;
`;

function Form({
  requiredInputItems,
}: {
  requiredInputItems: RequiredInputItem[];
}) {
  return (
    <>
      <form>
        {requiredInputItems.map((item, idx) => {
          if (item.elementType === "input") {
            return (
              <Input
                defaultValue={item.defaultValue}
                placeholder={item.itemName}
              />
            );
          }
          return null;
        })}
      </form>
      <div>
        <Button type="button" size="lg" bgColor="red">
          back
        </Button>
      </div>
    </>
  );
}

export default Form;
