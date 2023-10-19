import React from 'react';
import Book from './Book';

const Shelves = ({ books, updateBookShelf, bookshelves }) => {
  return (
    <div>
      {
        bookshelves.map(shelf => {
          const shelfName = books.filter(val => val.shelf === shelf.value);
           return(<div key={shelf.value}  className="bookshelf">
              <h2 className="bookshelf-title">{shelf.name}</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {shelfName
                  .map(item => (<li key={item.id}>
                    <Book book={item} handleChange={updateBookShelf} />
                  </li>))
                  }
                </ol>
              </div>
            </div>);
        })}</div>
            );
        }

export default Shelves;