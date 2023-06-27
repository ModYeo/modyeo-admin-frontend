import React from "react";

import { ObjectType } from "../atoms/Card";

import useNotice from "../../hooks/components/useNotice";

import SubmitForm from "../molcules/SubmitForm";
import ListElement from "../molcules/ListElement";

import { List, ListContainer } from "../../styles/styles";

function Notice() {
  const {
    notices,
    requiredInputItems,
    registerNewNotice,
    deleteNotice,
    initializeDetailedNotice,
    toggleNoticeModificationModal,
  } = useNotice();

  return (
    <ListContainer>
      <SubmitForm
        title="Notices List"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewNotice}
      />
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
    </ListContainer>
  );
}

export default Notice;
