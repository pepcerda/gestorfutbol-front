import './App.css';
import {createContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import {Route, Routes, Switch} from "react-router-dom";
import HomePage from "./pages/homepage/homepage";
import ProtectedPage from "./pages/protectedpage/protectedpage";
import BackofficePage from "./pages/backofficepage/backofficepage";
import NotFoundPage from "./pages/notfoundpage/notfoundpage";
import CampaignPage from "./pages/campaignpage/campaignpage";
import MembersPage from './pages/memberspage/memberspage';
import SponsorsPage from "./pages/sponsorspage/sponsorspage";
import DirectivaPage from "./pages/directivapage/directivapage";
import ConfigurationPage from "./pages/configurationpage/configurationpage";
import {gestorfutbolService} from "./services/real/gestorfutbolService";
import {setFavicon} from "./hooks/faviconHook";
import CaixaFixaPage from "./pages/caixafixapage/caixafixapage";
import PlantillaPage from './pages/plantillapage/plantillapage';
import MensualitatsPage from './pages/mensualitatspage/mensualitatspage';

export const ConfigContext = createContext();

function App() {

    const [viewWidth, setViewWidth] = useState(window.innerWidth);
    const {t, i18n} = useTranslation("common");
    const [color, setColor] = useState("#000000");
    const [color1, setColor1] = useState("#ee4f4f");
    const [color2, setColor2] = useState("#e8d1d1");
    const [logo, setLogo] = useState(null);
    const [nom, setNom] = useState(null);

    useEffect(() => {

        gestorfutbolService.getConfiguracioGeneral()
            .then((data) => {
                if(data.data) {
                    setLogo(process.env.REACT_APP_URI_BACK + data.data.logo);
                    setNom(data.data.nom);
                    document.title = data.data.nom;
                    setFavicon(process.env.REACT_APP_URI_BACK + data.data.logo);
                    setColor(data.data.colorPrincipal);
                    setColor1(data.data.colorFons1);
                    setColor2(data.data.colorFons2);
                }
            });
    }, []);

    useEffect(() => {
        function handleResize() {
            setViewWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
    }, [viewWidth])

    useEffect(() => {
        document.documentElement.style.setProperty('--main-color', color);
        document.documentElement.style.setProperty('--gradient-bg', `linear-gradient(265deg, ${color1} 12.56%, ${color2} 63.38%)`);
    }, [color, color1, color2]);

    return (
        <KindeProvider domain={process.env.REACT_APP_KINDE_DOMAIN} redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URL}
                       clientId={process.env.REACT_APP_KINDE_CLIENT_ID} logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URL}
                       isDangerouslyUseLocalStorage={process.env.NODE_ENV === 'development'}>
            <ConfigContext.Provider value={{viewWidth, setViewWidth, color, setColor, logo, setLogo, nom, setNom, color1, setColor1, color2, setColor2}}>
                <Routes>
                    <Route path={"/"} element={<ProtectedPage/>}>
                        <Route path={"/"} element={<BackofficePage/>}>
                            <Route path={"/"} element={<HomePage/>}></Route>
                            <Route path={"/home"} element={<HomePage/>}></Route>
                            <Route path={"/campanya"} element={<CampaignPage/>}></Route>
                            <Route path={"/socis"} element={<MembersPage/>}></Route>
                            <Route path={"/patrocinadors"} element={<SponsorsPage/>}></Route>
                            <Route path={"/directiva"} element={<DirectivaPage/>}></Route>
                            <Route path={"/configuracio"} element={<ConfigurationPage/>}></Route>
                            <Route path={"/factures"} element={<CaixaFixaPage/>}></Route>
                            <Route path={"/plantilla"} element={<PlantillaPage/>}></Route>
                            <Route path={"/mensualitats"} element={<MensualitatsPage/>}></Route>
                            <Route path={"*"} element={<NotFoundPage/>}></Route>
                        </Route>
                    </Route>
                </Routes>
            </ConfigContext.Provider>
        </KindeProvider>
    );
}

export default App;
