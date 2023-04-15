import React from "react";
import useCategory from "../../hooks/components/useCategory";
import Modal from "../commons/Modal";
import { List, ListContainer, ModalBackground } from "../../styles/styles";
import Card from "../molcules/ListElement";
import { ObjectType } from "../atoms/Card";
import SubmitForm from "../molcules/SubmitForm";
import ModalContent from "../molcules/ModalContent";

function Category() {
  const {
    categories,
    detailedCategory,
    requiredInputItems,
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
      <SubmitForm
        title="categories list"
        requiredInputItems={requiredInputItems}
        registerNewElement={registerNewCategory}
      />
      {categories.map((category, index) => (
        <List key={category.id}>
          <Card
            listElement={category as unknown as ObjectType}
            elementId={category.id}
            elementIndex={index}
            initializeDetailedElement={initializeDetailedCategory}
            toggleModificationModal={toggleCategoryModificationModal}
            deleteElement={deleteCategory}
          />
        </List>
      ))}
      {detailedCategory && (
        <ModalBackground onClick={hideDetailedCategoryModal}>
          <Modal width={400} height={300}>
            <ModalContent
              detailedElement={detailedCategory as unknown as ObjectType}
            />
          </Modal>
        </ModalBackground>
      )}
      {IS_CATEGORY_BEING_MODIFIED && (
        <ModalBackground onClick={() => toggleCategoryModificationModal()}>
          <Modal width={350} height={200}>
            <SubmitForm
              title="category list"
              requiredInputItems={requiredInputItems}
              registerNewElement={modifyCategory}
              isModificationAction={true}
            />
          </Modal>
        </ModalBackground>
      )}
    </ListContainer>
  );
}

export default Category;
