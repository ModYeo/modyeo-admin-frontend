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
  isCategoryBeingModified: boolean;
  initializeCategoriesList: () => Promise<void>;
  registerNewCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteCategory: (
    categoryId: number,
    targetCategoryIndex: number,
  ) => Promise<void>;
  fetchDetailedCategory: (categoryId: number) => Promise<void>;
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

  const initializeInputValues = useCallback(() => {
    const categoryNameCurrent = categoryInputRef.current;
    if (categoryNameCurrent) categoryNameCurrent.value = "";
  }, []);

  const registerNewCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const [inputNewCategoryName] = extractInputValuesFromElementsRef();

      if (inputNewCategoryName) {
        const newCategoryId = await apiManager.postNewDataElem<{
          name: string;
        }>(routes.server.category, {
          name: inputNewCategoryName,
        });
        if (newCategoryId) {
          addNewCategoryInList({
            id: newCategoryId,
            imagePath: "/",
            name: inputNewCategoryName,
          });
          initializeInputValues();
        }
      }
    },
    [
      extractInputValuesFromElementsRef,
      addNewCategoryInList,
      initializeInputValues,
    ],
  );

  const fetchDetailedCategory = useCallback(async (categoryId: number) => {
    const fetchedDetailedCategory =
      await apiManager.fetchDetailedData<IDetailedCategory>(
        routes.server.category,
        categoryId,
      );
    if (fetchedDetailedCategory) setDetailedCategory(fetchedDetailedCategory);
  }, []);

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
      const isCategoryDeleteSuccessful = await apiManager.deleteData(
        routes.server.category,
        categoryId,
      );
      if (isCategoryDeleteSuccessful)
        removeTargetCategoryInList(targetCategoryIndex);
    },
    [removeTargetCategoryInList],
  );

  const updateTargetCategory = () => {
    const [inputNewCategoryName] = extractInputValuesFromElementsRef();

    if (inputNewCategoryName) {
      setCategories((nowCategories) => {
        const copiedCategories = [...nowCategories];
        copiedCategories[toBeModifiedCategoryIndex].name = inputNewCategoryName;
        return copiedCategories;
      });
    }
  };

  const modifyCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [inputNewCategoryName] = extractInputValuesFromElementsRef();

    if (inputNewCategoryName) {
      const { id } = categories[toBeModifiedCategoryIndex];
      const modifiedCategoryId = await apiManager.modifyData<IModifiedCategory>(
        routes.server.category,
        {
          categoryId: id,
          name: inputNewCategoryName,
          imagePath: "",
        },
      );
      if (modifiedCategoryId) {
        updateTargetCategory();
        toggleCategoryModificationModal();
        initializeInputValues();
      }
    }
  };

  const isCategoryBeingModified =
    toBeModifiedCategoryIndex !== NOTHING_BEING_MODIFIED;

  return {
    categories,
    detailedCategory,
    toBeModifiedCategoryIndex,
    categoryInputRef,
    isCategoryBeingModified,
    initializeCategoriesList,
    registerNewCategory,
    fetchDetailedCategory,
    hideDetailedCategoryModal,
    toggleCategoryModificationModal,
    deleteCategory,
    modifyCategory,
  };
};

export default useCategory;
