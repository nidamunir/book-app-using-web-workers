import React from 'react';

const BookDetails = (props) => {
	const book = props.location.state.book;
	return (
		<div>
			<h3>Title: {book['best_book'][0]['title'][0]}</h3>
			<img src={book['best_book'][0]['image_url'][0]} alt="book_cover" />

			<h6>Author: {book['best_book'][0]['author'][0]['name'][0]}</h6>
			<h6>Cumulative Rating: {book['average_rating'][0]}</h6>
			<h6>Ratings Count: {book['ratings_count'][0]['_']}</h6>
			<h6>Text Review Count: {book['text_reviews_count'][0]['_']}</h6>
		</div>
	);
};

export default BookDetails;
