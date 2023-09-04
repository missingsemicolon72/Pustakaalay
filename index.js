class Book{
    constructor(bookname, bookauthor, booklanguage, bookgenre, booksummary){
        this.name = bookname;
        this.author = bookauthor;
        this.language = booklanguage;
        this.genre = bookgenre;
        this.summary = booksummary;
    }
}

class Display{
    add(bookObj){
        if(this.addToLocalStorage(bookObj)){
            this.createUI();
        }else{
            this.show('warning', 'We are facing some technical issues due to which your book could not be added. We regret the inconvenience.');
        }
    }

    addToLocalStorage(newBook){
        try {
            let ls = localStorage.getItem('pustak');
            let storedBooks;
            if(ls == null || ls == "[]" || ls == ""){
                storedBooks = [];
            }else{
                storedBooks = JSON.parse(ls);
            }
            let newBookObj = {};
            newBookObj['name'] = newBook.name;
            newBookObj['author'] = newBook.author;
            newBookObj['language'] = newBook.language;
            newBookObj['genre'] = newBook.genre;
            newBookObj['summary'] = newBook.summary;
            storedBooks.push(newBookObj);
            localStorage.setItem('pustak', JSON.stringify(storedBooks));
            return true;
        } catch (error) {
            return false;
        }
    }

    createUI(){
        let allBooksString = localStorage.getItem('pustak');
        let rack = document.getElementById('rack');
        let allBooks;
        if(allBooksString == null || allBooksString == "[]" || allBooksString == ""){
            localStorage.setItem('pustak', "");
            let htmlCode = `<div class="text-black-50 fw-bold fs-4 py-5">
                                Library is empty! Please add some books.
                            </div>`;
            rack.innerHTML = htmlCode;
            document.getElementById('bookCount').innerText = '';
        }else{
            allBooks = JSON.parse(allBooksString);
            let num_books = allBooks.length;
            let num_shelves = Math.ceil(num_books / 5);
            let currBook = 0;
            rack.innerHTML = '';
            document.getElementById('bookCount').innerText = (num_books == 1) ? num_books.toString().concat(' book') : num_books.toString().concat(' books');
            for(let i = 0; i < num_shelves; i++){
                //create a shelf
                let newShelf = `<div class="w-100 my-3 py-3 px-2 d-flex flex-row flex-wrap justify-content-between align-items-center border border-3 rounded-2" style="background-color: #663000; box-shadow: inset 0px 0px 15px 5px black;" id="shelf-${i + 1}"></div>`;
                rack.innerHTML += newShelf;
                //in that shelf, create books
                let j = 0;
                let currShelf = document.getElementById('shelf-'.concat(i + 1));
                while(j < 5 && currBook < num_books){
                    let bookHTML = `<div class="mx-2 py-2 px-3 text-start text-break rounded-1" id="book-${currBook}" style="background-color: #5EF38C; color: #0A0A0A;">
                                        <div class="w-100 mb-1 d-flex flex-row justify-content-between align-items-center">
                                            <strong class="fs-5" style="">${allBooks[currBook].name}</strong>
                                            <span class="text-danger fw-bold fs-5" id="delbook-${currBook}" onclick="delBook(this.id)" style="cursor: pointer;">X</span>
                                        </div>
                                        <em>
                                            <span class="fw-semibold">Author:</span> ${allBooks[currBook].author}<br>
                                            <span class="fw-semibold">Language:</span> ${allBooks[currBook].language}<br>
                                            <span class="fw-semibold">Genre:</span> ${allBooks[currBook].genre}<br>
                                            <span class="fw-semibold">Summary:</span> ${allBooks[currBook].summary}
                                        </em>
                                    </div>`;
                    currShelf.innerHTML += bookHTML;
                    currBook++;
                    j++;
                }
            }
        }
    }

    clear(){
        let frm = document.getElementById('newBookForm');
        frm.reset();
    }

    deleteBook(deleteBtnID){
        let bookIndex = deleteBtnID.charAt(deleteBtnID.length - 1);
        let lsStr = localStorage.getItem('pustak');
        let lsObj = JSON.parse(lsStr);
        lsObj.splice(bookIndex, 1);
        localStorage.setItem('pustak', JSON.stringify(lsObj));
        this.createUI();
        this.show('success', 'The book was deleted successfully!');
    }

    show(type, displayMessage){
        let boldText;
        if(type == 'success'){
            boldText = 'Done!';
        }else if(type == 'danger'){
            boldText = 'Error!';
        }else if(type == 'warning'){
            boldText = 'Uh Oh!';
        }else{
            boldText = 'Info!';
        }
        let message = document.getElementById('msg');
        message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show rounded-0" role="alert">
                                <strong>${boldText}</strong> ${displayMessage}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
        setTimeout(function(){
            message.innerHTML = '';
        }, 5000);
    }

    validate(bookObj){
        if(bookObj.name == '' || bookObj.author == '' || bookObj.language == '' || bookObj.genre == '' || bookObj.genre == 'Select Genre' || bookObj.summary == ''){
            return false;
        }else{
            return true;
        }
    }
}

function delBook(delBtnID){
    initial_display.deleteBook(delBtnID);
}

let initial_display = new Display();
initial_display.createUI();

let btnAdd = document.getElementById('btnAddBook');
btnAdd.addEventListener('click', function(){
    let bname = document.getElementById('bookName').value;
    let bauth = document.getElementById('authorName').value;
    let blang = document.getElementById('bookLanguage').value;
    let bgenre = document.getElementById('bookGenre').value;
    let bsummary = document.getElementById('bookSummary').value;

    let book = new Book(bname, bauth, blang, bgenre, bsummary);
    let disp = new Display();

    // Validate contents and perform the necessary operations
    if(disp.validate(book)){
        disp.add(book);
        disp.clear();
        disp.show('success', 'The book was added successfully!');
    }else{
        disp.clear();
        disp.show('danger', 'Please enter all the required fields appropriately.');
    }
});