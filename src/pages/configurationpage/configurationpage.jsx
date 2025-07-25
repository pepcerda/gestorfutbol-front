import './configurationpage.css';
import BasicButton from "../../components/basicbutton/basicbutton";
import {useFormik} from "formik";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import FormInputText from "../../components/forminputtext/forminputtext";
import PageTitle from "../../components/pagetitle/pagetitle";
import {Toast} from "primereact/toast";
import {ConfigContext} from "../../App";
import ColorPickerInput from "../../components/colorpickerinput/colorpickerinput";
import FileUploader from "../../components/fileuploader/fileuploader";
import {setFavicon} from "../../hooks/faviconHook";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import ConfigGeneral from "./general/configgeneral";
import TipoSocisPage from "./tiposocis/tiposocispage";

const ConfigurationPage = ({props}) => {
    const {t, i18n} = useTranslation("common"), [activeIndex, setActiveIndex] = useState(0), tabMenuItems = [
            {label: `${t('t.general')}`},
            {label: `${t('t.tipo.socis')}`},
        ],
        /********   HOOKS  ***********************/
        renderContenido = () => {
            switch (activeIndex) {
                case 0:
                    return <ConfigGeneral></ConfigGeneral>
                case 1:
                    return <TipoSocisPage></TipoSocisPage>
            }
        },
        /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/
        tabMenu = {
            model: tabMenuItems,
            activeIndex: activeIndex,
            onTabChange: (e) => {
                setActiveIndex(e.index);
            }
        };


    return (
        <div className="container p-2 p-xl-4">
            <PageTitle props={{title: `${t("t.settings")}`}}></PageTitle>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            {renderContenido()}
        </div>
    );
}


export default ConfigurationPage;