import "./plantillapage.css";
import { useTranslation } from "react-i18next";
import { createContext, useEffect, useState } from "react";
import ConfigGeneral from "../configurationpage/general/configgeneral";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import JugadorsPage from "./jugadors/jugadorspage";
import EntrenadorsPage from "./entrenadors/entrenadorspage";
import DelegatsPage from "./delegats/delegatspage";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import { useActiveCampaign } from "../../hooks/campaignHook";

export const EquipContext = createContext();

const PlantillaPage = ({ props }) => {
  const { t, i18n } = useTranslation("common");
    const {
    campaigns,
    tabMenuItems,
    activeIndex,
    setActiveByIndex,
    activeCampaign,
    activeCampaignId,
    seasonLabel
  } = useActiveCampaign();
  const [equips, setEquips] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [subActiveIndex, setSubActiveIndex] = useState(0);


  useEffect(() => {
    if (activeCampaign !== null) {
      gestorfutbolService
        .getCategories(activeCampaignId)
        .then((data) => {
          let results = data.data;
          setCategories(results);
        })
        .then(() => {
          gestorfutbolService.getEquips(activeCampaignId).then((data) => {
            let results = data.data;
            setEquips(results);
            setSelectedEquip(results[0]);
          });
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
      setActiveByIndex(e.index);
      let result = campaigns[e.index];
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

  const groupedEquips = () => {
    if (categories == null) return [];

    let grups = categories.map((c) => {
      return {
        label: c.nom,
        items: c.equips,
      };
    });

    return grups;
  };

  const equipProps = {
    id: "equip",
    label: t("t.selecciona.equip"),
    value: selectedEquip ? selectedEquip.id : null,
    onChange: (e) => {
      let equip = equips.find((c) => c.id === e.value);
      setSelectedEquip(equip);
    },
    options: groupedEquips(),
    optionLabel: "nom",
    optionValue: "id",
    className: "w-60",
    optionGroupLabel: "label",
    optionGroupChildren: "items",
    filter: true,
  };

  return (
    <div className="container p-2 p-xl-4">
      <PageTitle props={{ title: `${t("t.plantilla")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="d-flex gap-4 align-items-center mb-3 mt-3">
        <SelectOneMenu props={equipProps}></SelectOneMenu>
      </div>
      <TabMenuComponent props={subTabMenu}></TabMenuComponent>
      <EquipContext.Provider
        value={{ selectedEquip }}
      >
        {renderContenido()}
      </EquipContext.Provider>
    </div>
  );
};

export default PlantillaPage;
