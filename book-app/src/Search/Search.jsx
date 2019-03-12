import React, { Component } from 'react';
import Input from '../Common/Input';
import worker from '../worker.js';
import { transformBooksDictionary } from '../services/bookService';
import WebWorker from '../workerSetup';
import { Link } from 'react-router-dom';
 

class Search extends Component {
	state = {
		data: {
			searchString: ''
		},
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
		this.worker = new WebWorker(worker);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	loadMoreBooks = () => {
		let options = {
			query: this.state.data.searchString,
			page: this.state.page
		};
		this.worker.postMessage(options);

		this.worker.addEventListener('message', event => {
		 
			//console.log("Recieved message in main thread....");
			console.log(event.data);
			if(typeof event.data == "number")
			{
				console.log("Nummber..setting percentage");
				this.setState({percentage:event.data});
			}
			else{
				this.setState({booksDict: event.data});
				this.sortBooks();
			}
			// let booksDict = []; 			
			// booksDict.push({
			// 	key:   parseInt(data.resultsStart/20),
			// 	value: data.results
			// });
			
			// // get total results, divide by 20 , calculate pagesCount
			// const pagesCount = parseInt((data.totalResults / 20) + 1);
			 
			// this.setState({pagesCount,booksDict, totalResults:data.totalResults});
			// this.loadNextPages();
		});
	}
	// loadNextPages = () =>{
	// 	let {booksDict,pagesCount} = this.state;
	// 	this.nextPageWorker = new WebWorker(worker);
	// 	this.nextPageWorker.addEventListener('message', event => {
	// 		const data = event.data;
		 
	// 		booksDict.push({
	// 			key:   parseInt(data.resultsStart/20),
	// 			value: data.results
	// 		});
		 
	// 		const percentage = parseInt((Object.values( booksDict).length / parseInt( pagesCount) )*100);
	// 		this.setState({booksDict,percentage});
		 
	// 		// if all pages are loaded
	// 		if(Object.keys( booksDict).length ===  pagesCount){
	// 			this.sortBooks();
	// 		}
		 
	// 	});
	// 	for(let i =2; i<=parseInt(this.state.pagesCount);i++)
	// 	{		 
	// 		let options = {
	// 			searchString: this.state.data.searchString,
	// 			page: i
	// 		};
	// 		this.nextPageWorker.postMessage(options);
	// 	}
	// }
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
		 
		let { showSugestions,percentage,pagesCount,booksDict,sortedBooks} = this.state;
		let {searchString} = this.state.data;
		sortedBooks = sortedBooks.slice( sortedBooks.length - 6,  sortedBooks.length-1);
		let totalResults = this.state.totalResults;

		if (totalResults >= 5) {
			totalResults = totalResults - 5;
		}
		if ( searchString.length <= 0) {
			return  ;
		} 
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
									pagesCount: pagesCount,
									totalResults: this.state.totalResults,
									searchString:  searchString}
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
		
		const data = { ...this.state.data };
		data[input.name] = input.value;
		const self = this;
		// if user starts typing aagain, clear previous timeout
		const { typingTimeout } = this.state
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		this.setState((prevState, prevProps) => ({
			data,
			typingTimeout: setTimeout(function () {
				self.loadMoreBooks();
				}, 2000)
		}));
	};
	 

	render() {
		const {booksDict,pagesCount,totalResults} = this.state;
		const {searchString} = this.state.data;
		return (
			<div>
				<form>
				 
					<Input
						type="text"
						name="searchString"
						value={this.state.data.searchString}
						label="search"
						onChange={this.handleChange}
						autoComplete="off"
					/>
					<Link
						to={{
							pathname: '/books',
							state: { booksDict:  booksDict ,
							pagesCount: pagesCount,
							totalResults: totalResults,
							searchString:  searchString}
						}}>
								Search
							</Link>
			
					{this.renderSuggestion()}

					<div />
				</form>
			</div>
		);
	}
}

export default Search;
