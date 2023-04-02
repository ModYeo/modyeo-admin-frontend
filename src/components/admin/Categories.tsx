import React, { useEffect } from "react";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";
import Modal from "../commons/Modal";
import useCategories from "../../hooks/admin/useCategories";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

function Category() {
  const {
    categories,
    detailedCategory,
    toBeModifiedCategoryIndex,
    categoryInputRef,
    fetchCategories,
    registerNewCategory,
    fetchDetailedCategory,
    hideDetailedCategoryModal,
    toggleCategoryModificationModal,
    deleteCategory,
    modifyCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const isCategoryBeingModified =
    toBeModifiedCategoryIndex !== NOTHING_BEING_MODIFIED;

  return (
    <ListContainer>
      <h5>category list</h5>
      <br />
      <form onSubmit={registerNewCategory}>
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
              onClick={() => fetchDetailedCategory(category.id)}
            >
              about
            </button>
            <button
              type="button"
              onClick={() => toggleCategoryModificationModal(index)}
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
      {detailedCategory && (
        <ModalBackground onClick={hideDetailedCategoryModal}>
          <Modal width={400} height={300}>
            <div>
              <h5>category name {detailedCategory.categoryName}</h5>
            </div>
            <div>
              <h5>created time {detailedCategory.createdTime}</h5>
            </div>
            <div>
              <h5>updated time {detailedCategory.updatedTime}</h5>
            </div>
          </Modal>
        </ModalBackground>
      )}
      {isCategoryBeingModified && (
        <ModalBackground onClick={() => toggleCategoryModificationModal()}>
          <Modal width={350} height={200}>
            <form onSubmit={modifyCategory}>
              <h5>{categories[toBeModifiedCategoryIndex].name}</h5>
              <CreateInput
                placeholder="new category name"
                defaultValue={categories[toBeModifiedCategoryIndex].name}
                ref={categoryInputRef}
                required
              />
              <button type="submit">modify category</button>
            </form>
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Category;
