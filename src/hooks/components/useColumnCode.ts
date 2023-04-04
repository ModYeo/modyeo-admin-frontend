import { useCallback, useRef, useState } from "react";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import { IColumCode, IDetailedColumnCode } from "../../type/types";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

interface UseColumnCode {
  columnCodes: IColumCode[];
  detailedColumCode: IDetailedColumnCode | null;
  toBeModifiedColumnCodeIndex: number;
  codeInputRef: React.RefObject<HTMLInputElement>;
  columnNameInputRef: React.RefObject<HTMLInputElement>;
  codeDescriptionInputRef: React.RefObject<HTMLInputElement>;
  isColumnCodeBeingModified: boolean;
  fetchColumnCodes: () => Promise<void>;
  registerNewColumnCode: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteColumnCode: (
    columnCodeId: number,
    targetColumnCodeIndex: number,
  ) => Promise<void>;
  fetchDetailedColumnCode: (columnCodeId: number) => Promise<void>;
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

  const columnNameInputRef = useRef<HTMLInputElement>(null);

  const codeDescriptionInputRef = useRef<HTMLInputElement>(null);

  const initializeAdvertisementsList = useCallback(
    (collectionsList: Array<IColumCode>) => {
      setColumnCodes(collectionsList);
    },
    [],
  );

  const fetchColumnCodes = useCallback(async () => {
    const fetchedColumnCodes = await apiManager.fetchData<IColumCode>(
      routes.server.column,
    );
    if (fetchedColumnCodes) initializeAdvertisementsList(fetchedColumnCodes);
  }, [initializeAdvertisementsList]);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return [
      codeInputRef.current?.value,
      columnNameInputRef.current?.value,
      codeDescriptionInputRef.current?.value,
    ];
  }, []);

  const addNewColumnCodeInList = useCallback((newColumnCode: IColumCode) => {
    setColumnCodes((columnCodesList) => [newColumnCode, ...columnCodesList]);
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

  const registerNewColumnCode = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [codeInputValue, columnNameInputValue, codeDescriptionInputValue] =
        extractInputValuesFromElementsRef();

      if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
        const newColumnCodeId = await apiManager.postNewDataElem<{}>(
          // TODO: 추후에 제네릭에 알맞은 타입 넣어주기.
          routes.server.column,
          {
            code: codeInputValue,
            columnCodeName: columnNameInputValue,
            description: codeDescriptionInputValue,
          },
        );
        if (newColumnCodeId) {
          addNewColumnCodeInList({
            columnCodeId: newColumnCodeId,
            code: codeInputValue,
            columnCodeName: columnNameInputValue,
            description: codeDescriptionInputValue,
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      addNewColumnCodeInList,
      initializeInputValues,
    ],
  );

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
    const isColumnCodeDeleteSuccessful = await apiManager.deleteData(
      routes.server.column,
      columnCodeId,
    );
    if (isColumnCodeDeleteSuccessful)
      removeColumnCodeInList(targetColumnCodeIndex);
  };

  const fetchDetailedColumnCode = useCallback(
    async (columnCodeId: number) => {
      const fetchedDetailedColumnCode =
        await apiManager.fetchDetailedData<IDetailedColumnCode>(
          routes.server.column,
          columnCodeId,
        );
      if (fetchedDetailedColumnCode)
        setDetailedColumnCode(fetchedDetailedColumnCode);
    },
    [setDetailedColumnCode],
  );

  const hideDetailedColumnCodeModal = useCallback(() => {
    setDetailedColumnCode(null);
  }, []);

  const updateTargetColumnCode = () => {
    const [codeInputValue, columnNameInputValue, codeDescriptionInputValue] =
      extractInputValuesFromElementsRef();

    if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
      setColumnCodes((columnCodesList) => {
        const targetColumnCode = columnCodesList[toBeModifiedColumnCodeIndex];
        targetColumnCode.code = codeInputValue;
        targetColumnCode.columnCodeName = columnNameInputValue;
        targetColumnCode.description = codeDescriptionInputValue;
        return [...columnCodesList];
      });
    }
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

    if (codeInputValue && columnNameInputValue && codeDescriptionInputValue) {
      const { columnCodeId } = columnCodes[toBeModifiedColumnCodeIndex];

      const modifiedColumnCodeId = await apiManager.modifyData<IColumCode>(
        routes.server.column,
        {
          columnCodeId,
          code: codeInputValue,
          columnCodeName: columnNameInputValue,
          description: codeDescriptionInputValue,
        },
      );
      if (modifiedColumnCodeId) {
        updateTargetColumnCode();
        toggleColumnCodeModificationModal();
        initializeInputValues();
      }
    }
  };

  const isColumnCodeBeingModified =
    toBeModifiedColumnCodeIndex !== NOTHING_BEING_MODIFIED;

  return {
    columnCodes,
    detailedColumCode,
    toBeModifiedColumnCodeIndex,
    codeInputRef,
    columnNameInputRef,
    codeDescriptionInputRef,
    isColumnCodeBeingModified,
    fetchColumnCodes,
    registerNewColumnCode,
    deleteColumnCode,
    fetchDetailedColumnCode,
    hideDetailedColumnCodeModal,
    toggleColumnCodeModificationModal,
    modifyColumnCode,
  };
};

export default useColumnCode;
