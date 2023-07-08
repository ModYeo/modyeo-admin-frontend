import { toast } from "react-toastify";
import toastSentences from "../constants/toastSentences";

const EXTENSION_REGEX = /(.*?)\.(jpg|jpeg|png)$/;

interface IImageSendManager {
  convertFileToObjectUrl(
    file: File,
    callback: (width: number, height: number) => void,
  ): string | null;
}

class ImageSendManager implements IImageSendManager {
  private static URL = window.URL || window.webkitURL;

  private static SIZE_LIMIT = 0;

  private image = new Image();

  private previewUploadedImage: (width: number, height: number) => void = (
    width: number,
    height: number,
  ) => null;

  constructor() {
    this.image = new Image();
    this.image.onload = () => {
      this.previewUploadedImage(this.image.width, this.image.height);
    };
  }

  private checkUploadedImageSizeValidation(file: File) {
    return file.size > ImageSendManager.SIZE_LIMIT;
  }

  private checkIfIsImageTypeFile({ name = "" }: File) {
    return name.match(EXTENSION_REGEX);
  }

  public convertFileToObjectUrl(
    file: File,
    callback: (width: number, height: number) => void,
  ) {
    if (
      !this.checkUploadedImageSizeValidation(file) ||
      !this.checkIfIsImageTypeFile(file)
    ) {
      toast.error(toastSentences.invalidImageExtension);
      return null;
    }
    this.image.src = ImageSendManager.URL.createObjectURL(file);
    this.previewUploadedImage = callback;
    return this.image.src;
  }
}

const imageSendManager = new ImageSendManager();

export default imageSendManager;
