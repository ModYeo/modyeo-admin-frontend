import React from "react";
import Card, { ObjectType } from "../atoms/Card";

function ModalContent({ detailedElement }: { detailedElement: ObjectType }) {
  return <Card element={detailedElement} />;
}

export default ModalContent;
