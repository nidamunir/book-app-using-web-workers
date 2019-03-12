import http from './httpService';
// import 'xml2js';

// export function getBooks(options) {
// 	// return http.post(apiEndpoint, movie);
// 	return http.post('http://localhost:5000/api/books', options);
// }

// export function parseXmlResponseToJson(data) {
// 	const parseString = require('xml2js').parseString;
// 	let goodReads;
// 	parseString(data, function(err, result) {
// 		goodReads = {
// 			query: result.GoodreadsResponse.search[0]['query'][0],
// 			resultsStart: result.GoodreadsResponse.search[0]['results-start'][0],
// 			resultsEnd: result.GoodreadsResponse.search[0]['results-end'][0],
// 			totalResults: result.GoodreadsResponse.search[0]['total-results'][0],
// 			results: result.GoodreadsResponse.search[0].results[0].work
// 		};
// 		if (err) {
// 			alert('An error occurred while showing results.');
// 		}
// 	});
// 	return goodReads;
// }

// export function mapToViewModel(results) {
// 	let books = [];

// 	results.map((r) => {
// 		let book = {
// 			id: new Date().getTime() + r['best_book'][0]['id'][0]['_'] + r['id'][0]['_'],
// 			avgRating: r['average_rating'][0],
// 			title: r['best_book'][0]['title'][0],
// 			imgUrl: r['best_book'][0]['image_url'][0],
// 			author: r['best_book'][0]['author'][0]['name'][0],
// 			textReviewCount: r['text_reviews_count'][0]['_'],
// 			ratingsCount: r['ratings_count'][0]['_']
// 		};

// 		books.push(book);
// 	});
// 	return books;
// }

export function transformBooksDictionary(booksDict) {
	let books=[];
	for(let i=0 ; i< booksDict.length;i++)
	{
		books= [...books,...booksDict[i].value];
	}
	return books;
}
