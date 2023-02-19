import React, { FormEvent, useEffect, useRef, useState } from "react";
import categoryAPIManager from "../../modules/categoryAPI";
import { CategoryInput, List, ListContainer } from "../../styles/styles";
import { ICategory } from "../../type/types";

function Category() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const handleOnCategoryFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputNewCategoryName = categoryInputRef.current?.value;
    if (inputNewCategoryName) {
      const newCategoryId = await categoryAPIManager.makeNewCategory(
        inputNewCategoryName,
      );
      if (newCategoryId) {
        const newCategory: ICategory = {
          id: newCategoryId,
          imagePath: "/",
          name: inputNewCategoryName,
        };
        setCategories([newCategory, ...categories]);
      }
    }
  };
  const fetchedDetailedCategory = async (categoryId: number) => {
    const detailedCategoryInfo =
      await categoryAPIManager.fetchDetailedCategoryInfo(categoryId);
    console.log(detailedCategoryInfo);
    // TODO: show modal with detailed category info.
  };
  const deleteCategory = async (categoryId: number) => {
    const isDeleteConfirmed =
      window.confirm("정말 카테고리를 삭제하시겠습니까?");
    if (!isDeleteConfirmed) return;
    const isCategoryDeleteSuccessful = await categoryAPIManager.deleteCategory(
      categoryId,
    );
    if (isCategoryDeleteSuccessful) {
      const targetCategoryIndex = categories.findIndex(
        (category) => category.id === categoryId,
      );
      if (targetCategoryIndex !== -1) {
        categories.splice(targetCategoryIndex, 1);
        setCategories([...categories]);
      }
    }
  };
  useEffect(() => {
    (async () => {
      const fetchedCategories = await categoryAPIManager.fetchAllCategories();
      if (fetchedCategories) setCategories(fetchedCategories);
    })();
  }, []);
  return (
    <ListContainer>
      <h5>category list</h5>
      <br />
      <form onSubmit={handleOnCategoryFormSubmit}>
        <CategoryInput placeholder="category name" ref={categoryInputRef} />
        <button type="submit">make a new category</button>
      </form>
      <br />
      {categories.map((category) => (
        <List key={category.id}>
          {category.name}
          <span>
            <button
              type="button"
              onClick={() => fetchedDetailedCategory(category.id)}
            >
              about
            </button>
            <button type="button">modify</button>
            <button type="button" onClick={() => deleteCategory(category.id)}>
              delete
            </button>
          </span>
        </List>
      ))}
    </ListContainer>
  );
}

export default Category;
