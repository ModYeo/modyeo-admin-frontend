import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ObjectType } from "../../components/atoms/Card";
import { RequiredInputItem } from "../../components/atoms/Input";

import apiManager from "../../modules/apiManager";

import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

import routes from "../../constants/routes";

import { MODAL_CONTEXT } from "../../provider/ModalProvider";

interface ICategory {
  id: number;
  imagePath: string | null;
  name: string;
}

interface IModifiedCategory extends Omit<ICategory, "id"> {
  categoryId: number;
}

interface IDetailedCategory {
  categoryId: number;
  categoryName: string;
  useYn: "Y" | "N";
  createdBy: null;
  createdTime: string;
  updatedBy: null;
  updatedTime: string;
}

interface UseCategory {
  categories: Array<ICategory>;
  requiredInputItems: RequiredInputItem[];
  registerNewCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteCategory: (
    categoryId: number,
    targetCategoryIndex: number,
  ) => Promise<void>;
  initializeDetailedCategory: (categoryId: number) => Promise<void>;
  toggleCategoryModificationModal: (targetCategoryIndex?: number) => void;
}

const useCategory = (): UseCategory => {
  const {
    isModalVisible,
    closeModalAndInitializeModificationForm,
    injectModificationModels,
    injectDetailedElement,
  } = useContext(MODAL_CONTEXT);

  const [categories, setCategories] = useState<Array<ICategory>>([]);

  const toBeModifiedCategoryIndex = useRef<number>(NOTHING_BEING_MODIFIED);

  const categoryInputRef = useRef<HTMLInputElement>(null);

  const categoryModifyInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = useCallback(() => {
    return apiManager.fetchData<ICategory>(routes.server.category);
  }, []);

  const initializeCategoriesList = useCallback(async () => {
    const fetchedCategories = await fetchCategories();
    if (fetchedCategories) setCategories(fetchedCategories.reverse());
  }, [fetchCategories]);

  const addNewCategoryInList = useCallback((newCategory: ICategory) => {
    setCategories((categoriesList) => {
      return [newCategory, ...categoriesList];
    });
  }, []);

  const extractInputValuesFromElementsRef = useCallback(() => {
    return toBeModifiedCategoryIndex.current !== NOTHING_BEING_MODIFIED
      ? [categoryModifyInputRef.current?.value]
      : [categoryInputRef.current?.value];
  }, []);

  const sendPostCategoryRequest = useCallback(
    (inputNewCategoryName: string) => {
      return apiManager.postNewDataElem(routes.server.category, {
        name: inputNewCategoryName,
      });
    },
    [],
  );

  const initializeInputValues = useCallback(() => {
    const categoryNameCurrent = categoryInputRef.current;
    if (categoryNameCurrent) categoryNameCurrent.value = "";
  }, []);

  const registerNewCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [categoryNameInputValue] = extractInputValuesFromElementsRef();

      if (categoryNameInputValue) {
        const newCategoryId = await sendPostCategoryRequest(
          categoryNameInputValue,
        );
        if (newCategoryId) {
          addNewCategoryInList({
            id: newCategoryId,
            name: categoryNameInputValue,
            imagePath: "/",
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      sendPostCategoryRequest,
      addNewCategoryInList,
      initializeInputValues,
    ],
  );

  const fetchDetailedCategory = useCallback((categoryId: number) => {
    return apiManager.fetchDetailedData<IDetailedCategory>(
      routes.server.category,
      categoryId,
    );
  }, []);

  const initializeDetailedCategory = useCallback(
    async (categoryId: number) => {
      const fetchedDetailedCategory = await fetchDetailedCategory(categoryId);
      if (fetchedDetailedCategory)
        injectDetailedElement(fetchedDetailedCategory as unknown as ObjectType);
    },
    [fetchDetailedCategory, injectDetailedElement],
  );

  const sendDeleteCategoryRequest = useCallback((categoryId: number) => {
    return apiManager.deleteData(routes.server.category, categoryId);
  }, []);

  const removeTargetCategoryInList = useCallback(
    (targetCategoryIndex: number) => {
      setCategories((categoriesList) => {
        categoriesList.splice(targetCategoryIndex, 1);
        return [...categoriesList];
      });
    },
    [setCategories],
  );

  const deleteCategory = useCallback(
    async (categoryId: number, targetCategoryIndex: number) => {
      const isDeleteConfirmed =
        window.confirm("정말 카테고리를 삭제하시겠습니까?");
      if (!isDeleteConfirmed) return;
      const isCategoryDeleteSuccessful = await sendDeleteCategoryRequest(
        categoryId,
      );
      if (isCategoryDeleteSuccessful)
        removeTargetCategoryInList(targetCategoryIndex);
    },
    [sendDeleteCategoryRequest, removeTargetCategoryInList],
  );

  const sendPatchCategoryRequest = useCallback(
    <T extends object>(modifiedCategory: T) => {
      return apiManager.modifyData<T>(routes.server.category, modifiedCategory);
    },
    [],
  );

  const updateTargetCategory = (modifiedCategory: ICategory) => {
    setCategories((categoriesList) => {
      categoriesList.splice(
        toBeModifiedCategoryIndex.current,
        1,
        modifiedCategory,
      );
      return [...categoriesList];
    });
  };

  const modifyCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [inputNewCategoryName] = extractInputValuesFromElementsRef();

      if (inputNewCategoryName) {
        const { id: targetCategoryId } =
          categories[toBeModifiedCategoryIndex.current];
        const modifiedCategory: IModifiedCategory = {
          categoryId: targetCategoryId,
          name: inputNewCategoryName,
          imagePath: "",
        };
        const modifiedCategoryId =
          await sendPatchCategoryRequest<IModifiedCategory>(modifiedCategory);
        if (targetCategoryId === modifiedCategoryId) {
          updateTargetCategory({ ...modifiedCategory, id: modifiedCategoryId });
          closeModalAndInitializeModificationForm();
        }
      }
    },
    [
      categories,
      extractInputValuesFromElementsRef,
      sendPatchCategoryRequest,
      closeModalAndInitializeModificationForm,
    ],
  );

  const makeRequiredInputElements = useCallback(
    (targetIndex?: number): RequiredInputItem[] => {
      const isCategoryBeingModified =
        targetIndex !== undefined && targetIndex !== NOTHING_BEING_MODIFIED;
      return [
        {
          itemName: "category name",
          refObject: isCategoryBeingModified
            ? categoryModifyInputRef
            : categoryInputRef,
          elementType: "input",
          defaultValue: isCategoryBeingModified
            ? categories[toBeModifiedCategoryIndex.current].name
            : "",
        },
      ];
    },
    [categories, toBeModifiedCategoryIndex],
  );

  const requiredInputItems = useMemo(
    () => makeRequiredInputElements(),
    [makeRequiredInputElements],
  );

  const toggleCategoryModificationModal = useCallback(
    (targetIndex?: number) => {
      if (targetIndex !== undefined) {
        toBeModifiedCategoryIndex.current = targetIndex;
        const requiredInputElementsParam =
          makeRequiredInputElements(targetIndex);
        injectModificationModels({
          requiredInputElementsParam,
          elementModificationFunctionParam: modifyCategory,
        });
      } else {
        toBeModifiedCategoryIndex.current = NOTHING_BEING_MODIFIED;
        closeModalAndInitializeModificationForm();
      }
    },
    [
      modifyCategory,
      makeRequiredInputElements,
      injectModificationModels,
      closeModalAndInitializeModificationForm,
    ],
  );

  useEffect(() => {
    initializeCategoriesList();
  }, [initializeCategoriesList]);

  useEffect(() => {
    if (!isModalVisible)
      toBeModifiedCategoryIndex.current = NOTHING_BEING_MODIFIED;
  }, [isModalVisible]);

  return {
    categories,
    requiredInputItems,
    registerNewCategory,
    initializeDetailedCategory,
    toggleCategoryModificationModal,
    deleteCategory,
  };
};

export default useCategory;
