import React, { Component } from 'react';
import { transformBooksDictionary } from '../services/bookService';
import { Link } from 'react-router-dom';
class AllBooks extends Component {

	state ={
		books :[],
		nextBooks:[],
		start :0,
		booksDict:[]
	}
	handleBookClick = (book) => {
		this.props.history.push({
			pathname: '/bookDetails',
			state: {
				book: book
			}
		});
	};
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = (event) => {
		const wrappedElement = document.getElementById('books');
		if (this.isBottom(wrappedElement)) {
			console.log('header bottom reached');
			//this.updateBooks();
		}
	};
	isBottom(el) {
		return el.getBoundingClientRect().bottom <= window.innerHeight;
	}

	// updateBooks = () => {
	// 	if (this.state.nextBooks.length !== 0) {
	// 		const books = [ ...this.state.books, ...this.state.nextBooks ];
	// 		const nextBooks = [];
	// 		this.setState({ books, nextBooks });
	// 	} else {
	// 		//this.loadMoreBooks();
	// 		console.log("load ore books");
	// 	}
	// };
	//  componentDidMount() {
	// 	window.addEventListener('scroll', this.handleScroll);
	// 	const { booksDict,totalResults,searchString,pagesCount } = this.props.location.state; 
	
	// 	let booksArray= transformBooksDictionary(booksDict);
	// 	let books = this.state.books.slice(0,10);
	// 	let nextBooks = this.state.books.slice(10,20);
	// 	this.setState({booksArray,books,nextBooks});
	// }
	render() {
		const { booksDict,totalResults,searchString,pagesCount } = this.props.location.state; 
		let books= transformBooksDictionary(booksDict);
		//const books = this.state.books;
		return (
			<div>
				{searchString.length >0 &&
				<h5>Total Results {totalResults} for {searchString}</h5>}
			 	{searchString.length ===0 &&
				<h5>Please enter a book name.</h5>}
			
				<ul id="books">
					{books.map((item) => (
						<li key={new Date().getTime() + item['best_book'][0]['id'][0]['_'] + item['id'][0]['_']}>
							<h6>Title: {item['best_book'][0]['title'][0]}</h6>
							<h6>Author: {item['best_book'][0]['author'][0]['name'][0]}</h6>
							<img key={item.id} src={item['best_book'][0]['image_url'][0]} alt="book cover" />
							<br />
							<Link
								to={{
									pathname: '/bookDetails',
									state: { book: item }
								}}
							>
								See Details
							</Link>
							<hr />
							{/* <h4 onClick={() => this.handleBookClick(item)}>{item.title}</h4> */}
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default AllBooks;
