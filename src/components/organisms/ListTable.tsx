import React, { useMemo } from "react";

import { ObjectType } from "../atoms/Card";

import useTableList from "../../hooks/common/useTableList";

import OffsetSelectOptions from "../molcules/OffsetSelectOptions";
import SearchForm from "../molcules/SearchForm";
import ListElement from "../atoms/ListElement";
import Button from "../atoms/Button";

import { FormTopArea, ListContainer } from "../../styles/styles";

interface ListTableType {
  requestUrl: string;
  elementTitleKey: string;
}

function ListTable({ requestUrl, elementTitleKey }: ListTableType) {
  const {
    slicedList,
    filteredListLength,
    slicePoint,
    currentPage,
    currentOffset,
    pagenationButtonValues,
    searchInputRef,
    onSubmitSearchForm,
    changeOffsetValue,
    changePagenation,
  } = useTableList({
    requestUrl,
    elementTitleKey,
  });

  return (
    <>
      <FormTopArea>
        <SearchForm
          searchInputRef={searchInputRef}
          onSubmitSearchForm={onSubmitSearchForm}
        />
        <OffsetSelectOptions
          listLength={filteredListLength}
          currentOffset={currentOffset}
          changeOffsetValue={changeOffsetValue}
        />
      </FormTopArea>
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
        {filteredListLength > currentOffset &&
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

export default ListTable;
