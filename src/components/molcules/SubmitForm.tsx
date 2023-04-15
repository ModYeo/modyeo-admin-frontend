import React, { RefObject } from "react";
import { CreateInput } from "../../styles/styles";

type RequiredInputItems = {
  itemName: string;
  refObject: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  elementType: "input" | "textarea" | "image";
  defaultValue: string | number;
}[];

interface RegisterFormInterface {
  title: string;
  requiredInputItems: RequiredInputItems;
  isModificationAction?: boolean;
  registerNewElement: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function SubmitForm({
  title,
  requiredInputItems,
  isModificationAction = false,
  registerNewElement,
}: RegisterFormInterface) {
  return (
    <>
      <h5>{title}</h5>
      <br />
      <form onSubmit={registerNewElement}>
        {requiredInputItems.map((item) => {
          if (item.elementType === "input") {
            return (
              <span key={item.itemName}>
                <CreateInput
                  placeholder={item.itemName}
                  ref={item.refObject as RefObject<HTMLInputElement>}
                  defaultValue={item.defaultValue}
                  required
                />
              </span>
            );
          }
          if (item.elementType === "textarea") {
            return (
              <span key={item.itemName}>
                <textarea
                  placeholder={item.itemName}
                  ref={item.refObject as RefObject<HTMLTextAreaElement>}
                  defaultValue={item.defaultValue}
                  required
                />
              </span>
            );
          }
          return (
            <span key={item.itemName}>
              <input
                alt="image input"
                type="image"
                ref={item.refObject as RefObject<HTMLInputElement>}
                required
              />
            </span>
          );
        })}
        <button type="submit">{`${
          isModificationAction ? "modify" : "register"
        } new ${title}`}</button>
      </form>
      <br />
    </>
  );
}

export default SubmitForm;
export type { RequiredInputItems };
