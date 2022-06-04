import axios from 'axios';
import { addAccessTokenInterceptor, refreshErrorInterceptor, refreshInterceptor } from '../auth/interceptor';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(addAccessTokenInterceptor);
axiosInstance.interceptors.response.use(refreshInterceptor, refreshErrorInterceptor);

export { axiosInstance };
