import React from "react";
import useNotice from "../../hooks/components/useNotice";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";

import ModalContent from "../molcules/ModalContent";
import SubmitForm from "../molcules/SubmitForm";

import { ObjectType } from "../atoms/Card";
import ListElement from "../molcules/ListElement";

function Notice() {
  const {
    notices,
    detailedNotice,
    requiredInputItems,
    IS_NOTICE_BEING_MODIFIED,
    registerNewNotice,
    deleteNotice,
    initializeDetailedNotice,
    hideDetailedNoticeModal,
    toggleNoticeModificationModal,
    modifyNotice,
  } = useNotice();

  return (
    <ListContainer>
      <SubmitForm
        title="notices list"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewNotice}
      />
      <br />
      {notices.map((notice, index) => (
        <List key={notice.id}>
          <ListElement
            listElement={notice as unknown as ObjectType}
            elementId={notice.id}
            elementIndex={index}
            initializeDetailedElement={initializeDetailedNotice}
            toggleModificationModal={toggleNoticeModificationModal}
            deleteElement={deleteNotice}
          />
        </List>
      ))}
      {detailedNotice && (
        <ModalBackground onClick={() => hideDetailedNoticeModal()}>
          <Modal width={400} height={200}>
            <ModalContent
              detailedElement={detailedNotice as unknown as ObjectType}
            />
          </Modal>
        </ModalBackground>
      )}
      {IS_NOTICE_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleNoticeModificationModal()}>
          <Modal width={400} height={200}>
            <SubmitForm
              title="notices list"
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyNotice}
            />
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Notice;
