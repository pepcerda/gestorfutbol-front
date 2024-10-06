import './navbar.css';
import {NavLink, redirect} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {TabMenu} from "primereact/tabmenu";
import {ViewWidthContext} from "../../App";
import {Menu} from "primereact/menu";
import {useTranslation} from "react-i18next";
import {ColorPicker} from "primereact/colorpicker";

const HorizontalBar = ({props}) => {

    /*En función del índice, cambiar el estado y navegadr a un sitio u otro con el evento onTabChange*/
    const [activeIndex, setActiveIndex] = useState(3);


    /*Utilizamos este hook para eliminar la clase que añade por defecto el componente TabMenu en el elemento seleccionado por defecto*/
    useEffect(() => {
        const eliminateAriaSelected = () => {
            const attributes = document.getElementsByClassName("sidenav-item");
            for(var i = 0; i < attributes.length; i ++) {
                attributes.item(i).classList.remove("p-highlight");
            }
        }

        eliminateAriaSelected();
    }, [])


    return (
        <TabMenu model={props}
                 className="d-flex justify-content-center tabmenu" activeIndex={undefined}/>
    )
}

const Sidebar = ({props}) => {
    const {viewWidth, setViewWidth} = useContext(ViewWidthContext);

    return (
        <div className="sidenav">
            <Menu model={props} className="sidenav-menu"></Menu>
        </div>
    );
}

const Navbar = () => {

    const {viewWidth, setViewWidth} = useContext(ViewWidthContext);
    const {t, i18n} = useTranslation("common");

    const items = [
        {
            className: "sidenav-item",

            template: () => {
                return (
                    <NavLink
                        to={"/home"}
                        className="p-menuitem-link"
                        >
                        {viewWidth <= process.env.REACT_APP_XL_VW ? (
                            <>
                                <i className="pi pi-home"></i>
                            </>
                        ) : (
                            <>
                                <span className="p-menuitem-icon pi pi-fw pi-home fs-2"></span>
                                <span className="p-menuitem-text">{t("t.home")}</span>
                            </>)}
                    </NavLink>
                );
            },
        },
        {
            className: "sidenav-item ",
            template: () => {
                return (
                    <NavLink
                        to={"/campanya"}
                        className="p-menuitem-link">
                        {viewWidth <= process.env.REACT_APP_XL_VW ? (<>
                            <i className="pi pi-users"></i>
                        </>) : (
                            <>
                                <span className="p-menuitem-icon pi pi-fw pi-users fs-2"></span>
                                <span className="p-menuitem-text">{t("t.campaigns")}</span>
                            </>)}
                    </NavLink>
                );
            },
        },
        {
            className: "sidenav-item ",
            template: () => {
                return (
                    <NavLink
                        to={"/trips"}
                        className="p-menuitem-link">
                        {viewWidth <= process.env.REACT_APP_XL_VW ? (
                            <>
                                <i className="pi pi-sign-in"></i>
                            </>
                        ) : (
                            <>
                                <span className="p-menuitem-icon pi pi-fw pi-sign-in fs-2"></span>
                                <span className="p-menuitem-text">{t("t.trips")}</span>
                            </>)}
                    </NavLink>
                );
            },
        },
        {
            className: "sidenav-item ",
            template: () => {
                return (
                    <NavLink
                        to={"/species"}
                        className="p-menuitem-link">
                        {viewWidth <= process.env.REACT_APP_XL_VW ? (
                            <>
                                <i className="pi pi-calendar"></i>
                            </>) : (
                            <>
                                <span className="p-menuitem-icon pi pi-fw pi-calendar fs-2"></span>
                                <span className="p-menuitem-text">{t("t.species")}</span>
                            </>)}

                    </NavLink>
                );
            },
        },
        {
            className: "sidenav-item ",
            template: () => {
                return (
                    <NavLink
                        to={"/configuration"}
                        className="p-menuitem-link">
                        {viewWidth <= process.env.REACT_APP_XL_VW ? (
                            <>
                                <i className="pi pi-cog"></i>
                            </>
                        ) : (
                            <>
                                <span className="p-menuitem-icon pi pi-fw pi-cog fs-2"></span>
                                <span className="p-menuitem-text">{t("t.settings")}</span>
                            </>)}
                    </NavLink>
                );
            },
        }
    ];


    return (
        <>
            {viewWidth <= process.env.REACT_APP_XL_VW ? (
                <HorizontalBar props={items}></HorizontalBar>
            ) : (
                <Sidebar props={items}></Sidebar>
            )}
        </>
    );
}


export default Navbar;