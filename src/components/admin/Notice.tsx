import React, { useEffect, useRef, useState } from "react";
import noticeAPIManager from "../../modules/noticeAPI";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import { IDetailedNotice, INotice } from "../../type/types";
import Modal from "../commons/Modal";

function Notice() {
  const [notices, setNotices] = useState<Array<INotice>>([]);
  const [clickedNoticeIndex, setClickedNoticeIndex] = useState(-1);
  const [clickedNotice, setClickedNotice] = useState<IDetailedNotice | null>(
    null,
  );
  const contentInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const handleOnNoticeFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    let isAPICallSuccessful = false;
    const contentInputValue = contentInputRef.current?.value;
    const titleInputValue = titleInputRef.current?.value;
    if (contentInputValue && titleInputValue) {
      if (clickedNoticeIndex === -1) {
        const newNoticeId = await noticeAPIManager.makeNewNotice(
          contentInputValue,
          titleInputValue,
        );
        if (newNoticeId) {
          const newNotice: INotice = {
            id: newNoticeId,
            title: titleInputValue,
            content: contentInputValue,
            imagePath: "",
          };
          setNotices([newNotice, ...notices]);
          isAPICallSuccessful = true;
        }
      } else {
        const modifiedNoticeId = await noticeAPIManager.modifyNotice(
          notices[clickedNoticeIndex].id,
          contentInputValue,
          titleInputValue,
        );
        if (modifiedNoticeId) {
          const modifiedNotice: INotice = {
            id: modifiedNoticeId,
            title: titleInputValue,
            content: contentInputValue,
            imagePath: "",
          };
          notices.splice(clickedNoticeIndex, 1, modifiedNotice);
          setNotices([...notices]);
          setClickedNoticeIndex(-1);
          isAPICallSuccessful = true;
        }
      }
      if (isAPICallSuccessful) {
        contentInputRef.current.value = "";
        titleInputRef.current.value = "";
      }
    }
  };
  const deleteNotice = async (noticeId: number, index: number) => {
    const confirmNoticeDelete = window.confirm("공지를 삭제하시겠습니까?");
    if (!confirmNoticeDelete) return;
    const idDeleteSuccessful = await noticeAPIManager.deleteNotice(noticeId);
    if (idDeleteSuccessful) {
      notices.splice(index, 1);
      setNotices([...notices]);
    }
  };
  const fetchDetailedNoticeInfo = async (noticeId: number) => {
    const fetchedDetailedNotice = await noticeAPIManager.fetchDetailedNotice(
      noticeId,
    );
    if (fetchedDetailedNotice) setClickedNotice(fetchedDetailedNotice);
  };
  useEffect(() => {
    (async () => {
      const fetchedNotices = await noticeAPIManager.fetchAllNotices();
      if (fetchedNotices) setNotices(fetchedNotices);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>notice list</h5>
      <br />
      <form onSubmit={handleOnNoticeFormSubmit}>
        <CreateInput placeholder="content" ref={contentInputRef} required />
        <CreateInput placeholder="title" ref={titleInputRef} required />
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
              onClick={() => fetchDetailedNoticeInfo(notice.id)}
            >
              about
            </button>
            <button type="button" onClick={() => setClickedNoticeIndex(index)}>
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
      {clickedNotice && (
        <ModalBackground onClick={() => setClickedNotice(null)}>
          <Modal width={400} height={200}>
            <div>
              <h5>created by {clickedNotice.createdBy}</h5>
            </div>
            &emsp;
            <div>
              <h5>updated by {clickedNotice.updatedBy}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
      {clickedNoticeIndex !== -1 && (
        <ModalBackground onClick={() => setClickedNoticeIndex(-1)}>
          <Modal width={400} height={200}>
            <form onSubmit={handleOnNoticeFormSubmit}>
              <CreateInput
                placeholder="title"
                ref={titleInputRef}
                defaultValue={notices[clickedNoticeIndex].title}
                required
              />
              <CreateInput
                placeholder="content"
                ref={contentInputRef}
                defaultValue={notices[clickedNoticeIndex].content}
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
