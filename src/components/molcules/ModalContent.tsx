import React from "react";
import Card, { ObjectType } from "../atoms/Card";

function ModalContent({ detailedElement }: { detailedElement: ObjectType }) {
  return (
    <div>
      <Card element={detailedElement} />
    </div>
  );
}

export default ModalContent;
