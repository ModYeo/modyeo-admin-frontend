import React, { useCallback } from "react";
import { RequiredInputItem } from "../molcules/SubmitForm";

import useSubmitForm from "../../hooks/common/useSubmitForm";

import Button from "../atoms/Button";
import Input from "../atoms/Input";

function Form({
  path,
  requiredInputItems,
}: {
  path: string;
  requiredInputItems: RequiredInputItem[];
}) {
  const { handleOnSubmit } = useSubmitForm(path, requiredInputItems);

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        {requiredInputItems.map((item, idx) => {
          if (item.elementType === "input") {
            return <Input key={item.itemName} item={item} />;
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
