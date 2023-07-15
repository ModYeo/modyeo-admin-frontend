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
    filteredList,
    searchedValue,
    searchInputRef,
    onChangeSearchedValue,
    onSubmitSearchForm,
    resetFilteredList,
  } = useSearch(
    "name",
    routes.client.category,
    categories as unknown as ObjectType[],
  );

  const {
    currentPage,
    currentOffset,
    pagenationButtonValues,
    slicePoint,
    endOfSlice,
    changePagenation,
    changeOffsetValue,
  } = usePagenation(filteredList.length, routes.client.category);
  // TODO: 폼만 따로 커스텀 훅 처리?

  const slicedList = useMemo(() => {
    return filteredList.slice(slicePoint, endOfSlice);
  }, [filteredList, slicePoint, endOfSlice]);

  return (
    <>
      <div>
        <form onSubmit={onSubmitSearchForm}>
          <input style={{ border: "1px solid red" }} ref={searchInputRef} />
          <Button bgColor="blue" size="sm" type="submit">
            search
          </Button>
          <Button
            bgColor="blue"
            size="sm"
            type="button"
            onClick={resetFilteredList}
          >
            reset
          </Button>
        </form>
      </div>
      <div>
        <SlicePagePerValButtons
          listLength={filteredList.length}
          currentOffset={currentOffset}
          changeOffsetValue={changeOffsetValue}
        />
      </div>
      <ListContainer>
        {slicedList.length === 0 ? (
          <>표시할 컨텐츠가 없습니다.</>
        ) : (
          <>
            {slicedList.map((category, index) => (
              <ListElement
                key={category.id}
                title="name"
                object={category as unknown as ObjectType}
                index={slicePoint + index}
              />
            ))}
          </>
        )}
      </ListContainer>
      <div>
        {filteredList.length > currentOffset &&
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
