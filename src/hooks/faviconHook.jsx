export const setFavicon = (url) => {

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
};

