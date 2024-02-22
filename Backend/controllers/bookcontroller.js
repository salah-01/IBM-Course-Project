const books = require('../model/books.json');
const fs = require("fs");

function isbnPromise(isbn) {
    return new Promise((resolve, reject) => {
        const data = books.filter(({ ISBN }) => ISBN === isbn);
        if (data.length === 0) reject("There is no book matches the ISBN.");
        else resolve(data);
    });
};


const getBookList = (req, res) => {
    // Get all books available
    res.status(200).json({ "Books": books });
};

const getAllBooksByAsync = async (req, res) => {
    const allBooks = await fs.readFile('model/books.json', 'utf-8', (err, data) => {
        if (err) console.log(err);
        else res.send(JSON.parse(data));
    });
};

const getBookByISBN = async (req, res) => {
    const { isbnNumber } = req.body;
    if (isbnNumber) {
        const result = await books.find(({ ISBN }) => ISBN === isbnNumber);
        if (!result) res.send(`There is no book with id = ${isbnNumber}`);
        else {
            res.send(result);
        }
    } else {
        res.send("ISBN is required");
    }
};

const getBooksByAuthor = async (req, res) => {
    const aut = req.params.author;
    if (aut) {
        const result = await books.filter(({ author }) => author === aut);
        if (!result) res.send(`There is no book with author name = ${author}`);
        else {
            res.send(result);
        }
    } else {
        res.send("Author name is required");
    }
};

const getBooksByTitle = async (req, res) => {
    const tit = req.params.title;
    if (tit) {
        const result = await books.filter(({ title }) => title === tit);
        if (!result) res.send(`There is no book with title name = ${tit}`);
        else {
            res.send(result);
        }
    } else {
        res.send("Title name is required");
    }
};

const getReviewsOfABook = async (req, res) => {
    const bookName = req.params.book;
    if (bookName) {
        const result = await books.find(({ title }) => title === bookName);
        if (!result) res.send(`There is no book with title name = ${tit}`);
        else {
            const { review } = result;
            res.send(review);
        }
    } else {
        res.send("Title name is required");
    }
};

const modifyBookReview = async (req, res) => {
    const bookName = req.params.book;
    const { rev } = req.body;
    const id = req.user;
    if (bookName && rev) {
        const result = await books.find(({ title }) => title === bookName);
        if (!result) res.send(`There is no book with title name = ${tit}`);
        else {
            const foundedReview = await result.review.find((review) => review.userId == id);
            if (foundedReview) {
                foundedReview.comment = rev;
            }
            else {
                const comment = rev;
                const userId = id;
                await result.review.push({ userId, comment });
            }
            const filteredArray = await books.filter(({ title }) => title !== bookName);
            const unSortedArray = [...filteredArray, result];
            const sortedArray = await unSortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
            await fs.writeFile('model/books.json', JSON.stringify(sortedArray, null, 2), err => {
                if (err) console.log(err);
                else console.log('The file is successfully written!');
            });
            res.status(201).json({ "msg": `Your review for '${bookName}' added/modified successfully.` });
        }
    } else {
        res.send("Book name or the new review is required");
    }
};

const getBooksByISBNByP = (req, res) => {
    const isbn = req.params.isbn;
    if (isbn) {
        isbnPromise(isbn).then((data) => {
            res.send(data);
        }).catch((message) => {
            res.status(404).json({ "msg": message });
        });
    };
};

const deleteBookReview = async (req, res) => {
    try {
        // Know which user is this
        const Id = req.user;
        console.log("\n User ID : " + Id + "\n");
        // Which book
        const bookName = req.body.bookName;
        // Get his reviews
        const foundedBooks = [];
        for (let i = 0; i < books.length; i++) {
            let rl = books[i].review.length;
            for (let j = 0; j < rl; j++) {
                if (books[i].review[j].userId == Id) {
                    await foundedBooks.push(books[i]);
                    var reviewIndex = j;
                }
            }
        }
        console.log(foundedBooks + "\n");
        const wantedBook = await foundedBooks.find(({ title }) => title === bookName);
        if (!wantedBook) res.status(404).json({ "msg": `There are no reviews for '${bookName}' book yet!` });
        // DELETE HIS REVIEW
        wantedBook.review[reviewIndex] = {};
        console.log(wantedBook);
        const filteredArray = await books.filter(({ title }) => title !== bookName);
        const unSortedArray = [...filteredArray, wantedBook];
        const sortedArray = await unSortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
        await fs.writeFile('model/books.json', JSON.stringify(sortedArray, null, 2), err => {
            if (err) console.log(err);
            else console.log('The file is successfully written!');
        });

        res.status(201).json({
            "msg": `Your reviews for '${wantedBook.title}' book has been deleted!`
        });
    }
    catch (err) {
        console.error(err.message);
    }
};

module.exports = {
    getBookList,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    getReviewsOfABook,
    modifyBookReview,
    getAllBooksByAsync,
    getBooksByISBNByP,
    deleteBookReview
};