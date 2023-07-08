import { toast } from "react-toastify";
import toastSentences from "../constants/toastSentences";

const EXTENSION_REGEX = /(.*?)\.(jpg|jpeg|png)$/;

interface IImagePreviewManager {
  convertFileToObjectUrl(
    file: File,
    callback: (width: number, height: number) => void,
  ): string | null;
}

class ImagePreviewManager implements IImagePreviewManager {
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
    return file.size > ImagePreviewManager.SIZE_LIMIT;
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
    this.image.src = ImagePreviewManager.URL.createObjectURL(file);
    this.previewUploadedImage = callback;
    return this.image.src;
  }
}

const imagePreviewManager = new ImagePreviewManager();

export default imagePreviewManager;
