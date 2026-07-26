import axios from 'axios';
import { gooeyToast } from 'goey-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred'

        gooeyToast.error('An Error Has Occured', {
            description: errorMessage
        })

        return Promise.reject(error);
    }
)

export default api