import React from "react";
import { CreateInput } from "../../styles/styles";

type RequiredInputItems = {
  itemName: string;
  refObject: React.RefObject<HTMLInputElement>;
  defaultValue: string | number;
}[];

interface RegisterFormInterface {
  title: string;
  requiredInputItems: RequiredInputItems;
  registerNewElement: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function SubmitForm({
  title,
  requiredInputItems,
  registerNewElement,
}: RegisterFormInterface) {
  return (
    <>
      <h5>{title}</h5>
      <br />
      <form onSubmit={registerNewElement}>
        {requiredInputItems.map((item) => (
          <span key={item.itemName}>
            <CreateInput
              placeholder={item.itemName}
              ref={item.refObject}
              defaultValue={item.defaultValue}
              required
            />
          </span>
        ))}
        <button type="submit">{`register new ${title}`}</button>
      </form>
    </>
  );
}

export default SubmitForm;
export type { RequiredInputItems };
