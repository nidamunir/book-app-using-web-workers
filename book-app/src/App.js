import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Search from './Search/Search';
import NavBar from './navbar';
import './App.css';
import BookDetails from './Books/BookDetails';
import AllBooks from './Books/AllBooks';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				 
				<NavBar />
				<main className="container">
					<Switch>
						<Route path="/search" component={Search} />
						<Route path="/books" component={AllBooks} />
						<Route path="/bookDetails" component={BookDetails} />
					</Switch>
				</main>
			</React.Fragment>
		);
	}
}

export default App;
