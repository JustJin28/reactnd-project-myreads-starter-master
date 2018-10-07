import React from 'react'

const Book = (props) => {
  let url = (props.book.imageLinks) ? 'url(' + props.book.imageLinks.thumbnail + ')' : '';
  let auth = (props.book.authors && props.book.authors.length > 0) ? props.book.authors : [];

return (
  <div className="book">
    <div className="book-top">
      <div className="book-cover" style={{width: 128, height: 193, backgroundImage: url.toString()}}></div>
        <div className="book-shelf-changer">
          <select onChange={(e) => props.onBookShelfChange(props.book, e.target.value)}
            value={props.book.shelf}>
              <option value="" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{props.book.title}</div>
        <div className="book-authors">
          {Array.isArray(auth)?auth.join(', '):''}
        </div>
      </div>
    );
  }

export default Book;
