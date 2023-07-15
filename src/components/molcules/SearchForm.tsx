import React, { useCallback } from "react";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router-dom";

import Button from "../atoms/Button";
import COLOR_CONST from "../../constants/colorConst";

const StyledSearchForm = styled.form`
  input,
  button {
    margin: 0 2px;
  }
`;

const SearchInput = styled.input`
  width: 200px;
  padding: 3px 6px;
  border: 1px solid ${COLOR_CONST.BLUE};
  border-radius: 6px;
`;

function SearchForm({
  searchInputRef,
  onSubmitSearchForm,
}: {
  searchInputRef: React.RefObject<HTMLInputElement>;
  onSubmitSearchForm: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const location = useLocation();

  const navigator = useNavigate();

  const resetFilteredList = useCallback(() => {
    const { pathname } = location;
    navigator(pathname);
  }, [location, navigator]);

  return (
    <StyledSearchForm onSubmit={onSubmitSearchForm}>
      <SearchInput ref={searchInputRef} placeholder="search" />
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
    </StyledSearchForm>
  );
}

export default SearchForm;
