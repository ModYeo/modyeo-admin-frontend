import React, { useEffect } from "react";
import useNotice from "../../hooks/components/useNotice";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import Modal from "../commons/Modal";

function Notice() {
  const {
    notices,
    detailedNotice,
    toBeModifiedNoticeIndex,
    contentInputRef,
    titleInputRef,
    IS_NOTICE_BEING_MODIFIED,
    initializaNoticesList,
    registerNewAdvertisement,
    deleteNotice,
    initializeDetailedNotice,
    hideDetailedNoticeModal,
    toggleNoticeModificationModal,
    modifyNotice,
  } = useNotice();

  useEffect(() => {
    initializaNoticesList();
  }, [initializaNoticesList]);

  return (
    <ListContainer>
      <h5>notice list</h5>
      <br />
      <form onSubmit={registerNewAdvertisement}>
        <CreateInput placeholder="title" ref={titleInputRef} required />
        <CreateInput placeholder="content" ref={contentInputRef} required />
        <button type="submit">make a new column code</button>
      </form>
      <br />
      {notices.map((notice, index) => (
        <List key={notice.id}>
          <div>
            <div>title - {notice.title}</div>
            <div>content - {notice.content}</div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => initializeDetailedNotice(notice.id)}
            >
              about
            </button>
            <button
              type="button"
              onClick={() => toggleNoticeModificationModal(index)}
            >
              modify
            </button>
            <button
              type="button"
              onClick={() => deleteNotice(notice.id, index)}
            >
              delete
            </button>
          </div>
        </List>
      ))}
      {detailedNotice && (
        <ModalBackground onClick={() => hideDetailedNoticeModal()}>
          <Modal width={400} height={200}>
            <div>
              <h5>created by {detailedNotice.createdBy}</h5>
            </div>
            &emsp;
            <div>
              <h5>updated by {detailedNotice.updatedBy}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
      {IS_NOTICE_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleNoticeModificationModal()}>
          <Modal width={400} height={200}>
            <form onSubmit={modifyNotice}>
              <CreateInput
                placeholder="title"
                ref={titleInputRef}
                defaultValue={notices[toBeModifiedNoticeIndex].title}
                required
              />
              <CreateInput
                placeholder="content"
                ref={contentInputRef}
                defaultValue={notices[toBeModifiedNoticeIndex].content}
                required
              />
              <button type="submit">modify column code</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Notice;
