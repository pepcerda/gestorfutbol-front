import axios from 'axios';

const getToken = async () => {
    let accessToken = localStorage.getItem('m2m_access_token');
    let tokenExpiry = localStorage.getItem('m2m_token_expiry');

    if (!accessToken || new Date() > new Date(tokenExpiry)) {
        try {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };
            const response = await axios.post(process.env.REACT_APP_KINDE_OAUTH, {
                client_id: process.env.REACT_APP_KINDE_OAUTH_CLIENT_ID,
                client_secret: process.env.REACT_APP_KINDE_OAUTH_CLIENT_SECRET,
                grant_type: "client_credentials"
            }, axiosConfig);
            accessToken = response.data.access_token;
            const expiresIn = response.data.expires_in; // Assuming the response contains an expires_in field
            const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);
            localStorage.setItem('m2m_access_token', accessToken);
            localStorage.setItem('m2m_token_expiry', expiryDate);
        } catch (error) {
            console.error('Error fetching token:', error);
            throw new Error('Failed to fetch access token');
        }
    }
    return accessToken;
};

const apiMiddleware = async (config) => {
    try {
        const token = await getToken();
        config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
        console.error('Error in middleware:', error);
        throw new Error('Failed to set authorization header');
    }
    return config;
};

export default apiMiddleware;
