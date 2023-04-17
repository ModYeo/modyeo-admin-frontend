import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";
import { RequiredInputItems } from "../../components/molcules/SubmitForm";

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
  detailedColumCode: IDetailedColumnCode | null;
  requiredInputItems: RequiredInputItems;
  IS_COLUMNCODE_BEING_MODIFIED: boolean;
  registerNewColumnCode: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteColumnCode: (
    columnCodeId: number,
    targetColumnCodeIndex: number,
  ) => Promise<void>;
  initializeDetailedColumnCode: (columnCodeId: number) => Promise<void>;
  hideDetailedColumnCodeModal: () => void;
  toggleColumnCodeModificationModal: (targetColumnCodeIndex?: number) => void;
  modifyColumnCode: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useColumnCode = (): UseColumnCode => {
  const [columnCodes, setColumnCodes] = useState<Array<IColumCode>>([]);

  const [detailedColumCode, setDetailedColumnCode] =
    useState<IDetailedColumnCode | null>(null);

  const [toBeModifiedColumnCodeIndex, setToBeModifiedColumnCodeIndex] =
    useState(NOTHING_BEING_MODIFIED);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const codeModifyInputRef = useRef<HTMLInputElement>(null);

  const columnNameInputRef = useRef<HTMLInputElement>(null);

  const columnNameModifyInputRef = useRef<HTMLInputElement>(null);

  const codeDescriptionInputRef = useRef<HTMLInputElement>(null);

  const codeDescriptionModifyInputRef = useRef<HTMLInputElement>(null);

  const IS_COLUMNCODE_BEING_MODIFIED =
    toBeModifiedColumnCodeIndex !== NOTHING_BEING_MODIFIED;

  const requiredInputItems = useMemo((): RequiredInputItems => {
    return [
      {
        itemName: "code",
        refObject: IS_COLUMNCODE_BEING_MODIFIED
          ? codeModifyInputRef
          : codeInputRef,
        elementType: "input",
        defaultValue: IS_COLUMNCODE_BEING_MODIFIED
          ? columnCodes[toBeModifiedColumnCodeIndex].code
          : "",
      },
      {
        itemName: "column name",
        refObject: IS_COLUMNCODE_BEING_MODIFIED
          ? columnNameModifyInputRef
          : columnNameInputRef,
        elementType: "input",
        defaultValue: IS_COLUMNCODE_BEING_MODIFIED
          ? columnCodes[toBeModifiedColumnCodeIndex].columnCodeName
          : "",
      },
      {
        itemName: "description",
        refObject: IS_COLUMNCODE_BEING_MODIFIED
          ? codeDescriptionModifyInputRef
          : codeDescriptionInputRef,
        elementType: "input",
        defaultValue: IS_COLUMNCODE_BEING_MODIFIED
          ? columnCodes[toBeModifiedColumnCodeIndex].description
          : "",
      },
    ];
  }, [IS_COLUMNCODE_BEING_MODIFIED, columnCodes, toBeModifiedColumnCodeIndex]);

  const fetchColumnCodes = useCallback(async () => {
    return apiManager.fetchData<IColumCode>(routes.server.column);
  }, []);

  const initializeAdvertisementsList = useCallback(async () => {
    const fetchedColumnCodes = await fetchColumnCodes();
    if (fetchedColumnCodes) setColumnCodes(fetchedColumnCodes);
  }, [fetchColumnCodes]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return IS_COLUMNCODE_BEING_MODIFIED
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
  }, [IS_COLUMNCODE_BEING_MODIFIED]);

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
        setDetailedColumnCode(fetchedDetailedColumnCode);
    },
    [fetchDetailedColumnCode, setDetailedColumnCode],
  );

  const hideDetailedColumnCodeModal = useCallback(() => {
    setDetailedColumnCode(null);
  }, []);

  const sendColumnCodePatchRequest = useCallback(
    <T extends object>(modifiedColumnCode: T) => {
      return apiManager.modifyData<T>(routes.server.column, modifiedColumnCode);
    },
    [],
  );

  const updateTargetColumnCode = (modifiedColumnCode: IColumCode) => {
    setColumnCodes((columnCodesList) => {
      columnCodesList.splice(
        toBeModifiedColumnCodeIndex,
        1,
        modifiedColumnCode,
      );
      return [...columnCodesList];
    });
  };

  const toggleColumnCodeModificationModal = useCallback(
    (targetColumnCodeIndex?: number) => {
      if (targetColumnCodeIndex !== undefined)
        setToBeModifiedColumnCodeIndex(targetColumnCodeIndex);
      else setToBeModifiedColumnCodeIndex(NOTHING_BEING_MODIFIED);
    },
    [setToBeModifiedColumnCodeIndex],
  );

  const modifyColumnCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [codeInputValue, columnNameInputValue, codeDescriptionInputValue] =
      extractInputValuesFromElementsRef();

    const { columnCodeId } = columnCodes[toBeModifiedColumnCodeIndex];

    if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
      const modifiedColumnCode = {
        columnCodeId,
        code: codeInputValue,
        columnCodeName: columnNameInputValue,
        description: codeDescriptionInputValue,
      };
      const modifiedColumnCodeId = await sendColumnCodePatchRequest<IColumCode>(
        modifiedColumnCode,
      );
      if (columnCodeId === modifiedColumnCodeId) {
        updateTargetColumnCode(modifiedColumnCode);
        toggleColumnCodeModificationModal();
        initializeInputValues();
      }
    }
  };

  useEffect(() => {
    initializeAdvertisementsList();
  }, [initializeAdvertisementsList]);

  return {
    columnCodes,
    detailedColumCode,
    requiredInputItems,
    IS_COLUMNCODE_BEING_MODIFIED,
    registerNewColumnCode,
    deleteColumnCode,
    initializeDetailedColumnCode,
    hideDetailedColumnCodeModal,
    toggleColumnCodeModificationModal,
    modifyColumnCode,
  };
};

export default useColumnCode;
