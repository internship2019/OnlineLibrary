﻿
$(document).ready(function () {

    $("#add-category").click(function () {
  
        $(".deleteCategory").click(function () {
            var e = document.createElement("div");
            var value = $(this).attr("value");
        });

        // Retreive all sub categories.
        var ajaxData = {
            method: "GET",
            complete: function (jqXhr) {
                var categories = jqXhr.responseJSON;
                var mainDiv = $("#book-categories-subcategories");

                // Index for next category is equal with number of book-category-subcatery divs.
                var index = mainDiv.children(".book-category-subcategory").length;

                // New book-category-subcategory div.
                var categorySubcategryDiv = document.createElement("div");
                categorySubcategryDiv.className = "row book-category-subcategory"
                $(categorySubcategryDiv).css("margin-top", "10px");

                var isRemovedInput = document.createElement("input");
                isRemovedInput.className = "is-book-category-removed";
                isRemovedInput.name = "BookCategories[" + index + "].IsRemoved";
                isRemovedInput.type = "hidden";
                isRemovedInput.value = false;
                categorySubcategryDiv.appendChild(isRemovedInput);

                // New category div.
                var categoryDiv = document.createElement("div");
                categoryDiv.className = "col-md-3 book-category";

                // New subcateogry div.
                var subcategoryDiv = document.createElement("div");
                subcategoryDiv.className = "col-md-3 book-subcategory";

                var select = document.createElement("select");
                select.className = "form-control";
                select.id = "select-category";
                select.name = "BookCategories[" + index + "].Id";
                $(select).bind("change", addSubcategory);

                for (var i = 0; i < categories.length + 1; i++) {
                    var option = document.createElement("option");
                    if (i > 0) {
                        option.value = categories[i - 1].Value;
                        option.text = categories[i - 1].Name;
                    }
                    else {
                        option.value = "0";
                        option.text = "Choose a category";
                        option.disabled = "disabled";
                        option.selected = "selected";
                    }
                    select.appendChild(option);

                }
                categoryDiv.appendChild(select);

                // New Delete category div/button
                var deleteCategoryDiv = document.createElement("div");
                deleteCategoryDiv.className = "col-md-2";
                var button = document.createElement("button");
                button.className = "btn btn-sm btn-danger remove-book-category";
                button.type = "button";
                $(button).bind("click", deleteCategory);
                var span = document.createElement("span");
                span.className = "glyphicon glyphicon-remove";
                button.appendChild(span);
                deleteCategoryDiv.appendChild(button);

                // Add all elements on mainDiv.
                categorySubcategryDiv.appendChild(categoryDiv);
                categorySubcategryDiv.appendChild(subcategoryDiv);
                categorySubcategryDiv.appendChild(deleteCategoryDiv);
                mainDiv.append(categorySubcategryDiv);
            }
        };
        $.ajax("/BooksManagement/ListBookCategories/", ajaxData);
    });

    function addSubcategory() {
        var id = parseInt( $(this).val() );
        var subcategoryDiv = $(this).parent().siblings(".book-subcategory");
        var selectName = this.name;
        var subcategoryName = selectName.replace("Id", "Subcategory.Id")

        var ajaxData = {
            method: "GET",
            data: { categoryId : id },
            success: function (data) {

                var subcategories = data;
                subcategoryDiv.empty()
                var select = document.createElement("select");
                select.className = "form-control";
                select.name = subcategoryName;

                for (var i = 0; i < subcategories.length; i++) {
                    var option = document.createElement("option");
                    option.value = subcategories[i].Value
                    option.text = subcategories[i].Name
                    select.appendChild(option);
                }
                subcategoryDiv.append(select);
            }
        };
        $.ajax("/BooksManagement/ListBookSubcategories/", ajaxData);
    }

    function deleteCategory() {
        $(this).parent().parent().children(".is-book-category-removed").val(true);
        var element = $(this).parent().parent();
        $(element).fadeOut(1000);
    }

    $(".select-category").change(addSubcategory);

    $(".remove-book-category").click(deleteCategory);

    // Implement datepicker for datetime inputs on this page.
    $('.datepicker').datepicker({
        dateFormat: "mm/dd/yy",
        changeMonth: true,
        changeYear: true,
        yearRange: "-160:+0"
    });

    var executeAddBookAuthor = function addBookAuthor(firstName, middleName, lastName) {
        var authorsBody = $("#bookAuthors tbody");
        var newBookAuthorId = parseInt($("#bookAuthors tbody .book-author").last().data("authorId")) + 1;

        if (isNaN(newBookAuthorId)) {
            newBookAuthorId = 0;
        }

        // Create a div for new Author
        var newAuthorRow = document.createElement("tr");
        newAuthorRow.className = "book-author";
        newAuthorRow.setAttribute("data-author-id", newBookAuthorId);

        // Create inputs for Author data.
        // IsRemoved.
        var cell = document.createElement("td");

        var isRemovedInput = document.createElement("input");
        isRemovedInput.className = "is-removed";
        isRemovedInput.name = "Authors[" + newBookAuthorId + "].IsRemoved";
        isRemovedInput.type = "hidden";
        isRemovedInput.value = "false";

        // First Name.
        cell = document.createElement("td");

        var firstNameLabel = document.createElement("label");
        firstNameLabel.htmlFor = "Authors_" + newBookAuthorId + "__AuthorName.FirstName";
        firstNameLabel.innerHTML = "First Name";

        var firstNameInput = document.createElement("input");
        firstNameInput.name = "Authors[" + newBookAuthorId + "].AuthorName.FirstName";
        firstNameInput.id = "Authors_" + newBookAuthorId + "__AuthorName.FirstName";
        firstNameInput.type = "text";
        firstNameInput.className = "form-control";
        firstNameInput.value = firstName || "";

        cell.appendChild(isRemovedInput);
        cell.appendChild(firstNameLabel);
        cell.appendChild(firstNameInput);
        newAuthorRow.appendChild(cell);

        // Middle Name.
        cell = document.createElement("td");

        var middleNameLabel = document.createElement("label");
        middleNameLabel.htmlFor = "Authors_" + newBookAuthorId + "__AuthorName.MiddleName";
        middleNameLabel.innerHTML = "Middle Name";

        var middleNameInput = document.createElement("input");
        middleNameInput.id = "Authors_" + newBookAuthorId + "__AuthorName.MiddleName";
        middleNameInput.name = "Authors[" + newBookAuthorId + "].AuthorName.MiddleName";
        middleNameInput.type = "text";
        middleNameInput.className = "form-control";
        middleNameInput.value = middleName || "";

        cell.appendChild(middleNameLabel);
        cell.appendChild(middleNameInput);
        newAuthorRow.appendChild(cell);

        // Last Name.
        cell = document.createElement("td");

        var lastNameLabel = document.createElement("label");
        lastNameLabel.htmlFor = "Authors_" + newBookAuthorId + "__AuthorName.LastName";
        lastNameLabel.innerHTML = "Last Name";

        var lastNameInput = document.createElement("input");
        lastNameInput.id = "Authors_" + newBookAuthorId + "__AuthorName.LastName";
        lastNameInput.name = "Authors[" + newBookAuthorId + "].AuthorName.LastName";
        lastNameInput.type = "text";
        lastNameInput.className = "form-control";
        lastNameInput.value = lastName || "";

        cell.appendChild(lastNameLabel);
        cell.appendChild(lastNameInput);
        newAuthorRow.appendChild(cell);

        // Button.
        cell = document.createElement("td");
        cell.id = "tdRemoveAuthorButton";

        var removeButton = document.createElement("button");
        removeButton.className = "btn btn-sm btn-danger btn-remove-author-modal";
        removeButton.type = "button";
        removeButton.setAttribute("data-toggle", "modal");
        removeButton.setAttribute("data-target", "#removeAuthorConfirmation");
        $(removeButton).click(btnRemoveAuthorModal);

        // Button icon.
        var removeButtonIcon = document.createElement("span");
        removeButtonIcon.className = "glyphicon glyphicon-remove";
        removeButton.appendChild(removeButtonIcon);

        cell.appendChild(removeButton);
        newAuthorRow.appendChild(cell);

        // Add new Author div to all authors
        authorsBody.append(newAuthorRow);
    }

    $("#btnRemoveAuthorConfirm").click(function () {
        var authorIdToRemove = $(this).attr("data-author-to-remove-id");

        $("#bookAuthors table tbody tr[data-author-id='" + authorIdToRemove + "'] .is-removed").first().val(true);
        var authorRowToRemove = $("#bookAuthors table tbody tr[data-author-id='" + authorIdToRemove + "']").fadeOut(1000);
    });

    // Copies the author ID to modal window.
    function btnRemoveAuthorModal() {
        var authorId = $(this).closest(".book-author").data("authorId");
        $("#btnRemoveAuthorConfirm").attr("data-author-to-remove-id", authorId);
    };

    $(".btn-remove-author-modal").click(btnRemoveAuthorModal);

    $("#AddBookAuthor").click(function(){
        executeAddBookAuthor("", "", "");
    });

    $(".passBookCopyForDelete").click(function () {
        rowid = $(this).data('bookCopyRowId');
    });

    $("#confirm-remove").click(function () {
        var trToHide = $("#bookCopy" + rowid);
        trToHide.fadeOut(1000, function () {
            trToHide.hide();
        })
        $("#bookCopy" + rowid + " .bookCopy .IsToBeDeleted").attr("value", "true");
    });

    $("#AddBookCopy").click(function () {
        // Retreive book conditions.
        var ajaxData = {
            method: "POST",
            complete: function (jqXHR) {
                var bookConditions = jqXHR.responseJSON;

                var newId = 0;

                var newBookCopyRowId = parseInt($(".passBookCopyForDelete").last().attr("data-book-copy-row-id")) + 1;

                if (isNaN(newBookCopyRowId)) {
                    newBookCopyRowId = 0;
                }

                var newTr = document.createElement("tr");
                newTr.id = "bookCopy" + newBookCopyRowId;

                var newTd = document.createElement("td");
                newTd.className = "col-sm-2";
                newTd.innerHTML = "Book Copy Id = new Id";

                var newTd2 = document.createElement("td");
                newTd2.className = "col-sm-3";

                var newTd3 = document.createElement("td");
                newTd3.className = "col-sm-3";

                var newTd4 = document.createElement("td");
                newTd4.className = "col-sm-4";

                var newDiv = document.createElement("div");
                newDiv.className = "bookCopy"

                var newInput = document.createElement("input");
                newInput.className = "IsToBeDeleted";
                newInput.type = "hidden";
                newInput.name = "BookCopies[" + newBookCopyRowId + "].IsToBeDeleted";
                newInput.value = "false";

                var bookCopySelect = document.createElement("select");
                bookCopySelect.id = "BookCopies_" + newBookCopyRowId + "__BookCondition";
                bookCopySelect.name = "BookCopies[" + newBookCopyRowId + "].BookCondition";
                bookCopySelect.className = "form-control";

                // Fill dropdown.
                for (var i = 0; i < bookConditions.length; i++) {
                    var optionElement = document.createElement("option");
                    optionElement.value = bookConditions[i].Value;
                    optionElement.innerHTML = bookConditions[i].Name;

                    bookCopySelect.appendChild(optionElement);
                }

                // Remove button
                var newRemoveButton = document.createElement("button");
                newRemoveButton.className = "btn btn-danger btn-sm passBookCopyForDelete";
                newRemoveButton.type = "button";
                newRemoveButton.setAttribute("data-toggle", "modal");
                newRemoveButton.setAttribute("data-target", "#deleteCopy");
                newRemoveButton.setAttribute("data-book-copy-row-id", newBookCopyRowId);

                // Button icon.
                var newRemoveButtonIcon = document.createElement("span");
                newRemoveButtonIcon.className = "glyphicon glyphicon-remove";
                newRemoveButton.appendChild(newRemoveButtonIcon);

                newDiv.appendChild(newInput);
                newDiv.appendChild(bookCopySelect);
                newTd2.appendChild(newDiv);
                newTd4.appendChild(newRemoveButton);
                newTr.appendChild(newTd);
                newTr.appendChild(newTd2);
                newTr.appendChild(newTd3);
                newTr.appendChild(newTd4);

                $("#bookCopies table").append(newTr);

                $(".passBookCopyForDelete").click(function () {
                    rowid = $(this).data('bookCopyRowId');
                });

                $("#confirm-remove").click(function () {
                    var trToHide = $("#bookCopy" + rowid);
                    trToHide.fadeOut(1000, function () {
                        trToHide.hide();
                    })
                    $("#bookCopy" + rowid + " .bookCopy .IsToBeDeleted").attr("value", "true");
                });
            }
        }
        $.ajax(window.location.origin + "/BooksManagement/ListBookConditions", ajaxData);
    });

    // Shows uploaded file name next to the Image Upload button
    $("#inputFile").click(function () {
        var inputs = document.querySelectorAll('.inputfile');
        Array.prototype.forEach.call(inputs, function (input) {

            var text = document.getElementById("textImageFileName")

            input.addEventListener('change', function (e) {
                var fileName = '';
                fileName = e.target.value.split('\\').pop();
                if (fileName)
                    text.innerHTML = fileName;
            });
        });
    });

    var googleBooksJson = {};
    var imageUrl = [];
    var imageToRemove = [];
    var isbnInformation = [];

    $("#searchByISBN").click(function () {

        $("#validationMessage").text("");
        $("#resultTable").html("");

        $.ajax({
            url: "https://www.googleapis.com/books/v1/volumes?q=" + setURL(),
            async: false,
            success: function (response) {
                if (response.items === undefined) {
                    $("#validationMessage").text("No books with such ISBN were found.");
                }
                else {
                    googleBooksJson = response;

                    for (var i = 0; i < response.items.length; i++) {

                        var item = response.items[i];

                        var resultTable = document.getElementById("resultTable");

                        var tr_td1 = document.createElement("td");
                        tr_td1.setAttribute("rowspan", "6");
                        tr_td1.setAttribute("style", "border: 1px solid #ddd; padding: 10px;");
                        tr_td1.innerHTML = "#" + (i + 1);

                        if (item.volumeInfo.imageLinks != undefined) {
                            if (item.volumeInfo.imageLinks.thumbnail != undefined) {
                                imageUrl[i] = item.volumeInfo.imageLinks.thumbnail;
                            }
                            else if (item.volumeInfo.imageLinks.smallThumbnail != undefined) {
                                imageUrl[i] = item.volumeInfo.imageLinks.smallThumbnail;
                            }
                        }

                        for (var j = 0; j < 7; j++) {

                            var tr = document.createElement("tr");
                            var tr_td2 = document.createElement("td");
                            tr_td2.className = "col-sm-2";
                            var tr_td3 = document.createElement("td");
                            tr_td3.className = "col-sm-9 google-book-ISBN";
                            var td_ul = document.createElement("ul");

                            switch (j) {
                                case 0:
                                    tr.appendChild(tr_td1);
                                    tr_td2.innerHTML = "ISBN";

                                    var validateISBN = $(document.createElement("span"));
                                    $(validateISBN).addClass("validate-ISBN");
                                    $(validateISBN).text(getISBN(item));

                                    $(tr_td3).append($(validateISBN));

                                    var loaderUrl = window.location.protocol + "//" + window.location.host + "/Content/Images/loader.gif";
                                    var imageLoading = $(document.createElement("img"));
                                    $(imageLoading).addClass("loading-image");
                                    $(imageLoading).attr("src", loaderUrl);
                                    $(imageLoading).attr("style", "width: 15px; height: 15px;");
                                    $(imageLoading).attr("alt", "loading");
                                    imageToRemove[i] = $(imageLoading);

                                    var ISBNvalidationMessage = $(document.createElement("span"));
                                    $(ISBNvalidationMessage).addClass("ISBN-validation-message text-danger");
                                    $(ISBNvalidationMessage).attr("style", "margin-left: 10px;");

                                    $(tr_td3).append($(ISBNvalidationMessage));
                                    $(ISBNvalidationMessage).append($(imageLoading));
                                    isbnInformation[i] = $(ISBNvalidationMessage);

                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);

                                    var tr_td4 = document.createElement("td");
                                    tr_td4.setAttribute("style", "border: 1px solid #ddd; padding: 10px; text-align: center; vertical-align: top;");
                                    tr_td4.setAttribute("rowspan", "6");
                                    tr_td4.className = "col-sm-2";

                                    if (imageUrl[i] != null) {
                                        var td_image = document.createElement("img");
                                        td_image.src = imageUrl[i];
                                        td_image.width = "120";
                                        td_image.setAttribute("style", "margin-bottom: 10px;");
                                        tr_td4.appendChild(td_image);
                                    }

                                    var td_button = document.createElement("button");
                                    td_button.className = "btn btn-primary btn-sm selectGoogleBookButton";
                                    td_button.innerHTML = "Select Book";
                                    td_button.setAttribute("data-bookresult", i);
                                    td_button.setAttribute("data-dismiss", "modal");
                                    tr_td4.appendChild(td_button);

                                    tr.appendChild(tr_td4);
                                    break;
                                case 1: tr_td2.innerHTML = "Title";
                                    tr_td3.innerHTML = item.volumeInfo.title;
                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);
                                    break;
                                case 2: tr_td2.innerHTML = "Publish Date";
                                    tr_td3.innerHTML = item.volumeInfo.publishedDate;
                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);
                                    break;
                                case 3: tr_td2.innerHTML = "Authors";
                                    if (item.volumeInfo.authors != undefined) {
                                        for (k = 0; k < item.volumeInfo.authors.length; k++) {
                                            var ul_li = document.createElement("li");
                                            ul_li.innerHTML = item.volumeInfo.authors[k];
                                            td_ul.appendChild(ul_li);
                                            td_ul.setAttribute("style", "margin-left: -28px; margin-bottom: 0px;");
                                            tr_td3.appendChild(td_ul);
                                        }
                                    }
                                    else {
                                        tr_td3.innerHTML = "undefined";
                                    }
                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);
                                    break;
                                case 4: tr_td2.innerHTML = "Category/Subecategory";
                                    tr_td3.innerHTML = item.volumeInfo.categories;
                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);
                                    break;
                                case 5: tr_td2.innerHTML = "Description";
                                    tr_td3.innerHTML = item.volumeInfo.description;
                                    tr.appendChild(tr_td2);
                                    tr.appendChild(tr_td3);
                                    break;
                                case 6:
                                    var tdSpace = document.createElement("td");
                                    tdSpace.setAttribute("style", "height: 10px; border-top:1px solid #ddd;");
                                    tdSpace.setAttribute("colspan", "4");
                                    tr.appendChild(tdSpace);
                                    break;
                                default: break;
                            };
                            tr_td2.setAttribute("style", "font-weight: bold; vertical-align: text-top; padding: 5px; border:1px solid #ddd;");
                            tr_td3.setAttribute("style", "padding: 10px; border:1px solid #ddd;");
                            
                            resultTable.appendChild(tr);
                        }
                        resultTable.setAttribute("cellpadding", "10");
                    }
                }

                $(".selectGoogleBookButton").click(function () {
                    var itemNr = $(this).attr("data-bookresult");
                    var item = googleBooksJson.items[itemNr];
                    $("#Title").val(item.volumeInfo.title);
                    $("#Description").val(item.volumeInfo.description);
                    $("#ISBN").val(getISBN(item));

                    var publishedDate = item.volumeInfo.publishedDate.split("-");
                    var year = publishedDate[0];
                    var month = publishedDate[1] || "01";
                    var day = publishedDate[2] || "01";
                    $("input[name='PublishDate']").val(month + "-" + day + "-" + year);
                    $("#googleJsonCategory").html("<p>The imported Google Books category is: <strong>" + item.volumeInfo.categories + "</strong></p>");

                    var divImageLoad = document.getElementById("imageLoad");

                    if (imageUrl[itemNr] != null) {
                        var imgImageShow = document.getElementById("imageShow");

                        if (imgImageShow === null) {
                            imgImageShow = document.createElement("img");
                        }
                        if (!imgImageShow.src.includes("books.google.com")) {
                            if ($("#oldImagePath").val() == "") {
                                $("#oldImagePath").attr("value", imgImageShow.src);
                            }
                        }

                        imgImageShow.className = "img-small-responsive margin-bottom-10";
                        imgImageShow.src = imageUrl[itemNr];
                        imgImageShow.id = "imageShow";

                        var imgImageInput = document.getElementById("imageInput");

                        if (imgImageInput === null) {
                            imgImageInput = document.createElement("input");
                            imgImageInput.type = "hidden";
                            imgImageInput.value = imageUrl[itemNr];
                            imgImageInput.name = "BookCover.FrontCover";
                            imgImageInput.id = "imageInput";
                            divImageLoad.insertBefore(imgImageShow, divImageLoad.childNodes[0]);
                            divImageLoad.insertBefore(imgImageInput, divImageLoad.childNodes[0]);
                        }
                        else {
                            imgImageInput.value = imageUrl[itemNr];
                            divImageLoad.insertBefore(imgImageShow, divImageLoad.childNodes[0]);
                            divImageLoad.insertBefore(imgImageInput, divImageLoad.childNodes[0]);
                        }

                        $("#inputFile").val("");
                        $("#textImageFileName").text("");
                    }

                    if (item.volumeInfo.authors != undefined) {

                        for (count = 0; count < $("#bookAuthors tbody tr").length; count++) {
                            var btnSelected = $("#bookAuthors tbody tr #tdRemoveAuthorButton button").eq(count);
                            var authorIdToRemove = $(btnSelected).closest(".book-author").data("authorId");
                            $("#bookAuthors table tbody tr[data-author-id='" + authorIdToRemove + "'] .is-removed").first().val(true);
                            var authorRowToRemove = $("#bookAuthors table tbody tr[data-author-id='" + authorIdToRemove + "']");
                            authorRowToRemove.fadeOut(1000);
                        }

                        for (var authorNr = 0; authorNr < item.volumeInfo.authors.length; authorNr++) {

                            var authorName = item.volumeInfo.authors[authorNr].split(" ");

                            var authorFirstName = authorName[0];
                            var authorMiddleName;
                            var authorLastName;

                            if (authorName.length > 2) {
                                authorLastName = authorName[authorName.length - 1];

                                authorMiddleName = "";
                                for (var authorMiddleNameNr = 1; authorMiddleNameNr < authorName.length - 1; authorMiddleNameNr++) {
                                    authorMiddleName += authorName[authorMiddleNameNr] + " ";
                                }
                            }
                            else if (authorName.length == 2) {
                                authorLastName = authorName[1];
                            }

                            executeAddBookAuthor(authorFirstName, authorMiddleName, authorLastName);
                        }
                    }
                })
            },

            error: function () {
                toastr.options =
                    {
                        "closeButton": true,
                        "onclick": null,
                        "positionClass": "toast-bottom-right",
                        "timeOut": 5000,
                        "extendedTimeOut": 10000
                    }
                toastr.error("Can not access Google Books.", "Error!");
            }
        }).done(function () {

            $(".validate-ISBN").each(function () {
                var thisISBN = $(this);
                var thisImage = $(this).siblings(".ISBN-validation-message").first();

                $.ajax({
                    url: window.location.protocol + "//" + window.location.host + "/BooksManagement/ValidateISBN",
                    data: { ISBN: $(thisISBN).text() },
                    async: true,
                    method: "POST",
                    success: function (response) {
                        $(thisImage).empty();

                        if (response.success != null && response.invalid != null) {
                            $(thisImage).addClass("label label-warning");
                            $(thisImage).text("Existing ISBN");
                        }

                        if (response.error) {
                            toastr.options =
                                {
                                    "closeButton": true,
                                    "onclick": null,
                                    "positionClass": "toast-bottom-right",
                                    "timeOut": 5000,
                                    "extendedTimeOut": 10000
                                }
                            toastr.error("Can not verify ISBN " + $(thisISBN).val(), "Error!");
                        }
                    },
                    error: function () {
                        $(thisImage).empty();

                        toastr.options =
                            {
                                "closeButton": true,
                                "onclick": null,
                                "positionClass": "toast-bottom-right",
                                "timeOut": 5000,
                                "extendedTimeOut": 10000
                            }
                        toastr.error("Can not verify ISBN " + $(thisISBN).val(), "Error!");
                    }
                });
            });
        });
    });

    $("#inputFile").click(function () {
        var imageShow = document.getElementById("imageShow");
        if (!imageShow.src.includes("books.google.com"))
        {
            if ($("#oldImagePath").val() == "") {
                $("#oldImagePath").attr("value", imageShow.src);
            }
        }
        imageShow.remove();
        $("#imgImageInput").remove();
    });

    function getISBN(responseItem) {
        var getISBNFromInput = /^\d{10,13}$/.test($("#searchString").val());
        if (getISBNFromInput) {
            return $("#searchString").val();
        }
        else {
            if (responseItem.volumeInfo.industryIdentifiers != undefined) {
                return responseItem.volumeInfo.industryIdentifiers[0].identifier;
            }
            else {
                return "undefined ISBN";
            }
        }
    }

    function setURL() {
        if (/^\d{10,13}$/.test($("#searchString").val()))
            return "isbn:" + $("#searchString").val() + "&maxResults=40";
        else {
            return $("#searchString").val() + "&maxResults=40";
        }
    }

    $("#ISBN").focusout(function () {
        if ($("#ISBN").val() != "undefined ISBN" && $("#ISBN").val() != $(this).attr("data-old-isbn")) {
            $.ajax({
                url: window.location.protocol + "//" + window.location.host + "/BooksManagement/ValidateISBN",
                data: { ISBN: $(this).val() },
                method: "POST",
                success: function (response) {
                    if (response.success != null && response.invalid != null) {
                        toastr.options =
                            {
                                "closeButton": true,
                                "onclick": null,
                                "positionClass": "toast-bottom-right",
                                "timeOut": 5000,
                                "extendedTimeOut": 10000
                            }
                        toastr.warning("ISBN already exists in the system.", "Be careful!");
                    }

                    if (response.error) {
                        toastr.options =
                            {
                                "closeButton": true,
                                "onclick": null,
                                "positionClass": "toast-bottom-right",
                                "timeOut": 5000,
                                "extendedTimeOut": 10000
                            }
                        toastr.error("Can not verify ISBN.", "Error!");
                    }
                },
                error: function () {
                    toastr.options =
                        {
                            "closeButton": true,
                            "onclick": null,
                            "positionClass": "toast-bottom-right",
                            "timeOut": 5000,
                            "extendedTimeOut": 10000
                        }
                    toastr.error("Can not verify ISBN.", "Error!");
                }
            });
        }
    });

    $(".book-category .select-category option:first-child").attr("disabled", "disabled");
    
    function getAuthorsArray() {
        var bookAuthors = new Array();

        $("#bookAuthors .book-author").each(function () {
            if ($(this).find(".is-removed").first().val() == "false") {

                var author = {};

                // First Name
                var key = "FirstName";
                var value = $(this).find("input[name*='FirstName']").first().val();
                author[key] = value;

                // Middle Name
                key = "MiddleName";
                value = $(this).find("input[name*='MiddleName']").first().val();
                author[key] = value;

                // Last Name
                key = "LastName";
                value = $(this).find("input[name*='LastName']").first().val();
                author[key] = value;

                bookAuthors.push(author);
            }
        })

        return bookAuthors;
    }

    // Show the modal only when the book is duplicate.
    $("#save-button").click(function () {
        var ajaxData = {
            url: $(this).attr("data-duplicate-check-url"),
            data: {
                title: $("#Title").val(),
                authors: getAuthorsArray(),
                publishDate: $("#PublishDate").val(),
                id: $("#Id").val()
            },
            method: "POST",
            success: function (response) {
                if (response.duplicate) {
                    $("#duplicateBookModal .modal-title")
                        .text("Possible duplicate.");
                    $("#duplicate-book-modal-content")
                        .text("It seems that the book has duplicates in the system. We suggest to recheck.");
                    $("#duplicateBookModal").modal('show');
                }
                else {
                    $("#bookForm").submit();
                }
            },
            error: function (jqXhr) {
                $("#duplicateBookModal .modal-title")
                    .text("Error!");
                $("#duplicate-book-modal-content")
                    .text("An error has occured while checking the book for duplicates.");
                $("#duplicateBookModal").modal('show');
            }
        };
        $.ajax(ajaxData);
    });

    $("#submit-book-anyway").click(function () {
        $("#bookForm").submit();
    });
});