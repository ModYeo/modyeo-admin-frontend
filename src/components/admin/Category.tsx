import React from "react";
import useCategory from "../../hooks/components/useCategory";
import Modal from "../commons/Modal";
import {
  CreateInput,
  List,
  ListContainer,
  ModalBackground,
} from "../../styles/styles";

function Category() {
  const {
    categories,
    detailedCategory,
    toBeModifiedCategoryIndex,
    categoryInputRef,
    IS_CATEGORY_BEING_MODIFIED,
    registerNewCategory,
    initializeDetailedCategory,
    hideDetailedCategoryModal,
    toggleCategoryModificationModal,
    deleteCategory,
    modifyCategory,
  } = useCategory();

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
              onClick={() => initializeDetailedCategory(category.id)}
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
      {IS_CATEGORY_BEING_MODIFIED && (
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
