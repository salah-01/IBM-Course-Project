const express = require('express');
const router = express.Router();
const bookContoller = require('../controllers/bookcontroller');

// Get the book list available in the shop
router.get('/', bookContoller.getBookList);
// Get the books based on ISBN
router.get('/isbn', bookContoller.getBookByISBN);
// Get all books by Author
router.get('/author/:author', bookContoller.getBooksByAuthor);
// Get all books based on Tilte
router.get('/title/:title', bookContoller.getBooksByTitle);
// Get the reviews of a book
router.get('/review/:book', bookContoller.getReviewsOfABook);
// Modify the book review
router.put('/review/modify/:book', bookContoller.modifyBookReview);
// Get all books by async function
router.get('/async', bookContoller.getAllBooksByAsync);
// Get all books by ISBN by promises
router.get('/isbn/promise/:isbn', bookContoller.getBooksByISBNByP);
// Delete book review
router.delete('/review/delete', bookContoller.deleteBookReview);
module.exports = router;