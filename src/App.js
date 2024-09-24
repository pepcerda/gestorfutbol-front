import './App.css';
import {createContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import HeaderBar from "./layout/headerbar/headerbar";
import Navbar from "./layout/navbar/navbar";
import ContentLayout from "./layout/contentlayout/contentlayout";
import {KindeProvider} from "@kinde-oss/kinde-auth-react";

export const ViewWidthContext = createContext();

function App() {

    const [viewWidth, setViewWidth] = useState(window.innerWidth);
    const {t, i18n} = useTranslation("common");

    useEffect(() => {
        function handleResize() {
            setViewWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
    }, [viewWidth])
    return (
        <KindeProvider domain={process.env.REACT_APP_KINDE_DOMAIN} redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URL}
                       clientId={process.env.REACT_APP_KINDE_CLIENT_ID} logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URL}
                       isDangerouslyUseLocalStorage={process.env.NODE_ENV === 'development'}>
            <ViewWidthContext.Provider value={{viewWidth, setViewWidth}}>
                <HeaderBar></HeaderBar>
                <div className="main-layout">
                    <Navbar></Navbar>
                    <ContentLayout></ContentLayout>
                </div>
            </ViewWidthContext.Provider>
        </KindeProvider>
    );
}

export default App;
