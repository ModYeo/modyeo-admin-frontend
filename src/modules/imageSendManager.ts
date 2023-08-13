import { toast } from "react-toastify";
import axios from "axios";

import TOAST_SENTENCES from "../constants/toastSentences";

class ImageSendManager {
  private imageSendAxios = axios.create({
    baseURL: process.env.REACT_APP_IMAGE_S3_URL,
  });

  private endPoint = "/prod/modyeo-dev-image";

  private xApiKey = process.env.REACT_APP_X_API_KEY;

  public imagePath = "";

  public async sendImageToBucket(data: {
    imageData: string;
    resource: string;
  }) {
    try {
      const {
        data: {
          body: { url },
        },
      } = await this.imageSendAxios.post<{ body: { url: string } }>(
        this.endPoint,
        data,
        {
          headers: {
            "x-api-key": this.xApiKey,
          },
        },
      );
      return url;
    } catch (e) {
      const { message } = e as Error;
      toast.error(message || TOAST_SENTENCES.IMAGE_NOT_UPLOADED);
      return "";
    }
  }

  public getImagePath() {
    return this.imagePath;
  }

  public setImagePath(imagePath: string) {
    if (imagePath && typeof imagePath === "string") this.imagePath = imagePath;
  }
}

const imageSendManager = new ImageSendManager();

export default imageSendManager;
