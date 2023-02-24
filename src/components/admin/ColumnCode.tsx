import React, { useEffect, useRef, useState } from "react";
import columnAPIManager from "../../modules/columnAPI";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import { IColumCode, IDetailedColumnCode } from "../../type/types";
import Modal from "../commons/Modal";

function ColumnCode() {
  const [columnCodes, setColumnCodes] = useState<Array<IColumCode>>([]);
  const [clickedColumnCode, setClickedColumnCode] =
    useState<IDetailedColumnCode | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const columnCodeNameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const deleteColumnCode = async (columnCodeId: number) => {
    const confirmColumnDelete = window.confirm(
      "정말 해당 칼럼을 삭제하시겠습니끼?",
    );
    if (!confirmColumnDelete) return;
    const isColumnCodeDeleteSuccessful =
      await columnAPIManager.deleteColumnCode(columnCodeId);
    if (isColumnCodeDeleteSuccessful) {
      const targetIndex = columnCodes.findIndex(
        (columnCode) => columnCode.columnCodeId === columnCodeId,
      );
      columnCodes.splice(targetIndex, 1);
      setColumnCodes([...columnCodes]);
    }
  };
  const fetchDetailedColumnInfo = async (columnCodeId: number) => {
    const fetchedDetailedColumnCode =
      await columnAPIManager.fetchDetailedColumnCodeInfo(columnCodeId);
    if (fetchedDetailedColumnCode)
      setClickedColumnCode(fetchedDetailedColumnCode);
  };
  const handleOnColumnCodeFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const codeInputRefValue = codeInputRef.current?.value;
    const columnCodeNameInputRefValue = columnCodeNameInputRef.current?.value;
    const descriptionInputRefValue = descriptionInputRef.current?.value;
    if (
      codeInputRefValue &&
      columnCodeNameInputRefValue &&
      descriptionInputRefValue
    ) {
      const newColumnCode = await columnAPIManager.createNewColumnCode(
        codeInputRefValue,
        columnCodeNameInputRefValue,
        descriptionInputRefValue,
      );
      // TODO: update column code list with setColumnCodes and new column code.
      if (newColumnCode) {
        codeInputRef.current.value = "";
        columnCodeNameInputRef.current.value = "";
        descriptionInputRef.current.value = "";
      }
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedColumnCodes = await columnAPIManager.fetchAllColumnCode();
      if (fetchedColumnCodes) setColumnCodes(fetchedColumnCodes);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>column codes list</h5>
      <br />
      <form onSubmit={handleOnColumnCodeFormSubmit}>
        <CreateInput placeholder="code" ref={codeInputRef} />
        <CreateInput
          placeholder="column code name"
          ref={columnCodeNameInputRef}
        />
        <CreateInput placeholder="desc" ref={descriptionInputRef} />
        <button type="submit">make a new column code</button>
      </form>
      <br />
      {columnCodes.map((columnCode) => {
        return (
          <List key={columnCode.columnCodeId}>
            <div>
              <div>code - {columnCode.code}</div>
              <div>name - {columnCode.columnCodeName}</div>
              <div>desc - {columnCode.description}</div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fetchDetailedColumnInfo(columnCode.columnCodeId)}
              >
                about
              </button>
              <button type="button">modify</button>
              <button
                type="button"
                onClick={() => deleteColumnCode(columnCode.columnCodeId)}
              >
                delete
              </button>
            </div>
          </List>
        );
      })}
      {clickedColumnCode && (
        <ModalBackground onClick={() => setClickedColumnCode(null)}>
          <Modal width={350} height={150}>
            <div>
              <div>
                <h5>column code {clickedColumnCode.code}</h5>
              </div>
              <div>
                <h5>created time {clickedColumnCode.createdTime}</h5>
              </div>
              <div>
                <h5>email {clickedColumnCode.email}</h5>
              </div>
            </div>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default ColumnCode;
