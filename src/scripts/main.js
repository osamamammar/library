let myLibrary = [];
let clearFormFlag = false;

const bookName = document.querySelector('#bookName');
const authorName = document.querySelector('#authorName');
const pagesNumber = document.querySelector('#pagesNumber');
const statue = document.querySelector('#statue');
const tableBody = document.querySelector('.books_container');
const form = document.querySelector('.form');
const table = document.querySelector('.table');
const errorMsg = document.querySelectorAll('.error-msg');

form.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
	e.preventDefault();
	addBookToLibrary();
	renderUi();
	if (clearFormFlag) {
		clearForm();
	}
}

table.addEventListener('click', (e) => {
	const currentTarget = e.target.parentNode.parentNode.childNodes[1];
	if (e.target.className === 'delete') {
		if (confirm(`are you sure you want to delete ${currentTarget.innerText}`))
			deleteBook(findBook(myLibrary, currentTarget.innerText));
	}
	if (e.target.classList.contains('button')) {
		changeStatue(findBook(myLibrary, currentTarget.innerText));
	}
	updateLocalStorage();
	renderUi();
});

function Book(bookName, authorName, pagesNumber, statue) {
	// the constructor...
	this.bookName = bookName;
	this.authorName = authorName;
	this.pagesNumber = pagesNumber;
	this.statue = statue;
}

function addBookToLibrary() {
	if (
		bookName.value.length === 0 ||
		authorName.value.length === 0 ||
		pagesNumber.value === '' ||
		pagesNumber.value === '0'
	) {
		errorMsg.forEach((error) => (error.style.display = 'block'));
		alert('Please, fill all the fields');
		clearFormFlag = false;
		return;
	}
	const newBook = new Book(bookName.value, authorName.value, pagesNumber.value, statue.value);

	myLibrary.push(newBook);
	updateLocalStorage();
	clearFormFlag = true;
	errorMsg.forEach((error) => (error.style.display = 'none'));
}

function changeStatue(book) {
	if (myLibrary[book].statue === 'read') {
		myLibrary[book].statue = 'not read';
	} else myLibrary[book].statue = 'read';
}

function deleteBook(currentBook) {
	myLibrary.splice(currentBook, currentBook + 1);
}

function findBook(libraryArray, name) {
	if (libraryArray.length === 0 || libraryArray === null) {
		return;
	}

	for (let book of libraryArray)
		if (book.bookName === name) {
			return libraryArray.indexOf(book);
		}
}

function clearForm() {
	bookName.value = '';
	authorName.value = '';
	pagesNumber.value = '';
	statue.value = 'read';
}

function updateLocalStorage() {
	localStorage.setItem('library', JSON.stringify(myLibrary));
}

function checkLocalStorage() {
	if (localStorage.getItem('library')) {
		myLibrary = JSON.parse(localStorage.getItem('library'));
	}
}

function renderUi() {
	checkLocalStorage();
	tableBody.innerHTML = '';
	myLibrary.map((book) => {
		const htmlBookRow = `
      <tr>
        <td>${book.bookName}</td>
        <td>${book.authorName}</td>
        <td>${book.pagesNumber}</td>
        <td><button class="button ${book.statue === 'read' ? 'dark' : ''}">${
			book.statue
		}</button></td>
        <td><button class="delete"></button></td>
      </tr>
      `;
		tableBody.insertAdjacentHTML('afterbegin', htmlBookRow);
	});
}

renderUi();
