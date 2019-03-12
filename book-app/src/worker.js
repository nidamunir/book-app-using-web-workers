 
export default () => {
	let booksDictionary = []; 			
	let pagesCount = 0;
	let percentage=0;
	let page = 1;
	let query="";
	self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
		if (!e) return;
		page = e.data.page;
		query = e.data.query;
		console.log("Recieved message in worker thread...page# " 
		+ page + " Search query " + query);
		getBooks( query, page);
		
	})
	function getBooks(query,page) {
		console.log("Fetching books..." + query + " page# " + page);
 
		const options = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({searchString: query,page:page})
		}
	   fetch("http://localhost:5000/api/books",options)
	   .then(function(response){ 
		   return response.json(); 
	   })
	   .then(function(data){ 
		   booksDictionary.push({
			   key:   parseInt(data.resultsStart/20),
			   value: data.results
		   });
		   pagesCount =parseInt((data.totalResults / 20) + 1);
		   
		   percentage = parseInt((Object.values(booksDictionary).length / parseInt( pagesCount) )*100);
		  // console.log("Posting message with percentage..." + percentage);
		   postMessage(percentage);
		   	   // update page 
			
			
			if(page === pagesCount)
			{
				postMessage(booksDictionary);
				console.log("All pages have been loaded." );
			}
			else{
				page = page+1;
				console.log("Incrementing page# to " +page + " " );
				getBooks(query,page);
			}
	   
	   });

	}
}