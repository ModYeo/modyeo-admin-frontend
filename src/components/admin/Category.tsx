import React, { FormEvent, useEffect, useRef, useState } from "react";
import categoryAPIManager from "../../modules/categoryAPI";
import {
  CategoryInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import { ICategory } from "../../type/types";
import Modal from "../commons/Modal";

function Category() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [targetCategoryId, setTargetCategoryId] = useState(-1);
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
    console.log(detailedCategoryInfo);
    // TODO: show modal with detailed category info.
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
  const modifyCategory = () => {
    const inputModifiedCategoryName = categoryModifyInputRef.current?.value;
    if (inputModifiedCategoryName) {
      // TODO: Call category modify API.
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
      {categories.map((category) => (
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
              onClick={() => setTargetCategoryId(category.id)}
            >
              modify
            </button>
            <button type="button" onClick={() => deleteCategory(category.id)}>
              delete
            </button>
          </span>
        </List>
      ))}
      {targetCategoryId !== -1 && (
        <ModalBackground onClick={() => setTargetCategoryId(-1)}>
          <Modal width={350} height={200}>
            <h5>{categories[targetCategoryId].name}</h5>
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
    </ListContainer>
  );
}

export default Category;
