import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { Label, RequiredInputItem } from "./Input";
import imageSendManager from "../../modules/imageSender";

const Header = styled.div`
  margin-bottom: 7px;
  display: flex;
  justify-content: space-between;
  & > button {
    font-size: 12px;
    cursor: pointer;
  }
`;

const ImageFileDiv = styled.div<{ isImageLoaded: boolean }>`
  height: 200px;
  background-color: ${({ isImageLoaded }) =>
    isImageLoaded ? "#e8e8e8" : "#dbdbdb"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 5px;
  border: dotted #b4b4b4;
  transition: all 0.3s;
  &:hover {
    background-color: ${({ isImageLoaded }) =>
      isImageLoaded ? "#dbdbdb" : "#e8e8e8"};
  }
  input[type="file"] {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  input::file-selector-button {
    display: none;
  }
  span {
    font-size: 12px;
    position: absolute;
  }
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ImageInputArea = styled.input``;

const DEFAULT_IMAGE_SIZE = {
  width: 0,
  height: 0,
};

function ImageInput({
  item,
  isModificationAction,
}: {
  item: RequiredInputItem;
  isModificationAction: boolean;
}) {
  const { itemName } = item;
  const elementId = `id-${itemName}`;
  const labelValue = `* ${itemName}`;

  const imageFile = useRef<File | null>(null);

  const previewImageSrc = useRef<string>("");

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    DEFAULT_IMAGE_SIZE,
  );

  const showPreviewImage = useCallback(
    (width: number, height: number) => {
      setImageSize({ width, height });
    },
    [setImageSize],
  );
  const deleteUploadedImage = useCallback(() => {
    imageFile.current = null;
    previewImageSrc.current = "";
    const { current: currentImagePath } = item.refObject;
    if (currentImagePath) currentImagePath.value = "";
    setImageSize(DEFAULT_IMAGE_SIZE);
  }, [item.refObject]);

  const handleImageInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { files },
      } = e;
      if (files) {
        const file = files[0];
        const uploadedImageSrc = imageSendManager.convertFileToObjectUrl(
          file,
          showPreviewImage,
        );
        if (uploadedImageSrc) {
          imageFile.current = file;
          previewImageSrc.current = uploadedImageSrc;
        } else {
          deleteUploadedImage();
        }
      }
    },
    [showPreviewImage, deleteUploadedImage],
  );

  const { previewImageWidth, previewImageHeight } = useMemo(() => {
    if (imageSize.height > 200) {
      // TODO: calc preview size
    }
    return {
      previewImageWidth: imageSize.width / 5,
      previewImageHeight: imageSize.height / 5,
    };
  }, [imageSize]);

  return (
    <>
      <Header>
        <Label htmlFor={elementId}>
          {labelValue}
          {item.refObject.current?.value && (
            <span>{` - ${item.refObject.current.value}`}</span>
          )}
        </Label>
        {previewImageSrc.current && (
          <button type="button" onClick={deleteUploadedImage}>
            사진 업로드 취소
          </button>
        )}
      </Header>
      <ImageFileDiv isImageLoaded={Boolean(previewImageSrc.current)}>
        <ImageInputArea
          onChange={handleImageInputOnChange}
          type="file"
          accept="image/*"
          ref={item.refObject as RefObject<HTMLInputElement>}
        />
        {previewImageSrc.current ? (
          <img
            src={previewImageSrc.current}
            alt=""
            width={previewImageWidth}
            height={previewImageHeight}
          />
        ) : (
          <span>업로드할 이미지 선택</span>
        )}
      </ImageFileDiv>
    </>
  );
}

export default ImageInput;
