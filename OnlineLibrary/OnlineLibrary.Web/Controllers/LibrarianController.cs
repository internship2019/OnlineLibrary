﻿using OnlineLibrary.DataAccess.Entities;
using OnlineLibrary.DataAccess.Enums;
using OnlineLibrary.Services.Abstract;
using OnlineLibrary.Services.Concrete;
using OnlineLibrary.Web.Infrastructure.Abstract;
using OnlineLibrary.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using OnlineLibrary.Web.Models.LibrarianLoansViewModels;
using OnlineLibrary.DataAccess.Abstract;
using OnlineLibrary.Common.Exceptions;
using System.Configuration;

namespace OnlineLibrary.Web.Controllers
{
    public class LibrarianController : BaseController
    {
        private ILibrarianService _librarianService;

        public LibrarianController(ILibraryDbContext dbContext, ILibrarianService librarianService)
            : base(dbContext)
        {
            _librarianService = librarianService;
        }

        [Authorize(Roles = "Librarian, System administrator, Super administrator")]
        public ActionResult Index()
        {
            var model = new LoansViewModel();

            // Obtain loans.
            var loans = DbContext.Loans
                 .Include(lr => lr.User)
                 .Include(lr => lr.Book)
                 .Select(lr => new LoanViewModel
                 {
                     LoanId = lr.Id,
                     BookTitle = lr.Book.Title,
                     UserName = lr.User.UserName,
                     Status = lr.Status,
                     ApprovingDate = lr.ApprovingDate,
                     BookPickUpLimitDate = lr.BookPickUpLimitDate
                 })
                 .OrderBy(lr => lr.ApprovingDate)
                 .ToList();

            model.PendingLoans = loans.Where(l => l.Status == LoanStatus.Pending);
            model.ApprovedLoans = loans.Where(l => l.Status == LoanStatus.Approved);
            model.LoanedBooks = loans.Where(l => l.Status == LoanStatus.InProgress);
            model.RejectedLoans = loans.Where(l => l.Status == LoanStatus.Rejected);
            model.ReturnedBooks = loans.Where(l => l.Status == LoanStatus.Completed);
            model.LostBooks = loans.Where(l => l.Status == LoanStatus.LostBook);

            return View(model);
        }

        [HttpPost]
        public ActionResult ApproveLoanRequest(int bookCopyId, int loanId)
        {
            try
            {
                int daysNumberForLateApprovedLoans;
                int.TryParse(ConfigurationManager.AppSettings["DaysNumberForLateApprovedLoans"], out daysNumberForLateApprovedLoans);
                _librarianService.ApproveLoanRequest(bookCopyId, loanId, daysNumberForLateApprovedLoans);

                return Json(new { success = "Loan approved!" },
                    JsonRequestBehavior.AllowGet);
            }
            catch (InvalidBookCopyIdException)
            {
                return Json(new { error = "BookCopyId doesn't correspond to the BookId" },
                    JsonRequestBehavior.AllowGet);
            }
            catch (BookCopyNotAvailableException)
            {
                return Json(new { error = "This book copy is not available for loan" },
                    JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult RejectLoanRequest(int loanId)
        {
            var librarian = DbContext.Users.Where(u => u.UserName == User.Identity.Name).Single();
            _librarianService.RejectLoanRequest(loanId, librarian);

            return RedirectToAction("Index");
        }
        
        [HttpPost]
        public ActionResult PerformLoan(int loanId)
        {
            _librarianService.PerformLoan(loanId);

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult ReturnBook(int loanId)
        {            
            var librarian = DbContext.Users.Where(u => u.UserName == User.Identity.Name).Single();
            _librarianService.ReturnBook(loanId, librarian);

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult LostBook(int loanId)
        {
            var librarian = DbContext.Users.Where(u => u.UserName == User.Identity.Name).Single();
            _librarianService.LostBook(loanId, librarian);

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult CancelApprovedLoan(int loanId)
        {
            var librarian = DbContext.Users.Where(u => u.UserName == User.Identity.Name).Single();
            _librarianService.CancelApprovedLoan(loanId, librarian);

            return RedirectToAction("Index");
        }
    }
}