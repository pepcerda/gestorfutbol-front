import './configurationpage.css';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import ConfigGeneral from "./general/configgeneral";
import TipoSocisPage from "./tiposocis/tiposocispage";
import CategoriaPage from "./categories/categoriespage";
import CategoriaDespesasPage from './categoriesdespesa/categoriesdespesa';
import ProveidorsPage from './proveidors/proveidors';
import PosicionsPage from './posicions/posicions';
import EditorPlantilles from './editorplantilles/editorplantilles';

const ConfigurationPage = ({props}) => {
        const {t, i18n} = useTranslation("common");
        const [activeIndex, setActiveIndex] = useState(0);
        const tabMenuItems = [
            {label: `${t('t.general')}`},
            {label: `${t('t.tipo.socis')}`},
            {label: `${t('t.categories')}`},
            {label: `${t('t.categories.despesa')}`},
            {label: `${t('t.proveidors')}`},
            {label: `${t('t.posicions')}`},
            {label: `${t('t.editor.plantilles')}`},
        ],
        /********   HOOKS  ***********************/
        renderContenido = () => {
            switch (activeIndex) {
                case 0:
                    return <ConfigGeneral></ConfigGeneral>
                case 1:
                    return <TipoSocisPage></TipoSocisPage>
                case 2:
                    return <CategoriaPage></CategoriaPage>
                case 3:
                    return <CategoriaDespesasPage></CategoriaDespesasPage>
                case 4:
                    return <ProveidorsPage></ProveidorsPage>
                case 5:
                    return <PosicionsPage></PosicionsPage>
                case 6:
                    return <EditorPlantilles></EditorPlantilles>
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