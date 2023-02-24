import React, { FormEvent, useEffect, useRef, useState } from "react";
import categoryAPIManager from "../../modules/categoryAPI";
import {
  CategoryInput,
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
  const [clickedCategoryIndex, setClickedCategoryIndex] = useState(-1);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const categoryModifyInputRef = useRef<HTMLInputElement>(null);
  const handleOnCategoryFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputNewCategoryName = categoryInputRef.current?.value;
    if (inputNewCategoryName) {
      const newCategoryId = await categoryAPIManager.makeNewCategory(
        inputNewCategoryName,
      );
      if (newCategoryId) {
        const newCategory: ICategory = {
          id: newCategoryId,
          imagePath: "/",
          name: inputNewCategoryName,
        };
        setCategories([newCategory, ...categories]);
      }
    }
  };
  const fetchedDetailedCategory = async (categoryId: number) => {
    const detailedCategoryInfo =
      await categoryAPIManager.fetchDetailedCategoryInfo(categoryId);
    setClickedCategory(detailedCategoryInfo);
  };
  const deleteCategory = async (categoryId: number) => {
    const isDeleteConfirmed =
      window.confirm("정말 카테고리를 삭제하시겠습니까?");
    if (!isDeleteConfirmed) return;
    const isCategoryDeleteSuccessful = await categoryAPIManager.deleteCategory(
      categoryId,
    );
    if (isCategoryDeleteSuccessful) {
      const targetCategoryIndex = categories.findIndex(
        (category) => category.id === categoryId,
      );
      if (targetCategoryIndex !== -1) {
        categories.splice(targetCategoryIndex, 1);
        setCategories([...categories]);
      }
    }
  };
  const modifyCategory = async () => {
    const inputModifiedCategoryName = categoryModifyInputRef.current?.value;
    if (inputModifiedCategoryName) {
      const { id, name } = categories[clickedCategoryIndex];
      const isCategoryModifySuccessful =
        await categoryAPIManager.modifyCategory(id, name);
      if (isCategoryModifySuccessful) {
        setCategories((nowCategories) => {
          const copiedCategories = [...nowCategories];
          copiedCategories[clickedCategoryIndex].name =
            inputModifiedCategoryName;
          return copiedCategories;
        });
        setClickedCategoryIndex(-1);
        // FIX: 404 error 발생.
      }
      categoryModifyInputRef.current.value = "";
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedCategories = await categoryAPIManager.fetchAllCategories();
      if (fetchedCategories) setCategories(fetchedCategories);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>category list</h5>
      <br />
      <form onSubmit={handleOnCategoryFormSubmit}>
        <CategoryInput placeholder="category name" ref={categoryInputRef} />
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
            <button type="button" onClick={() => deleteCategory(category.id)}>
              delete
            </button>
          </span>
        </List>
      ))}
      {clickedCategoryIndex !== -1 && (
        <ModalBackground onClick={() => setClickedCategoryIndex(-1)}>
          <Modal width={350} height={200}>
            <h5>{categories[clickedCategoryIndex].name}</h5>
            <CategoryInput
              placeholder="new category name"
              ref={categoryModifyInputRef}
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
