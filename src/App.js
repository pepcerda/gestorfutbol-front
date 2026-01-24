import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Route, Routes, Switch } from "react-router-dom";
import HomePage from "./pages/homepage/homepage";
import ProtectedPage from "./pages/protectedpage/protectedpage";
import BackofficePage from "./pages/backofficepage/backofficepage";
import NotFoundPage from "./pages/notfoundpage/notfoundpage";
import CampaignPage from "./pages/campaignpage/campaignpage";
import MembersPage from "./pages/memberspage/memberspage";
import SponsorsPage from "./pages/sponsorspage/sponsorspage";
import DirectivaPage from "./pages/directivapage/directivapage";
import ConfigurationPage from "./pages/configurationpage/configurationpage";
import { gestorfutbolService } from "./services/real/gestorfutbolService";
import { setFavicon } from "./hooks/faviconHook";
import CaixaFixaPage from "./pages/caixafixapage/caixafixapage";
import PlantillaPage from "./pages/plantillapage/plantillapage";
import MensualitatsPage from "./pages/mensualitatspage/mensualitatspage";
import { QueryClient, useQuery } from "@tanstack/react-query";
import FacturaPage from "./pages/facturespage/facturespage";
import QuotaJugadorsPage from "./pages/quotajugadorspage/quotajugadorspage";

export const ConfigContext = createContext();

const ConfigLoader = () => {
  const { setLogo, setNom, setColor, setColor1, setColor2 } =
    useContext(ConfigContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ["configGeneral"],
    queryFn: gestorfutbolService.getConfiguracioGeneral,
    staleTime: 1000 * 60 * 60 * 24, // 24h sin refetch
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data) {
      const cfg = data.data;
      setLogo(process.env.REACT_APP_URI_BACK + cfg.logo);
      setNom(cfg.nom);
      document.title = cfg.nom;
      setFavicon(process.env.REACT_APP_URI_BACK + cfg.logo);
      setColor(cfg.colorPrincipal);
      setColor1(cfg.colorFons1);
      setColor2(cfg.colorFons2);
    }
  }, [data]);

  if (error) console.error("Error cargando configuración general:", error);
  return null;
};

function App() {
  const [viewWidth, setViewWidth] = useState(window.innerWidth);
  const { t, i18n } = useTranslation("common");
  const [color, setColor] = useState("#000000");
  const [color1, setColor1] = useState("#ee4f4f");
  const [color2, setColor2] = useState("#e8d1d1");
  const [logo, setLogo] = useState(null);
  const [nom, setNom] = useState(null);

  useEffect(() => {
    function handleResize() {
      setViewWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
  }, [viewWidth]);

  useEffect(() => {
    document.documentElement.style.setProperty("--main-color", color);
    document.documentElement.style.setProperty(
      "--gradient-bg",
      `linear-gradient(265deg, ${color1} 12.56%, ${color2} 63.38%)`
    );
  }, [color, color1, color2]);

  return (
    <KindeProvider
      domain={process.env.REACT_APP_KINDE_DOMAIN}
      redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URL}
      clientId={process.env.REACT_APP_KINDE_CLIENT_ID}
      logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URL}
      isDangerouslyUseLocalStorage={process.env.NODE_ENV === "development"}
    >
      <ConfigContext.Provider
        value={{
          viewWidth,
          setViewWidth,
          color,
          setColor,
          logo,
          setLogo,
          nom,
          setNom,
          color1,
          setColor1,
          color2,
          setColor2,
        }}
      >
        {/* 🚀 Carga y cachea la configuración general con React Query */}
        <ConfigLoader />
        <Routes>
          <Route path={"/"} element={<ProtectedPage />}>
            <Route path={"/"} element={<BackofficePage />}>
              <Route path={"/"} element={<HomePage />}></Route>
              <Route path={"/home"} element={<HomePage />}></Route>
              <Route path={"/campanya"} element={<CampaignPage />}></Route>
              <Route path={"/socis"} element={<MembersPage />}></Route>
              <Route path={"/patrocinadors"} element={<SponsorsPage />}></Route>
              <Route path={"/directiva"} element={<DirectivaPage />}></Route>
              <Route
                path={"/configuracio"}
                element={<ConfigurationPage />}
              ></Route>
              <Route path={"/tiquets"} element={<CaixaFixaPage />}></Route>
              <Route path={"/factures"} element={<FacturaPage />}></Route>
              <Route path={"/plantilla"} element={<PlantillaPage />}></Route>
              <Route
                path={"/mensualitats"}
                element={<MensualitatsPage />}
              ></Route>
              <Route
                path={"/quotes-jugadors"}
                element={<QuotaJugadorsPage />}
              ></Route>
              <Route path={"*"} element={<NotFoundPage />}></Route>
            </Route>
          </Route>
        </Routes>
      </ConfigContext.Provider>
    </KindeProvider>
  );
}

export default App;
