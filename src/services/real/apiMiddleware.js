import axios from 'axios';

const getToken = async () => {
    let accessToken = localStorage.getItem('m2m_access_token');

    if (!accessToken) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        const response = await axios.post(process.env.REACT_APP_KINDE_OAUTH, {
            client_id: process.env.REACT_APP_KINDE_OAUTH_CLIENT_ID,
            client_secret: process.env.REACT_APP_KINDE_OAUTH_CLIENT_SECRET,
            grant_type: "client_credentials"
        }, axiosConfig);
        accessToken = response.data.access_token;
        localStorage.setItem('m2m_access_token', accessToken);
    }
    return accessToken;
};

const apiMiddleware = async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
};

export default apiMiddleware;
