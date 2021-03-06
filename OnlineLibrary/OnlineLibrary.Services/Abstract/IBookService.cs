﻿using System;
using System.Collections.Generic;
using OnlineLibrary.DataAccess.Entities;
using OnlineLibrary.DataAccess.Enums;
using OnlineLibrary.Services.Models;
using OnlineLibrary.Services.Models.BookServiceModels;

namespace OnlineLibrary.Services.Abstract
{
    public interface IBookService : IService
    {
        int GetNumberOfAvailableCopies(int bookId);

        DateTime? GetEarliestAvailableDate(int bookId);

        string GetConditionDescription(BookCondition cond);

        BookCopy DeleteBookCopy(int id);

        bool IsBookCopyRemovable(int id);

        Book DeleteBook(int id, string path);

        string FormatISBN(string ISBN);

        void FormatAuthorNames(IList<BookAuthorServiceModel> authors);

        BookPaginationModel Find(BookSearchServiceModel model);

        void CreateEditPreparations(CreateEditBookServiceModel model, out Dictionary<string, string> modelErrors);

        void CreateEdit(CreateEditBookServiceModel model, string serverImagePath);

        void RemoveDataFromDatabase(CreateEditBookServiceModel model, Dictionary<string, string> modelErrors);

        bool IsNewBookCopy(int bookCopyId);

        bool IsValidISBN(string ISBN);

        Book GetBook(int id);

        Dictionary<BookCondition, string> PopulateWithBookConditions();

        bool IsBookDuplicate(DuplicateBookServiceModel model);
    }
}