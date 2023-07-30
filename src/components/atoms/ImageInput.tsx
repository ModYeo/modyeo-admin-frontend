import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { Label, RequiredInputItem } from "./Input";
import imagePreviewManager from "../../modules/imagePreviewManager";

import COLOR_CONST from "../../constants/colorConst";

const Wrapper = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #eee;
  border: 2px solid #eee;
  border-radius: 6px;
  transition: all 0.4s;
  &:hover {
    border: 2px solid ${COLOR_CONST.BLUE};
  }
`;

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
  height: 290px;
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
} as const;

function ImageInput({ item }: { item: RequiredInputItem }) {
  const { elementId, labelValue } = useMemo(() => {
    const { itemName } = item;
    return { elementId: `id-${itemName}`, labelValue: `* ${itemName}` };
  }, [item]);

  const imageInputRef = useRef<HTMLInputElement>(null);

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
    if (item.refObject.current && "file" in item.refObject.current) {
      const {
        refObject: { current: fileRefCurrent },
      } = item;
      fileRefCurrent.file = null;
    }
    previewImageSrc.current = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    setImageSize(DEFAULT_IMAGE_SIZE);
  }, [item, imageInputRef]);

  const handleImageInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { files },
      } = e;
      if (files) {
        const file = files[0];
        const uploadedImageSrc = imagePreviewManager.convertFileToObjectUrl(
          file,
          showPreviewImage,
        );
        if (uploadedImageSrc) {
          if (item.refObject.current && "file" in item.refObject.current) {
            const {
              refObject: { current: fileRefCurrent },
            } = item;
            fileRefCurrent.file = file;
          }
          previewImageSrc.current = uploadedImageSrc;
        } else {
          deleteUploadedImage();
        }
      }
    },
    [item, showPreviewImage, deleteUploadedImage],
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
    <Wrapper>
      <Header>
        <Label htmlFor={elementId}>
          {labelValue}
          {imageInputRef.current?.value && (
            <span>{` - ${
              imageInputRef.current.value.length > 50
                ? `${imageInputRef.current.value.slice(0, 50)}...`
                : imageInputRef.current.value
            }`}</span>
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
          ref={imageInputRef}
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
    </Wrapper>
  );
}

export default ImageInput;
