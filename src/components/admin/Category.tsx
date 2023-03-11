import React, { FormEvent, useEffect, useRef, useState } from "react";
import NOT_EXISTS from "../../constants/notExists";
import routes from "../../constants/routes";
import apiManager from "../../modules/apiManager";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import { ICategory, IDetailedCategory } from "../../type/types";
import Modal from "../commons/Modal";

function Category() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [clickedCategory, setClickedCategory] =
    useState<IDetailedCategory | null>(null);
  const [clickedCategoryIndex, setClickedCategoryIndex] = useState(NOT_EXISTS);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const handleOnCategoryFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputNewCategoryName = categoryInputRef.current?.value;
    if (inputNewCategoryName) {
      const newCategoryId = await apiManager.postNewDataElem(
        routes.server.category,
        {
          name: inputNewCategoryName,
        },
      );
      if (newCategoryId) {
        const newCategory: ICategory = {
          id: newCategoryId,
          imagePath: "/",
          name: inputNewCategoryName,
        };
        setCategories([newCategory, ...categories]);
        categoryInputRef.current.value = "";
      }
    }
  };
  const fetchedDetailedCategory = async (categoryId: number) => {
    const detailedCategoryInfo =
      await apiManager.fetchDetailedData<IDetailedCategory>(
        routes.server.category,
        categoryId,
      );
    setClickedCategory(detailedCategoryInfo);
  };
  const deleteCategory = async (categoryId: number, index: number) => {
    const isDeleteConfirmed =
      window.confirm("정말 카테고리를 삭제하시겠습니까?");
    if (!isDeleteConfirmed) return;
    const isCategoryDeleteSuccessful = await apiManager.deleteData(
      routes.server.category,
      categoryId,
    );
    if (isCategoryDeleteSuccessful) {
      categories.splice(index, 1);
      setCategories([...categories]);
    }
  };
  const modifyCategory = async () => {
    const inputModifiedCategoryName = categoryInputRef.current?.value;
    if (inputModifiedCategoryName) {
      const { id } = categories[clickedCategoryIndex];
      const modifiedCategoryId = await apiManager.modifyData(
        routes.server.category,
        {
          categoryId: id,
          name: inputModifiedCategoryName,
          imagePath: "",
        },
      );
      if (modifiedCategoryId) {
        setCategories((nowCategories) => {
          const copiedCategories = [...nowCategories];
          copiedCategories[clickedCategoryIndex].name =
            inputModifiedCategoryName;
          return copiedCategories;
        });
        setClickedCategoryIndex(NOT_EXISTS);
        categoryInputRef.current.value = "";
      }
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedCategories = await apiManager.fetchData<ICategory>(
        routes.server.category,
      );
      if (fetchedCategories) setCategories(fetchedCategories);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>category list</h5>
      <br />
      <form onSubmit={handleOnCategoryFormSubmit}>
        <CreateInput placeholder="category name" ref={categoryInputRef} />
        <button type="submit">make a new category</button>
      </form>
      <br />
      {categories.map((category, index) => (
        <List key={category.id}>
          {category.name}
          <span>
            <button
              type="button"
              onClick={() => fetchedDetailedCategory(category.id)}
            >
              about
            </button>
            <button
              type="button"
              onClick={() => setClickedCategoryIndex(index)}
            >
              modify
            </button>
            <button
              type="button"
              onClick={() => deleteCategory(category.id, index)}
            >
              delete
            </button>
          </span>
        </List>
      ))}
      {clickedCategoryIndex !== NOT_EXISTS && (
        <ModalBackground onClick={() => setClickedCategoryIndex(NOT_EXISTS)}>
          <Modal width={350} height={200}>
            <h5>{categories[clickedCategoryIndex].name}</h5>
            <CreateInput
              placeholder="new category name"
              ref={categoryInputRef}
            />
            <button type="button" onClick={modifyCategory}>
              modify
            </button>
          </Modal>
        </ModalBackground>
      )}
      {clickedCategory && (
        <ModalBackground onClick={() => setClickedCategory(null)}>
          <Modal width={400} height={300}>
            <div>
              <h5>category name {clickedCategory.categoryName}</h5>
            </div>
            <div>
              <h5>created time {clickedCategory.createdTime}</h5>
            </div>
            <div>
              <h5>updated time {clickedCategory.updatedTime}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Category;
