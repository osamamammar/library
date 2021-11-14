// variables
// global saved library array
let myLibrary = JSON.parse(localStorage.getItem('library')) || [];
// flag to clear inputs value
let clearFormFlag = false;
// flag to indicate and check validation
let validationFormFlag = false;

let currentBookId = null;

// ******************************************************************
// node elements for inputs values
const bookName = document.querySelector('#bookName');
const authorName = document.querySelector('#authorName');
const pagesNumber = document.querySelector('#pagesNumber');
const statue = document.querySelector('#statue');
// book container which display added books
const tableBody = document.querySelector('.books_container');
// submit form btn
const submitFormBtn = document.querySelector('.form');
// validation error message
const bookErrorMsg = document.querySelector('.book-error-msg');
const authorErrorMsg = document.querySelector('.author-error-msg');
const numberErrorMsg = document.querySelector('.number-error-msg');

// *******************************************************************
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-container');
const closeModalIcon = document.querySelector('.modal-container__header--icon');
const modalCancelBtn = document.querySelector('.cta-btn--cancel');
const modalDeleteBtn = document.querySelector('.cta-btn--delete');
const modalDescription = document.querySelector('.modal-container__content--description');

// *******************************************************************

// event listener for close modal icon
closeModalIcon.addEventListener('click', closeModal);
// function to close modal
function closeModal() {
	modalContainer.classList.remove('open');
	overlay.classList.remove('active');
}

// function to open modal
function openModal(currentBook) {
	overlay.classList.add('active');
	modalContainer.classList.add('open');
	changeModalDescription(myLibrary[currentBook]);
}

// function to change modal description
function changeModalDescription(book) {
	if (book) {
		modalDescription.innerHTML = `Are you sure you want to delete <span class="description-title">"${book.bookName}"</span> by <span class="description-title">"${book.authorName}"</span> ?`;
	} else {
		return;
	}
}

// event listener for submit books form btn
submitFormBtn.addEventListener('submit', handleSubmitForm);
// function to handel submit form
function handleSubmitForm(e) {
	e.preventDefault();
	addBookToLibrary();
	renderUi();
	if (clearFormFlag) {
		clearForm();
	}
}

// constructor function that create object of Book
function Book(_id, bookName, authorName, pagesNumber, statue) {
	// the constructor...
	this._id = _id;
	this.bookName = bookName;
	this.authorName = authorName;
	this.pagesNumber = pagesNumber;
	this.statue = statue;
}

// funtion to make counter id based in library array length
let id = makeIdCounter();
function makeIdCounter() {
	let i = 0;
	return function () {
		return myLibrary.length > i ? myLibrary[myLibrary.length - 1]._id + 1 : 0;
	};
}

// function to make validation form
function validationForm() {
	bookName.value.length === 0
		? (bookErrorMsg.style.display = 'block')
		: (bookErrorMsg.style.display = 'none');

	authorName.value.length === 0
		? (authorErrorMsg.style.display = 'block')
		: (authorErrorMsg.style.display = 'none');

	pagesNumber.value === '' || pagesNumber.value === '0' || pagesNumber.value < 0
		? (numberErrorMsg.style.display = 'block')
		: (numberErrorMsg.style.display = 'none');

	clearFormFlag = false;
	if (bookName.value && authorName.value && pagesNumber.value !== '' && pagesNumber.value > 0) {
		return (validationFormFlag = true);
	} else {
		return (validationFormFlag = false);
	}
}

// function add book to library
function addBookToLibrary() {
	validationForm();
	if (validationFormFlag) {
		// create object of book and add to library array
		const newBook = new Book(
			id(),
			bookName.value,
			authorName.value,
			pagesNumber.value,
			statue.value
		);

		myLibrary.push(newBook);
		updateLibraryInLocalStorage();
		clearFormFlag = true;
		validationFormFlag = false;
	}
}

// function to change statue of book
function changeStatue(book) {
	if (myLibrary[book].statue === 'read') {
		myLibrary[book].statue = 'not read';
	} else myLibrary[book].statue = 'read';
}

// function to delete book form array
function deleteBook(currentBook) {
	return myLibrary.splice(currentBook, 1);

	// myLibrary = myLibrary.filter((_, index) => index !== currentBook);
	// console.log(myLibrary);
}

// function to find book index in array
function findBook(libraryArray, id) {
	if (libraryArray.length === 0 || libraryArray === null) {
		return;
	}

	// for (let book of libraryArray)
	// 	if (book.bookName === name) {
	// 		return libraryArray.indexOf(book);
	// 	}

	return libraryArray.findIndex((book) => book._id === id);
}

// function to clear form
function clearForm() {
	bookName.value = '';
	authorName.value = '';
	pagesNumber.value = '';
	statue.value = 'read';
}

// function to update library in local storage
function updateLibraryInLocalStorage() {
	localStorage.setItem('library', JSON.stringify(myLibrary));
}

// function to render ui
function renderUi() {
	tableBody.innerHTML = '';
	myLibrary.map((book) => {
		const htmlBookRow = `
      <tr>
        <td>${book.bookName}</td>
        <td>${book.authorName}</td>
        <td>${book.pagesNumber}</td>
        <td><button class="statue-btn ${book.statue === 'read' ? 'dark' : ''}" data-id="${
			book._id
		}">${book.statue}</button></td>
        <td><button class="delete-book" data-id="${book._id}"></button></td>
      </tr>
      `;
		tableBody.insertAdjacentHTML('afterbegin', htmlBookRow);
	});
	changeStatueBtnAfterRenderUi();
	deleteBookBtnAfterRenderUi();
}

renderUi();

// function to change statue btn after render ui
function changeStatueBtnAfterRenderUi() {
	// select all change statue btn nodelist
	const changeStatueBtns = document.querySelectorAll('.statue-btn');

	if (changeStatueBtns.length != 0) {
		changeStatueBtns.forEach((changeBtn) => changeBtn.addEventListener('click', handleChangeEvent));
	} else {
		return;
	}
}

// function  to handle change event
function handleChangeEvent(e) {
	const currentTarget = Number(e.target.dataset.id);
	changeStatue(findBook(myLibrary, currentTarget));
	updateLibraryInLocalStorage();
	renderUi();
}

// function to delete Book After Render Ui
function deleteBookBtnAfterRenderUi() {
	// select all delete statue btn nodelist
	const deleteBookBtns = document.querySelectorAll('.delete-book');

	if (deleteBookBtns.length != 0) {
		deleteBookBtns.forEach((removeBookBtn) => {
			removeBookBtn.addEventListener('click', handleDeleteEvent);
		});
	} else {
		return;
	}
}

// function to handle delete event
function handleDeleteEvent(e) {
	const currentTarget = Number(e.target.dataset.id);
	openModal(currentTarget);
	// save currentTarget in global variable
	currentBookId = currentTarget;
}

// event listener for cancel modal btn
modalCancelBtn.addEventListener('click', closeModal);

// event listener for delete modal btn
modalDeleteBtn.addEventListener('click', handleDeleteModalBtn.bind(currentBookId));

// function to handle delete modal btn
function handleDeleteModalBtn(currentBookId) {
	// let result = myLibrary.filter((book) => book._id != currentTarget);
	// console.log(result);
	deleteBook(findBook(myLibrary, currentBookId));
	updateLibraryInLocalStorage();
	renderUi();
	closeModal();
}
