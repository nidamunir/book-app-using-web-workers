import React, { Component } from 'react';
import { transformBooksDictionary } from '../services/bookService';
import { Link } from 'react-router-dom';
class AllBooks extends Component {

	state ={
		books :[],
		nextBooks:[],
		start :0,
		list :[]	 
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
 
	// updateBooks = () =>{
	//  	console.log(this.state.list);
	// 	let { start,books,nextBooks,list } = this.state; 
	// 	console.log("prev books...");
	// 	console.log(this.state.books);
	// 	console.log(this.state.start);
	// 	console.log(this.state.nextBooks);
	// 	nextBooks = list.slice(start,start+10);
	// 	start += 10;
	// 	books = [...books,nextBooks];
	// 	this.setState({books,nextBooks,start,list}, () =>console);
		 
	// }
	handleScroll = (event) => {
		const wrappedElement = document.getElementById('books');
		if (this.isBottom(wrappedElement)) {
			console.log('header bottom reached');
			this.updateBooks();
		}
	};
	isBottom(el) {
		return el.getBoundingClientRect().bottom <= window.innerHeight;
	}

 
	render() {
		const { totalResults,searchQuery } = this.props.location.state; 
		const { booksDict } = this.props.location.state; 
		const books= transformBooksDictionary(booksDict);
	
	 
		console.log(books);
		return (
			<div>
				{searchQuery.length >0 &&
				<h5>Total Results {totalResults} for {searchQuery}</h5>}
			 	{searchQuery.length ===0 &&
				<h5>Please enter a book name.</h5>}
			
				<ul id="books">
					{books.map((item) => (
						<li key={new Date().getTime() + item['best_book'][0]['id'][0]['_'] + item['id'][0]['_']} onClick={() => this.handleBookClick(item)}>
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
					 
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default AllBooks;
