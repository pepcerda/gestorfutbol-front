import './plantillapage.css';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import ConfigGeneral from "../configurationpage/general/configgeneral";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import JugadorsPage from './jugadors/jugadorspage';
import EntrenadorsPage from './entrenadors/entrenadorspage';
import DelegatsPage from './delegats/delegatspage';

export const CampanyaContext = React.createContext();

const PlantillaPage = ({props}) => {
    const {t, i18n} = useTranslation("common")
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [campaigns, setCampaigns] = useState(null);
    const [tabMenuItems, setTabMenuItems] = useState([]);
    const [subActiveIndex, setSubActiveIndex] = useState(0);

    useEffect(() => {
        let results;
        gestorfutbolService.getAllCampaigns().then((data) => {
            results = data.data;
            setCampaigns(results);
        })
    }, [])

    useEffect(() => {
        if (campaigns !== null) {
            setTabMenuItems(campaigns.map(r => {
                    return {label: r.titol}
                }
            ))
            let year = new Date().getFullYear();
            let campaign = campaigns.find(c =>
                new Date(c.any).getFullYear() === year
            )
            if(campaign) {
                let index = campaigns.findIndex(c => c.id === campaign.id);
                setActiveCampaign(campaign.id);
                setActiveIndex(index);
            } else {
                setActiveCampaign(campaigns[0].id);
            }
        }

    }, [campaigns])



    /********   HOOKS  ***********************/
    const renderContenido = () => {
        // eslint-disable-next-line default-case
        switch (subActiveIndex) {
            case 0:
                return <JugadorsPage></JugadorsPage>
            case 1:
                return <EntrenadorsPage></EntrenadorsPage>
            case 2:
                return <DelegatsPage></DelegatsPage>
        }
    }
    /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/
    const tabMenu = {
        model: tabMenuItems,
        activeIndex: activeIndex,
        onTabChange: (e) => {
            setActiveIndex(e.index);
            let result = campaigns[e.index];
            setActiveCampaign(result.id);
        }
    }

    const subTabMenu = {
        model: [
            {label: `${t("t.jugadors")}`},
            {label: `${t("t.entrenadors")}`},
            {label: `${t("t.delegats")}`},
        ],
        activeIndex: subActiveIndex,
        onTabChange: (e) => {
            setSubActiveIndex(e.index);
        }
    }

    return (
        <div className="container p-2 p-xl-4">
            <PageTitle props={{title: `${t("t.plantilla")}`}}></PageTitle>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            <TabMenuComponent props={subTabMenu}></TabMenuComponent>
            <CampanyaContext.Provider value={{activeCampaign, setActiveCampaign}}>
                {renderContenido()}
            </CampanyaContext.Provider>
        </div>
    );
}


export default PlantillaPage;