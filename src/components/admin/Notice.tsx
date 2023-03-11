import React, { useEffect, useRef, useState } from "react";
import NOT_EXISTS from "../../constants/notExists";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
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
  const [clickedNoticeIndex, setClickedNoticeIndex] = useState(NOT_EXISTS);
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
      if (clickedNoticeIndex === NOT_EXISTS) {
        const newNoticeId = await apiManager.postNewDataElem(
          routes.server.notice,
          {
            content: contentInputValue,
            imagePath: "",
            title: titleInputValue,
          },
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
        const modifiedNoticeId = await apiManager.modifyData(
          routes.server.notice,
          {
            id: notices[clickedNoticeIndex].id,
            content: contentInputValue,
            title: titleInputValue,
            imagePath: "",
          },
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
          setClickedNoticeIndex(NOT_EXISTS);
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
    const idDeleteSuccessful = await apiManager.deleteData(
      routes.server.notice,
      noticeId,
    );
    if (idDeleteSuccessful) {
      notices.splice(index, 1);
      setNotices([...notices]);
    }
  };
  const fetchDetailedNoticeInfo = async (noticeId: number) => {
    const fetchedDetailedNotice =
      await apiManager.fetchDetailedData<IDetailedNotice>(
        routes.server.notice,
        noticeId,
      );
    if (fetchedDetailedNotice) setClickedNotice(fetchedDetailedNotice);
  };
  useEffect(() => {
    (async () => {
      const fetchedNotices = await apiManager.fetchData<INotice>(
        routes.server.notice,
      );
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
      {clickedNoticeIndex !== NOT_EXISTS && (
        <ModalBackground onClick={() => setClickedNoticeIndex(NOT_EXISTS)}>
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
