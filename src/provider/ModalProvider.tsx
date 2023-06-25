import React, { createContext, useCallback, useEffect, useState } from "react";
import useModal from "../hooks/common/useModal";
import { ModalBackground } from "../styles/styles";
import Modal from "../components/commons/Modal";
import SubmitForm, {
  RequiredInputItems,
} from "../components/molcules/SubmitForm";
import { ObjectType } from "../components/atoms/Card";

type ElementModificationFunction = (
  e: React.FormEvent<HTMLFormElement>,
) => Promise<void>;

interface ModalContext {
  showModal: () => void;
  closeModalAndInitializeModificationForm: () => void;
  injectDetailedElement: (detailedElementParam: ObjectType) => void;
  injectModificationModels: (modificationParam?: {
    requiredInputElementsParam: RequiredInputItems;
    elementModificationFunctionParam: ElementModificationFunction;
  }) => void;
}

const MODAL_CONTEXT = createContext<ModalContext>({
  showModal: () => null,
  closeModalAndInitializeModificationForm: () => null,
  injectDetailedElement: () => null,
  injectModificationModels: () => null,
});

function ModalProvider({ children }: { children: React.ReactNode }) {
  const { isModalVisible, showModal, hideModal } = useModal();

  const [detailedElement, setDetailedElement] = useState<ObjectType | null>(
    null,
  );

  const [requiredInputElements, setRequiredInputElements] =
    useState<RequiredInputItems | null>(null);

  const [elementModificationFunction, setElementModificationFuction] =
    useState<ElementModificationFunction | null>(null);

  const injectDetailedElement = useCallback(
    (detailedElementParam: ObjectType | null) =>
      setDetailedElement(detailedElementParam),
    [setDetailedElement],
  );

  const closeModalAndInitializeModificationForm = useCallback(() => {
    setRequiredInputElements(null);
    setElementModificationFuction(null);
    hideModal();
  }, [hideModal]);

  const injectModificationModels = useCallback(
    (modificationParam?: {
      requiredInputElementsParam: RequiredInputItems;
      elementModificationFunctionParam: ElementModificationFunction;
    }) => {
      if (modificationParam) {
        console.log(typeof modificationParam.elementModificationFunctionParam);
        const { requiredInputElementsParam, elementModificationFunctionParam } =
          modificationParam;
        console.log(elementModificationFunctionParam.toString());
        setRequiredInputElements(requiredInputElementsParam);
        setElementModificationFuction(() => elementModificationFunctionParam);
      } else {
        closeModalAndInitializeModificationForm();
      }
    },
    [closeModalAndInitializeModificationForm],
  );

  console.log(elementModificationFunction);

  return (
    <MODAL_CONTEXT.Provider
      value={{
        showModal,
        closeModalAndInitializeModificationForm,
        injectDetailedElement,
        injectModificationModels,
      }}
    >
      {children}
      <ModalBackground
        onClick={closeModalAndInitializeModificationForm}
        isModalVisible={isModalVisible}
      >
        <Modal>
          {requiredInputElements && elementModificationFunction && (
            <SubmitForm
              requiredInputItems={requiredInputElements}
              registerNewElement={elementModificationFunction}
              isModificationAction={true}
            />
          )}
        </Modal>
      </ModalBackground>
    </MODAL_CONTEXT.Provider>
  );
}

export default ModalProvider;
export { MODAL_CONTEXT };
