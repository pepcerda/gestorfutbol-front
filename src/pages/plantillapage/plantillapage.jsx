import "./plantillapage.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import ConfigGeneral from "../configurationpage/general/configgeneral";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import JugadorsPage from "./jugadors/jugadorspage";
import EntrenadorsPage from "./entrenadors/entrenadorspage";
import DelegatsPage from "./delegats/delegatspage";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";

export const CampanyaContext = React.createContext();

const PlantillaPage = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [equips, setEquips] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [tabMenuItems, setTabMenuItems] = useState([]);
  const [subActiveIndex, setSubActiveIndex] = useState(0);

  useEffect(() => {
    let results;
    gestorfutbolService.getAllCampaigns().then((data) => {
      results = data.data;
      setCampaigns(results);
    });
  }, []);

  useEffect(() => {
    if (campaigns !== null) {
      setTabMenuItems(
        campaigns.map((r) => {
          return { label: r.titol };
        })
      );
      let year = new Date().getFullYear();
      let campaign = campaigns.find(
        (c) => new Date(c.any).getFullYear() === year
      );
      if (campaign) {
        let index = campaigns.findIndex((c) => c.id === campaign.id);
        setActiveCampaign(campaign.id);
        setActiveIndex(index);
      } else {
        setActiveCampaign(campaigns[0].id);
      }
    }
  }, [campaigns]);

  useEffect(() => {
    if (activeCampaign !== null) {
      gestorfutbolService.getEquips(activeCampaign).then((data) => {
        let results = data.data;
        setEquips(results);
        setSelectedEquip(results[0]);
      });
    }
  }, [activeCampaign]);

  /********   HOOKS  ***********************/
  const renderContenido = () => {
    // eslint-disable-next-line default-case
    switch (subActiveIndex) {
      case 0:
        return <JugadorsPage></JugadorsPage>;
      case 1:
        return <EntrenadorsPage></EntrenadorsPage>;
      case 2:
        return <DelegatsPage></DelegatsPage>;
    }
  };
  /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/
  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveIndex(e.index);
      let result = campaigns[e.index];
      setActiveCampaign(result.id);
    },
  };

  const subTabMenu = {
    model: [
      { label: `${t("t.jugadors")}` },
      { label: `${t("t.entrenadors")}` },
      { label: `${t("t.delegats")}` },
    ],
    activeIndex: subActiveIndex,
    onTabChange: (e) => {
      setSubActiveIndex(e.index);
    },
  };

  const categoriaProps = {
    id: "equip",
    label: t("t.selecciona.equip"),
    value: selectedEquip ? selectedEquip.id : null,
    onChange: (e) => {
      let category = equips.find((c) => c.id === e.value);
      setSelectedEquip(category);
    },
    options: equips,
    optionLabel: "nom",
    optionValue: "id",
    className: "w-auto",
  };

  return (
    <div className="container p-2 p-xl-4">
      <PageTitle props={{ title: `${t("t.plantilla")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="d-flex gap-4 align-items-center mb-3 mt-3">
        <SelectOneMenu props={categoriaProps}></SelectOneMenu>
      </div>
      <TabMenuComponent props={subTabMenu}></TabMenuComponent>
      <CampanyaContext.Provider
        value={{ activeCampaign, setActiveCampaign, selectedEquip }}
      >
        {renderContenido()}
      </CampanyaContext.Provider>
    </div>
  );
};

export default PlantillaPage;
