import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import useTableList from "../../hooks/common/useTableList";

import OffsetSelectOptions from "../molcules/OffsetSelectOptions";
import SearchForm from "../molcules/SearchForm";
import List from "../molcules/List";
import Pagenation from "../molcules/Pagenation";
import Button from "../atoms/Button";

import { FormTopArea } from "../../styles/styles";

const Layout = styled.section`
  button,
  select,
  input {
    margin: 0 2px;
  }
`;

const ButtonWrapper = styled.div`
  min-height: 30px;
  text-align: right;
`;

interface ListTableProps {
  requestUrl: string;
  elementKey: string;
  elementTitleKey: string;
}

function ListTable({
  requestUrl,
  elementKey,
  elementTitleKey,
}: ListTableProps) {
  const { pathname } = useLocation();

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
    goToWritePage,
    goToDetailedPage,
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
      <List
        slicedList={slicedList}
        elementKey={elementKey}
        elementTitleKey={elementTitleKey}
        slicePoint={slicePoint}
        goToDetailedPage={goToDetailedPage}
      />
      <Pagenation
        filteredListLength={filteredListLength}
        pagenationButtonValues={pagenationButtonValues}
        currentPage={currentPage}
        currentOffset={currentOffset}
        changePagenation={changePagenation}
      />
      <br />
      <ButtonWrapper>
        <Button
          type="button"
          bgColor="red"
          size="lg"
          onClick={goToWritePage}
          disabled={pathname.includes("report")}
        >
          write
        </Button>
      </ButtonWrapper>
    </Layout>
  );
}

export default ListTable;
