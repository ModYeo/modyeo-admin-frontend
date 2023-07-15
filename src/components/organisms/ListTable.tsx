import React from "react";
import styled from "styled-components";

import { ObjectType } from "../atoms/Card";

import useTableList from "../../hooks/common/useTableList";

import OffsetSelectOptions from "../molcules/OffsetSelectOptions";
import SearchForm from "../molcules/SearchForm";
import ListElement from "../atoms/ListElement";
import Button from "../atoms/Button";

import { FormTopArea, ListContainer } from "../../styles/styles";

const Layout = styled.section`
  button,
  select,
  input {
    margin: 0 2px;
  }
`;

const ListWrapper = styled.div`
  min-height: 505px;
  margin: 20px 0;
`;

interface ListTableType {
  requestUrl: string;
  elementKey: string;
  elementTitleKey: string;
}

function ListTable({ requestUrl, elementKey, elementTitleKey }: ListTableType) {
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
    <Layout>
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
      <ListWrapper>
        <ListContainer>
          {slicedList.length === 0 ? (
            <>표시할 컨텐츠가 없습니다.</>
          ) : (
            <>
              {slicedList.map((element, index) => (
                <ListElement
                  key={element[elementKey]}
                  title={elementTitleKey}
                  object={element as unknown as ObjectType}
                  index={slicePoint + index}
                />
              ))}
            </>
          )}
        </ListContainer>
      </ListWrapper>
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
      <br />
      <div>
        <Button type="button" bgColor="red" size="lg">
          write
        </Button>
      </div>
    </Layout>
  );
}

export default ListTable;
