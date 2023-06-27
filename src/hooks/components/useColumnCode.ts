import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ObjectType } from "../../components/atoms/Card";

import apiManager from "../../modules/apiManager";

import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";

import routes from "../../constants/routes";

interface IColumCode {
  code: string;
  columnCodeId: number;
  columnCodeName: string;
  description: string;
}

interface INewColumnCode extends Omit<IColumCode, "columnCodeId"> {}

interface IDetailedColumnCode extends IColumCode {
  createdTime: null;
  email: null;
}

interface UseColumnCode {
  columnCodes: IColumCode[];
  requiredInputItems: RequiredInputItems;
  registerNewColumnCode: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteColumnCode: (
    columnCodeId: number,
    targetColumnCodeIndex: number,
  ) => Promise<void>;
  initializeDetailedColumnCode: (columnCodeId: number) => Promise<void>;
  toggleColumnCodeModificationModal: (targetColumnCodeIndex?: number) => void;
}

const useColumnCode = (): UseColumnCode => {
  const {
    isModalVisible,
    closeModalAndInitializeModificationForm,
    injectModificationModels,
    injectDetailedElement,
  } = useContext(MODAL_CONTEXT);

  const [columnCodes, setColumnCodes] = useState<Array<IColumCode>>([]);

  const toBeModifiedColumnCodeIndex = useRef<number>(NOTHING_BEING_MODIFIED);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const codeModifyInputRef = useRef<HTMLInputElement>(null);

  const columnNameInputRef = useRef<HTMLInputElement>(null);

  const columnNameModifyInputRef = useRef<HTMLInputElement>(null);

  const codeDescriptionInputRef = useRef<HTMLInputElement>(null);

  const codeDescriptionModifyInputRef = useRef<HTMLInputElement>(null);

  const fetchColumnCodes = useCallback(async () => {
    return apiManager.fetchData<IColumCode>(routes.server.column);
  }, []);

  const initializeAdvertisementsList = useCallback(async () => {
    const fetchedColumnCodes = await fetchColumnCodes();
    if (fetchedColumnCodes) setColumnCodes(fetchedColumnCodes);
  }, [fetchColumnCodes]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return toBeModifiedColumnCodeIndex.current !== NOTHING_BEING_MODIFIED
      ? [
          codeModifyInputRef.current?.value,
          columnNameModifyInputRef.current?.value,
          codeDescriptionModifyInputRef.current?.value,
        ]
      : [
          codeInputRef.current?.value,
          columnNameInputRef.current?.value,
          codeDescriptionInputRef.current?.value,
        ];
  }, []);

  const initializeInputValues = useCallback(() => {
    const codeCurrent = codeInputRef.current;
    const columnNameCurrent = columnNameInputRef.current;
    const codeDescriptionCurrent = codeDescriptionInputRef.current;
    if (codeCurrent && columnNameCurrent && codeDescriptionCurrent) {
      codeCurrent.value = "";
      columnNameCurrent.value = "";
      codeDescriptionCurrent.value = "";
    }
  }, []);

  const addNewColumnCodeInList = useCallback((newColumnCode: IColumCode) => {
    setColumnCodes((columnCodesList) => [newColumnCode, ...columnCodesList]);
  }, []);

  const sendPostColumnCodeRequest = useCallback(
    <T extends object>(newColumnCode: T) => {
      return apiManager.postNewDataElem<T>(routes.server.column, newColumnCode);
    },
    [],
  );

  const registerNewColumnCode = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [codeInputValue, columnNameInputValue, codeDescriptionInputValue] =
        extractInputValuesFromElementsRef();

      if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
        const newColumnCode = {
          code: codeInputValue,
          columnCodeName: columnNameInputValue,
          description: codeDescriptionInputValue,
        };
        const newColumnCodeId = await sendPostColumnCodeRequest<INewColumnCode>(
          newColumnCode,
        );
        if (newColumnCodeId) {
          addNewColumnCodeInList({
            ...newColumnCode,
            columnCodeId: newColumnCodeId,
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      sendPostColumnCodeRequest,
      addNewColumnCodeInList,
      initializeInputValues,
    ],
  );

  const sendDeleteColumnCodeRequest = useCallback((columnCodeId: number) => {
    return apiManager.deleteData(routes.server.column, columnCodeId);
  }, []);

  const removeColumnCodeInList = useCallback(
    (targetColumnCodeIndex: number) => {
      setColumnCodes((columnCodeList) => {
        columnCodeList.splice(targetColumnCodeIndex, 1);
        return [...columnCodeList];
      });
    },
    [setColumnCodes],
  );

  const deleteColumnCode = async (
    columnCodeId: number,
    targetColumnCodeIndex: number,
  ) => {
    const confirmColumnDelete = window.confirm(
      "정말 해당 칼럼을 삭제하시겠습니끼?",
    );
    if (!confirmColumnDelete) return;
    const isColumnCodeDeleteSuccessful = await sendDeleteColumnCodeRequest(
      columnCodeId,
    );
    if (isColumnCodeDeleteSuccessful)
      removeColumnCodeInList(targetColumnCodeIndex);
  };

  const fetchDetailedColumnCode = useCallback((columnCodeId: number) => {
    return apiManager.fetchDetailedData<IDetailedColumnCode>(
      routes.server.column,
      columnCodeId,
    );
  }, []);

  const initializeDetailedColumnCode = useCallback(
    async (columnCodeId: number) => {
      const fetchedDetailedColumnCode = await fetchDetailedColumnCode(
        columnCodeId,
      );
      if (fetchedDetailedColumnCode)
        injectDetailedElement(
          fetchedDetailedColumnCode as unknown as ObjectType,
        );
    },
    [fetchDetailedColumnCode, injectDetailedElement],
  );

  const sendColumnCodePatchRequest = useCallback(
    <T extends object>(modifiedColumnCode: T) => {
      return apiManager.modifyData<T>(routes.server.column, modifiedColumnCode);
    },
    [],
  );

  const updateTargetColumnCode = (modifiedColumnCode: IColumCode) => {
    setColumnCodes((columnCodesList) => {
      columnCodesList.splice(
        toBeModifiedColumnCodeIndex.current,
        1,
        modifiedColumnCode,
      );
      return [...columnCodesList];
    });
  };

  const modifyColumnCode = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [codeInputValue, columnNameInputValue, codeDescriptionInputValue] =
        extractInputValuesFromElementsRef();

      const { columnCodeId } = columnCodes[toBeModifiedColumnCodeIndex.current];

      if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
        const modifiedColumnCode = {
          columnCodeId,
          code: codeInputValue,
          columnCodeName: columnNameInputValue,
          description: codeDescriptionInputValue,
        };
        const modifiedColumnCodeId =
          await sendColumnCodePatchRequest<IColumCode>(modifiedColumnCode);
        if (columnCodeId === modifiedColumnCodeId) {
          updateTargetColumnCode(modifiedColumnCode);
          closeModalAndInitializeModificationForm();
        }
      }
    },
    [
      columnCodes,
      extractInputValuesFromElementsRef,
      sendColumnCodePatchRequest,
      closeModalAndInitializeModificationForm,
    ],
  );

  const makeRequiredInputElements = useCallback(
    (targetIndex?: number): RequiredInputItems => {
      const isColumnCodeModifiyAction =
        targetIndex !== undefined && targetIndex !== NOTHING_BEING_MODIFIED;
      return [
        {
          itemName: "code",
          refObject: isColumnCodeModifiyAction
            ? codeModifyInputRef
            : codeInputRef,
          elementType: "input",
          defaultValue: isColumnCodeModifiyAction
            ? columnCodes[toBeModifiedColumnCodeIndex.current].code
            : "",
        },
        {
          itemName: "column name",
          refObject: isColumnCodeModifiyAction
            ? columnNameModifyInputRef
            : columnNameInputRef,
          elementType: "input",
          defaultValue: isColumnCodeModifiyAction
            ? columnCodes[toBeModifiedColumnCodeIndex.current].columnCodeName
            : "",
        },
        {
          itemName: "description",
          refObject: isColumnCodeModifiyAction
            ? codeDescriptionModifyInputRef
            : codeDescriptionInputRef,
          elementType: "input",
          defaultValue: isColumnCodeModifiyAction
            ? columnCodes[toBeModifiedColumnCodeIndex.current].description
            : "",
        },
      ];
    },
    [columnCodes],
  );

  const requiredInputItems = useMemo(
    () => makeRequiredInputElements(),
    [makeRequiredInputElements],
  );

  const toggleColumnCodeModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined) {
        toBeModifiedColumnCodeIndex.current = targetIndex;
        const requiredInputElementsParam =
          makeRequiredInputElements(targetIndex);
        injectModificationModels({
          requiredInputElementsParam,
          elementModificationFunctionParam: modifyColumnCode,
        });
      } else {
        toBeModifiedColumnCodeIndex.current = NOTHING_BEING_MODIFIED;
        closeModalAndInitializeModificationForm();
      }
    },
    [
      modifyColumnCode,
      makeRequiredInputElements,
      injectModificationModels,
      closeModalAndInitializeModificationForm,
    ],
  );

  useEffect(() => {
    initializeAdvertisementsList();
  }, [initializeAdvertisementsList]);

  useEffect(() => {
    if (!isModalVisible)
      toBeModifiedColumnCodeIndex.current = NOTHING_BEING_MODIFIED;
  }, [isModalVisible]);

  return {
    columnCodes,
    requiredInputItems,
    registerNewColumnCode,
    deleteColumnCode,
    initializeDetailedColumnCode,
    toggleColumnCodeModificationModal,
  };
};

export default useColumnCode;
