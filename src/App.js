import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Shelf from './Shelf'
import Book from './Book'
import {Link} from 'react-router-dom'
import {Route} from 'react-router-dom'

class BooksApp extends React.Component {
    state = {
        books: [],
        Search: '',
        SearchResults: []
    };

    componentDidMount() {
        this.ShowBooks();
    };

    ShowBooks() {
        BooksAPI.getAll().then((books) => {
            this.setState({books})
        })
    };

    QueryUpdate = (Search) => {
        this.setState({Search: Search.trimLeft()});

        if (Search.length === 0) {
            this.setState({SearchResults: ""});
        }
        else {
            this.setState({SearchResults: ""});
            BooksAPI.search(Search.trimLeft()).then((SearchResults) => {
                if (Array.isArray(SearchResults) && SearchResults.length > 0) {
                    SearchResults.map((searchBook, index) => {
                        let temp = this.state.books.filter((shelfBook) => {
                            return shelfBook.id === searchBook.id;
                        });
                        if (Array.isArray(temp) && temp.length > 0) {
                            SearchResults[index].shelf = temp[0].shelf;
                        }
                        else {
                            SearchResults[index].shelf = "none";
                        }
                        return temp;
                    });
                    this.setState({SearchResults});
                    this.ShowBooks();
                }
            })
        }
    };

    SwitchShlef = (book, shelf) => {
        BooksAPI.update(book, shelf).then((books) => {
            if (books) {
                this.ShowBooks();
                this.QueryUpdate(this.state.Search);
            }
        })
    };

    render() {
      const {Search} = this.state;
      let results = this.state.SearchResults;
      results = (results && results.length >= 1) ? results : [];

      return (
        <div className="app">
          <Route path="/search"
            render={() => (
              <div className="search-books">
                <div className="search-books-bar">
                  <Link to="/" className="close-search"
                    onClick={() => (
                      this.setState({Search: ""}, {results: ""})
                    )}>Close</Link>
                  <div className="search-books-input-wrapper">
                    <input type="text"
                      placeholder="Search for a book"
                      value={Search}
                      onChange={(event) => this.QueryUpdate(event.target.value)}/>

                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">
                  {
                    results.map((eachBook, index) => (
                      <li key={index} className='contact-list-item'>
                        <Book
                          onBookShelfChange={this.SwitchShlef}
                            book={eachBook}
                            />
                      </li>
                    ))
                  }
                </ol>
              </div>
            </div>
          )}
          />
          <Route exact path="/"
            render={() => (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <Shelf onBookShelfChange={this.SwitchShlef} shelfTitle={"Currently Reading"}
                      shelfName={"currentlyReading"} books={this.state.books}/>
                    <Shelf onBookShelfChange={this.SwitchShlef} shelfTitle={"Want to Read"}
                      shelfName={"wantToRead"} books={this.state.books}/>
                    <Shelf onBookShelfChange={this.SwitchShlef} shelfTitle={"Read"}
                      shelfName={"read"} books={this.state.books}/>
                  </div>
                </div>
                <div className="open-search">
                  <Link to='/search'>Add a book</Link>
                </div>
              </div>
            )}
          />
        </div>
      )
    }
}

export default BooksApp;
