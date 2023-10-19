import "./App.css";
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Shelves from "./components/Shelves";
import Book from "./components/Book";
import * as BooksAPI from "./BooksAPI";

function App() {
  const [books, setBooks] = useState([]);
  const [keywordQuery, setKeywordQuery] = useState("");
  const [queryForBook, setQueryForBook] = useState([]);
  const [concatBook, setConcatBook] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const bookshelves = [
    { value: "currentlyReading", name: "Currently Reading" },
    { value: "wantToRead", name: "Want to Read" },
    { value: "read", name: "Read" },
  ];
  const addBooks = (data) => {
    const v = data.map((book) => {
      return Object.fromEntries([[book.id, book]]);
    });
    return v;
  };
  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data); 
      setMyBooks(addBooks(data));
    });
  }, []);

  useEffect(() => {
    if (keywordQuery.trim() !== "") {
      BooksAPI.search(keywordQuery, 10).then((data) => {
        setQueryForBook(data.error ? [] : data);
      });
      return () => {
        setQueryForBook([]);
      };
    }
  }, [keywordQuery]);

  useEffect(() => {
    const listBooks = queryForBook.map((item) => {
      let temp;
      if (myBooks) {
        temp = myBooks.filter((x) => {
          if (item.id === Object.keys(x)[0]) {
            item["shelf"] = Object.values(x)[0].shelf;
          }
          return item.id === Object.keys(x)[0];
        });
      }
      return item;
    });
    setConcatBook(listBooks);
  }, [queryForBook]);

const reset = () => {
  setKeywordQuery('');
}

  const updateBookShelf = (book, shelf) => {
    let isUpdate = false;
    let booksUpdate = [...books];

    const isHave = books.findIndex((item) => item.id === book.id);
    if (isHave!== -1) {
      isUpdate = true;
      book.shelf = shelf;
      booksUpdate[isHave] = book;
    } 
    let temp;
    if (myBooks && !isUpdate) {
      temp = myBooks.filter((x) => {
        return book.id === Object.keys(x)[0];
      });
      if (!temp.length) {
        book.shelf = shelf;
        booksUpdate.push(book);
      }
    }
    setBooks(booksUpdate);
    setMyBooks(addBooks(booksUpdate));
    BooksAPI.update(book, shelf);
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/search"
          element={
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search" onClick={reset}>
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN"
                    value={keywordQuery}
                    onChange={(e) => setKeywordQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {concatBook.map((item) => (
                    <li key={item.id}>
                      <Book book={item} handleChange={updateBookShelf} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                {/* {console.log('bôk', books)} */}
                <Shelves
                  books={books}
                  bookshelves={bookshelves}
                  updateBookShelf={updateBookShelf}
                />
              </div>
              <div className="open-search">
                <Link to="search">Add a book</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
