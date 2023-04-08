import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import { ChosenTabMenuEnum } from "../pages/useAdmin";

enum AuthorityEnum {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}

enum InquiryStatusEnum {
  FREQUENT = "FREQUENT",
}

interface IInquiry {
  authority: AuthorityEnum.ROLE_USER;
  createdBy: number;
  createdTime: string;
  inquiryId: number;
  status: InquiryStatusEnum;
  title: string;
}

const useInquiry = () => {
  const navigator = useNavigate();

  const [inquiries, setInquries] = useState<Array<IInquiry>>([]);

  const fetchInquries = useCallback(() => {
    return apiManager.fetchData<IInquiry>(routes.server.inquiry.index);
  }, []);

  const initializeInquiriesList = useCallback(async () => {
    const fetchedInquiries = await fetchInquries();
    if (fetchedInquiries) setInquries(fetchedInquiries);
  }, [fetchInquries]);

  const goToDetailedInquiryPage = useCallback(
    (inquiryId: number) => {
      navigator(
        `${routes.client.admin}/${ChosenTabMenuEnum.inquiry}/${inquiryId}`,
      );
    },
    [navigator],
  );

  return { inquiries, initializeInquiriesList, goToDetailedInquiryPage };
};

export default useInquiry;
