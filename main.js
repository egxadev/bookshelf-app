// DECLARE SELECTOR
const inputBookTitle = document.getElementById('inputBookTitle');
const inputBookAuthor = document.getElementById('inputBookAuthor');
const inputBookYear = document.getElementById('inputBookYear');
const inputBookIsComplete = document.getElementById('inputBookIsComplete');
const inputBook = document.getElementById('inputBook');
const completeBookshelfList = document.getElementById('completeBookshelfList');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const searchBookTitle = document.getElementById('searchBookTitle');

// STATE BOOK
let book = {
    id: 0,
    title: '',
    author: '',
    year: 0,
    isComplete: false,
};
// STATE BOOKS
let books = [];

// GET BOOK FROM LOCAL STORAGE
const booksLocal = JSON.parse(localStorage.getItem('books'));

const bookBody = (bookValue) => {
    return `
    <article id=${bookValue.id} class="book_item">
        <h3>${bookValue.title}</h3>
        <p>Penulis: ${bookValue.author}</p>
        <p>Tahun: ${bookValue.year}</p>
        <div class="action">
            <button onclick="updateStatus(this.parentNode.parentNode)" class="green">${bookValue.isComplete ? 'Belum selesai dibaca' : 'selesai dibaca'}<button>
            <button type="button" onclick="deleteBook(this.parentNode.parentNode)" class="red">Hapus buku</button>
        </div>
    </article>
    `;
};

// function
const handleChange = (e) => {
    switch (e.target.name) {
        case 'year':
            book = { ...book, [e.target.name]: parseInt(e.target.value) }; //number
            break;
        case 'isComplete':
            book = { ...book, isComplete: !book.isComplete }; //boolean
            break;
        default: //string
            book = { ...book, [e.target.name]: e.target.value };
            break;
    }
};

const handleSubmit = (e) => {
    e.preventDefault();

    let list = document.createElement('li');
    book = { ...book, id: Date.now() };

    if (books.some((item) => item === null)) {
        let done = false;
        let i = 0;

        do {
            if (books[i] === null) {
                books[i] = book;
                list.innerHTML = bookBody(book);
                done = true;
            }
            i++;
        } while (!done);
    } else {
        books.push(book);
        list.innerHTML = bookBody(book);
    }

    localStorage.setItem('books', JSON.stringify(books));
    book.isComplete ? completeBookshelfList.appendChild(list) : incompleteBookshelfList.appendChild(list);
    inputBook.reset();
};

function updateStatus(book) {
    let list = document.createElement('li');

    for (const item of books) {
        if (item !== null) {
            if (item.id == book.id) {
                item.isComplete = !item.isComplete;
                list.innerHTML = bookBody(item);
                item.isComplete ? completeBookshelfList.appendChild(list) : incompleteBookshelfList.appendChild(list);
                book.remove();
                localStorage.setItem('books', JSON.stringify(books));
            }
        } else {
            continue;
        }
    }
}

function deleteBook(book) {
    for (let i = 0; i < books.length; i++) {
        if (books[i] !== null && books[i].id !== null && books[i].id == book.id) {
            books[i] = null;
            localStorage.setItem('books', JSON.stringify(books));
            book.remove();
        }
    }
    if (books.every((item) => item === null)) {
        books = [];
        localStorage.setItem('books', JSON.stringify(books));
    }
}

function searchBook(e) {
    const searchBookTitle = e.target.value.toLowerCase();
    const titleItem = document.querySelectorAll('.book_item h3');

    titleItem.forEach((book) => {
        const titleBook = book.firstChild.textContent.toLowerCase();

        if (titleBook.indexOf(searchBookTitle) != -1) {
            book.parentNode.setAttribute('style', 'display: block;');
        } else {
            book.parentNode.setAttribute('style', 'display: none !important;');
        }
    });
}

function loadData() {
    booksLocal && books.push(...booksLocal);
    if (books) {
        for (let i = 0; i < books.length; i++) {
            if (books[i] !== null && books[i].id) {
                let list = document.createElement('li');
                list.innerHTML = bookBody(books[i]);
                books[i].isComplete ? completeBookshelfList.appendChild(list) : incompleteBookshelfList.appendChild(list);
            } else {
                continue;
            }
        }
    }
}

// add eventListerner
inputBookTitle.addEventListener('change', handleChange);
inputBookAuthor.addEventListener('change', handleChange);
inputBookYear.addEventListener('change', handleChange);
inputBookIsComplete.addEventListener('change', handleChange);
inputBook.addEventListener('submit', handleSubmit);
searchBookTitle.addEventListener('keyup', searchBook);

loadData();
