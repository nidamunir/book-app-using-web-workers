import axios from 'axios';
import logger from './logService';

axios.interceptors.response.use(null, (error) => {
	const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

	if (!expectedError) {
		logger.log(error);
		console.log('Logging the error');
		//toast.error('An unexected error occurred.');
	}
	console.log(error);
	//return Promise.reject(error);
});

function setJwt(jwt) {
	axios.defaults.headers.common['x-auth-token'] = jwt;
}
export default {
	get: axios.get,
	put: axios.put,
	post: axios.post,
	delete: axios.delete,
	setJwt
};
