import React from "react";

import { ObjectType } from "../atoms/Card";

import useCategory from "../../hooks/components/useCategory";

import Card from "../molcules/ListElement";
import SubmitForm from "../molcules/SubmitForm";

import { List, ListContainer, ModalBackground } from "../../styles/styles";

function Category() {
  const {
    categories,
    requiredInputItems,
    registerNewCategory,
    initializeDetailedCategory,
    toggleCategoryModificationModal,
    deleteCategory,
  } = useCategory();

  return (
    <ListContainer>
      <SubmitForm
        title="Categories List"
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
    </ListContainer>
  );
}

export default Category;
