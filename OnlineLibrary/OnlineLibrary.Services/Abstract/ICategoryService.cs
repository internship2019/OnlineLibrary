﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OnlineLibrary.DataAccess.Entities;

namespace OnlineLibrary.Services.Abstract
{
    public interface ICategoryService : IService
    {
        Category CreateCategory(string name);
        SubCategory CreateSubCategory(int categoryId, string name);
        IEnumerable<SubCategory> GetSubCategories(int categoryId);
        void DeleteBookCategory(int cateogryId);
        bool IsCategoryRemovable(int cateogryId);
        Category UpdateCategory(int categoryId, string newName);
        SubCategory UpdateSubCategory(int subcategoryId, string newName);
        bool IsSubcategoryRemovable(int cateogryId);
        void DeleteBookSubcategory(int subcategoryId);
    }
}
