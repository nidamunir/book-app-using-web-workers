import React, { Component } from 'react';
import Input from '../Common/Input';
import worker from '../worker.js';
import { transformBooksDictionary } from '../services/bookService';
import WebWorker from '../workerSetup';
import { Link } from 'react-router-dom';
 

class Search extends Component {
	state = {
		searchQuery: '', 
		totalResults:0,
		booksDict: {'page': 0, 'books': []},	
		sortedBooks: [],
		showSugestions: false,
		page:1,
		typing: false,
		typingTimeout: undefined,
		pagesCount:0,
		percentage:0
	};

	 
	setWrapperRef = (node) => {
		this.wrapperRef = node;
	};
	handleClickOutside = (event) => {
		// handle click outside suggestion box
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ showSugestions: false });
		}
	};
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
		
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		 
	}
 
	loadMoreBooks = () => {
		if(this.worker)
		this.worker.terminate();
		this.worker = new WebWorker(worker);
		let options = {
			query: this.state.searchQuery,
			page: this.state.page
		};

		const self =this;
		this.worker.postMessage(options);
		this.worker.onmessage = function(event) {
			if(typeof event.data == "number")
			{
				self.setState({percentage:event.data});
			}
			else{
				self.setState({booksDict: event.data});
				self.sortBooks();
			}
		 
		}
	}
	 
	sortBooks = () => { 
		const {booksDict} = this.state; 
		 
		let books= transformBooksDictionary(booksDict);
		// books.length is total results
		let sortedBooks = books.sort((a,b) => (a['average_rating'][0] > b['average_rating'][0]) ? 1 : ((b['average_rating'][0] >a['average_rating'][0]) ? -1 : 0));
		
		sortedBooks = sortedBooks.filter(function( obj ) {
			 
				return obj['average_rating'][0] > 0.0;		
		});
	
		this.setState({sortedBooks,showSugestions:true, totalResults:books.length});
	
	}


	renderSuggestion = () => {	 
		
		let { showSugestions,percentage,pagesCount,booksDict,sortedBooks,searchQuery} = this.state;
	 
		sortedBooks = sortedBooks.slice( sortedBooks.length - 6,  sortedBooks.length-1);
		let totalResults = this.state.totalResults;

		if (totalResults >= 5) {
			totalResults = totalResults - 5;
		}
		if ( searchQuery.length <= 0) {
			return  ;
		} 
		// if ( percentage === 100 && totalResults === 0) {
		// 	return  <p>No results found</p>;
		// } 
		if ( sortedBooks.length === 0  ) {
			return <p>Searching... { percentage}%</p>;
		}
		 else
			return (
				<div>
					{ showSugestions && (
						<div ref={this.setWrapperRef}>
						 
							{sortedBooks.map((b) => (
								<Link
									to={{
										pathname: '/bookDetails',
										state: { book: b }
									}}
									key={new Date().getTime() + b['best_book'][0]['id'][0]['_'] + b['id'][0]['_']}
								>
									<p>
										{b['best_book'][0]['title'][0]} - {b['average_rating'][0]}  - {b['best_book'][0]['author'][0]['name'][0]}
									
									</p>
								</Link>
							))}
							<hr />

							<Link
								to={{
									pathname: '/books',
									state: { booksDict:  booksDict ,
									percentage:percentage,
									searchQuery:  searchQuery,
									totalResults:totalResults
								
							}
								}}
							>
								{totalResults + ' more results'}
							</Link>
						</div>
					)}
				</div>
			);
	};
	
	handleChange = ({ currentTarget: input }) => {
		
		const self = this;
		// if user starts typing aagain, clear previous timeout
		const { typingTimeout } = this.state
		if (typingTimeout) {
			clearTimeout(typingTimeout);
			
		}

		this.setState((prevState, prevProps) => ({
			searchQuery:input.value,
			typingTimeout: setTimeout(function () {
			 
				self.loadMoreBooks();
				}, 2000)
		}));
	};
	handleSubmit = () => {
		const {booksDict,totalResults,searchQuery} = this.state;
	 
		this.props.history.push({
			pathname: '/books',	 
			state: { booksDict:  booksDict ,
			totalResults: totalResults,
			searchQuery:  searchQuery}
		});
	}
	isSearchComplete = () => {
		const {percentage} = this.state;
		 
		return percentage === 100 ? false:true;
	}
	render() {
		const {booksDict,pagesCount,totalResults,searchQuery} = this.state;
	 
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
				 
					<Input
						type="text"
						name="searchQuery"
						value={this.state.searchQuery}
						label="search"
						onChange={this.handleChange}
						autoComplete="off"
					/>
					{/* <Link
						to={{
							pathname: '/books',
							state: { booksDict:  booksDict ,
							pagesCount: pagesCount,
							totalResults: totalResults,
							searchQuery:  searchQuery,
						worker : this.worker}
						}}
						disabled={true}
						>
								Search
							</Link> */}
					<button className="btn btn-primary" disabled={this.isSearchComplete()}>Search</button>
					{this.renderSuggestion()}

					<div />
				</form>
			</div>
		);
	}
}

export default Search;
