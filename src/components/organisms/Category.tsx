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
import useSearch from "../../hooks/common/useSearch";

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

  const { searchedValue, onChangeSearchedValue } = useSearch();

  const list = useMemo(() => {
    return categories.filter((item) => item.name.includes(searchedValue));
  }, [categories, searchedValue]);

  return (
    <>
      <div>
        <form>
          <input
            style={{ border: "1px solid red" }}
            onChange={onChangeSearchedValue}
          />
          <Button bgColor="blue" size="sm" type="button">
            search
          </Button>
        </form>
      </div>
      <div>
        <SlicePagePerValButtons
          listLength={list.length}
          currentOffset={currentOffset}
          changeOffsetValue={changeOffsetValue}
        />
      </div>
      <ListContainer>
        {list.slice(slicePoint, endOfSlice).map((category, index) => (
          <ListElement
            key={category.id}
            object={category as unknown as ObjectType}
            index={slicePoint + index}
            title="name"
          />
        ))}
      </ListContainer>
      <div>
        {list.length > currentOffset &&
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
      </div>
    </>
  );
}

export default Category;
