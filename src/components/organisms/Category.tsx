import React, { useCallback, useMemo, useState } from "react";

import { ObjectType } from "../atoms/Card";

import useCategory from "../../hooks/components/useCategory";

import Card from "../molcules/ListElement";

import { List, ListContainer } from "../../styles/styles";
import ListElement from "../atoms/ListElement";
import Button from "../atoms/Button";
import SlicePagePerValButtons from "../molcules/SlicePagePerValButtons";
import usePagenation from "../../hooks/common/usePagenation";

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
    pagenation,
    offsetValue,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    chosePagenation,
    choseSlicePagePerValue,
  } = usePagenation(categories.length);

  return (
    <ListContainer>
      <SlicePagePerValButtons
        listLength={categories.length}
        slicePagePerValue={offsetValue}
        choseSlicePagePerValue={choseSlicePagePerValue}
      />
      {categories.slice(slicePoint, endOfSlice).map((category, index) => (
        <ListElement
          key={category.id}
          object={category as unknown as ObjectType}
          index={slicePoint + index}
          title="name"
        />
      ))}
      {categories.length > offsetValue &&
        pagenationButtonValues.map((value, index) => (
          <Button
            key={value}
            bgColor="blue"
            size="sm"
            type="button"
            isChosen={pagenation === index}
            onClick={() => chosePagenation(value - 1)}
          >
            {value}
          </Button>
        ))}
    </ListContainer>
  );
}

export default Category;
