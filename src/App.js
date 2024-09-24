import './App.css';
import {createContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import {Route, Routes, Switch} from "react-router-dom";
import EntryPage from "./pages/entrypage/entrypage";
import HomePage from "./pages/homepage/homepage";
import ProtectedPage from "./pages/protectedpage/protectedpage";
import NotFoundPage from "./pages/notfoundpage/notfoundpage";

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
                <Routes>
                    <Route path={"/"} element={<ProtectedPage/>}>
                        <Route path={"/"} element={<HomePage/>}></Route>
                        <Route path="*" element={<NotFoundPage/>}></Route>
                    </Route>
                </Routes>
            </ViewWidthContext.Provider>
        </KindeProvider>
    );
}

export default App;
