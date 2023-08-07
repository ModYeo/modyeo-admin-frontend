import React from "react";
import styled from "styled-components";

import { ObjectType } from "../atoms/Card";
import ListElement from "../atoms/ListElement";

import { ListContainer } from "../../styles/styles";

const ListWrapper = styled.div`
  min-height: 505px;
  margin: 20px 0;
`;

const ListSkeleton = styled(ListWrapper)`
  min-height: 460px;
  background: url(/images/loading.gif) no-repeat center center/contain;
  opacity: 0.1;
`;

function List({
  slicedList,
  elementKey,
  elementTitleKey,
  slicePoint,
  goToDetailedPage,
}: {
  slicedList: ObjectType[];
  elementKey: string;
  elementTitleKey: string;
  slicePoint: number;
  goToDetailedPage: (value: string | number) => void;
}) {
  return (
    <ListWrapper>
      <ListContainer>
        {!slicedList && <ListSkeleton />}
        {slicedList &&
          (slicedList.length === 0 ? (
            <>표시할 컨텐츠가 없습니다.</>
          ) : (
            <>
              {slicedList.map((element, index) => (
                <ListElement
                  key={element[elementKey]}
                  title={elementTitleKey}
                  object={element as unknown as ObjectType}
                  index={slicePoint + index}
                  goToDetailedPage={() => goToDetailedPage(element[elementKey])}
                />
              ))}
            </>
          ))}
      </ListContainer>
    </ListWrapper>
  );
}

export default List;
