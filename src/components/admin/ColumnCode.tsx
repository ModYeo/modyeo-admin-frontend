import React, { useEffect } from "react";
import useColumnCode from "../../hooks/components/useColumnCode";
import Modal from "../commons/Modal";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

function ColumnCode() {
  const {
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
  } = useColumnCode();

  useEffect(() => {
    fetchColumnCodes();
  }, [fetchColumnCodes]);

  return (
    <ListContainer>
      <h5>column codes list</h5>
      <br />
      <form onSubmit={registerNewColumnCode}>
        <CreateInput placeholder="code" ref={codeInputRef} required />
        <CreateInput
          placeholder="column code name"
          ref={columnNameInputRef}
          required
        />
        <CreateInput
          placeholder="desc"
          ref={codeDescriptionInputRef}
          required
        />
        <button type="submit">make a new column code</button>
      </form>
      <br />
      {columnCodes.map((columnCode, index) => {
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
                onClick={() => fetchDetailedColumnCode(columnCode.columnCodeId)}
              >
                about
              </button>
              <button
                type="button"
                onClick={() => toggleColumnCodeModificationModal(index)}
              >
                modify
              </button>
              <button
                type="button"
                onClick={() => deleteColumnCode(columnCode.columnCodeId, index)}
              >
                delete
              </button>
            </div>
          </List>
        );
      })}
      {isColumnCodeBeingModified && (
        <ModalBackground
          onClick={() =>
            toggleColumnCodeModificationModal(NOTHING_BEING_MODIFIED)
          }
        >
          <Modal width={400} height={400}>
            <form onSubmit={modifyColumnCode}>
              <CreateInput
                placeholder="code"
                ref={codeInputRef}
                defaultValue={columnCodes[toBeModifiedColumnCodeIndex].code}
                required
              />
              <CreateInput
                placeholder="column code name"
                ref={columnNameInputRef}
                defaultValue={
                  columnCodes[toBeModifiedColumnCodeIndex].columnCodeName
                }
                required
              />
              <CreateInput
                placeholder="desc"
                ref={codeDescriptionInputRef}
                defaultValue={
                  columnCodes[toBeModifiedColumnCodeIndex].description
                }
                required
              />
              <button type="submit">modify column code</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
      {detailedColumCode && (
        <ModalBackground onClick={hideDetailedColumnCodeModal}>
          <Modal width={350} height={150}>
            <div>
              <div>
                <h5>column code {detailedColumCode.code}</h5>
              </div>
              <div>
                <h5>created time {detailedColumCode.createdTime}</h5>
              </div>
              <div>
                <h5>email {detailedColumCode.email}</h5>
              </div>
            </div>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default ColumnCode;
