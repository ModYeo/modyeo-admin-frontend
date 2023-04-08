import React, { useCallback, useRef, useState } from "react";

import apiManager from "../../modules/apiManager";
import routes from "../../constants/routes";
import NOTHING_BEING_MODIFIED from "../../constants/nothingBeingModified";

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
  detailedCategory: IDetailedCategory | null;
  toBeModifiedCategoryIndex: number;
  categoryInputRef: React.RefObject<HTMLInputElement>;
  IS_CATEGORY_BEING_MODIFIED: boolean;
  initializeCategoriesList: () => Promise<void>;
  registerNewCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteCategory: (
    categoryId: number,
    targetCategoryIndex: number,
  ) => Promise<void>;
  initializeDetailedCategory: (categoryId: number) => Promise<void>;
  hideDetailedCategoryModal: () => void;
  toggleCategoryModificationModal: (targetCategoryIndex?: number) => void;
  modifyCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useCategory = (): UseCategory => {
  const [categories, setCategories] = useState<Array<ICategory>>([]);

  const [detailedCategory, setDetailedCategory] =
    useState<IDetailedCategory | null>(null);

  const [toBeModifiedCategoryIndex, setToBeModifiedCategoryIndex] = useState(
    NOTHING_BEING_MODIFIED,
  );

  const categoryInputRef = useRef<HTMLInputElement>(null);

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
    return [categoryInputRef.current?.value];
  }, []);

  const sendPostCategoryRequest = useCallback(
    (inputNewCategoryName: string) => {
      return apiManager.postNewDataElem<{
        name: string;
      }>(routes.server.category, {
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

      const [inputNewCategoryName] = extractInputValuesFromElementsRef();

      if (inputNewCategoryName) {
        const newCategoryId = await sendPostCategoryRequest(
          inputNewCategoryName,
        );
        if (newCategoryId) {
          addNewCategoryInList({
            id: newCategoryId,
            name: inputNewCategoryName,
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
      if (fetchedDetailedCategory) setDetailedCategory(fetchedDetailedCategory);
    },
    [fetchDetailedCategory],
  );

  const hideDetailedCategoryModal = useCallback(() => {
    setDetailedCategory(null);
  }, []);

  const toggleCategoryModificationModal = useCallback(
    (targetCategoryIndex?: number) => {
      if (targetCategoryIndex !== undefined)
        setToBeModifiedCategoryIndex(targetCategoryIndex);
      else setToBeModifiedCategoryIndex(NOTHING_BEING_MODIFIED);
    },
    [setToBeModifiedCategoryIndex],
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

  const sendPatchCategoryRequest = <T extends object>(modifiedCategory: T) => {
    return apiManager.modifyData<T>(routes.server.category, modifiedCategory);
  };

  const updateTargetCategory = (modifiedCategory: ICategory) => {
    setCategories((categoriesList) => {
      categoriesList.splice(toBeModifiedCategoryIndex, 1, modifiedCategory);
      return [...categoriesList];
    });
  };

  const modifyCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [inputNewCategoryName] = extractInputValuesFromElementsRef();

    if (inputNewCategoryName) {
      const { id: targetCategoryId } = categories[toBeModifiedCategoryIndex];
      const modifiedCategory: IModifiedCategory = {
        categoryId: targetCategoryId,
        name: inputNewCategoryName,
        imagePath: "",
      };
      const modifiedCategoryId =
        await sendPatchCategoryRequest<IModifiedCategory>(modifiedCategory);
      if (targetCategoryId === modifiedCategoryId) {
        updateTargetCategory({ ...modifiedCategory, id: modifiedCategoryId });
        toggleCategoryModificationModal();
        initializeInputValues();
      }
    }
  };

  const IS_CATEGORY_BEING_MODIFIED =
    toBeModifiedCategoryIndex !== NOTHING_BEING_MODIFIED;

  return {
    categories,
    detailedCategory,
    toBeModifiedCategoryIndex,
    categoryInputRef,
    IS_CATEGORY_BEING_MODIFIED,
    initializeCategoriesList,
    registerNewCategory,
    initializeDetailedCategory,
    hideDetailedCategoryModal,
    toggleCategoryModificationModal,
    deleteCategory,
    modifyCategory,
  };
};

export default useCategory;
