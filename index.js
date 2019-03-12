const express = require('express');
const app = express();
const axios = require('axios');

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use(express.json());

app.listen(5000, () => console.log('listening'));
app.post('/api/books', function(req, res, next) {
	const searchString = req.body.searchString;
	const page = req.body.page;
	let url ='https://www.goodreads.com/search.xml?key=yuRphoNkZPJyCCeneZBZMA&q=' + searchString + '&page=' + page; 
	console.log(url);
	let data = '';
	axios
		.get(url)
		.then((result) => {
			 
			data = result.data;

			const parseString = require('xml2js').parseString;
			let goodReads;
			parseString(data, function(err, result) {
			//	if(result != null)
			//	{
					goodReads = {
						query: result.GoodreadsResponse.search[0]['query'][0],
						resultsStart: result.GoodreadsResponse.search[0]['results-start'][0],
						resultsEnd: result.GoodreadsResponse.search[0]['results-end'][0],
						totalResults: result.GoodreadsResponse.search[0]['total-results'][0],
						results: result.GoodreadsResponse.search[0].results[0].work
					};

			//	}
				if (err) {
					console.log(err);
				}
			});
			res.send(goodReads);
		});
	 
});

