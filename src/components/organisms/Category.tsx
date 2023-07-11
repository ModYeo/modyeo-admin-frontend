import React, { useCallback, useMemo, useState } from "react";

import { ObjectType } from "../atoms/Card";

import useCategory from "../../hooks/components/useCategory";

import Card from "../molcules/ListElement";

import { List, ListContainer } from "../../styles/styles";
import ListElement from "../atoms/ListElement";
import Button from "../atoms/Button";
import SlicePagePerValButtons from "../molcules/SlicePagePerValButtons";
import usePagenation from "../../hooks/common/usePagenation";

import routes from "../../constants/routes";

function Category() {
  const {
    categories,
    requiredInputItems,
    registerNewCategory,
    initializeDetailedCategory,
    toggleCategoryModificationModal,
    deleteCategory,
  } = useCategory();

  const {
    currentPage,
    currentOffset,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    changePagenation,
    changeOffsetValue,
  } = usePagenation(categories.length, routes.client.category);

  return (
    <ListContainer>
      <SlicePagePerValButtons
        listLength={categories.length}
        currentOffset={currentOffset}
        changeOffsetValue={changeOffsetValue}
      />
      {categories.slice(slicePoint, endOfSlice).map((category, index) => (
        <ListElement
          key={category.id}
          object={category as unknown as ObjectType}
          index={slicePoint + index}
          title="name"
        />
      ))}
      {categories.length > currentOffset &&
        pagenationButtonValues.map((value) => (
          <Button
            key={value}
            bgColor="blue"
            size="sm"
            type="button"
            isChosen={currentPage === value}
            onClick={() => changePagenation(value)}
          >
            {value}
          </Button>
        ))}
    </ListContainer>
  );
}

export default Category;
