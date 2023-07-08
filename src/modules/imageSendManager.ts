import { toast } from "react-toastify";
import toastSentences from "../constants/toastSentences";

class ImageSendManager {
  private fileReader = new FileReader();

  private postDataToServer: (
    encodedImage?: string,
  ) => Promise<void> | undefined = () => undefined;

  constructor() {
    this.fileReader.onload = () => {
      const encodedResult = this.fileReader.result;
      this.postDataToServer(encodedResult as string);
    };

    this.fileReader.onerror = () => {
      toast.error(toastSentences.imageEncodingFailure);
    };
  }

  public encodeImageFile(file: File, callback: () => Promise<void>) {
    this.fileReader.readAsDataURL(file);
    this.postDataToServer = callback;
  }
}

const imageSendManager = new ImageSendManager();

export default imageSendManager;
