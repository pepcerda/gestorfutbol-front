import "./navbar.css";
import { NavLink, redirect } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { ConfigContext } from "../../App";
import { Menu } from "primereact/menu";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "primereact/colorpicker";
import { MegaMenu } from "primereact/megamenu";
import { Menubar } from "primereact/menubar";

const HorizontalBar = ({ props }) => {
  /*En función del índice, cambiar el estado y navegadr a un sitio u otro con el evento onTabChange*/
  const [activeIndex, setActiveIndex] = useState(3);

  /*Utilizamos este hook para eliminar la clase que añade por defecto el componente TabMenu en el elemento seleccionado por defecto*/
  useEffect(() => {
    const eliminateAriaSelected = () => {
      const attributes = document.getElementsByClassName("sidenav-item");
      for (var i = 0; i < attributes.length; i++) {
        attributes.item(i).classList.remove("p-highlight");
      }
    };

    eliminateAriaSelected();
  }, []);

  return (
    <TabMenu
      model={props}
      className="d-flex justify-content-center tabmenu"
      activeIndex={undefined}
    />
  );
};

const Sidebar = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);

  return (
    <div className="sidenav">
      <Menu model={props} className="sidenav-menu"></Menu>
    </div>
  );
};

const Navbar = () => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");

  const items = [
    {
      className: "sidenav-item",

      template: () => {
        return (
          <NavLink to={"/home"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-home fs-2"></span>
            <span className="p-menuitem-text">{t("t.home")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/campanya"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-book fs-2"></span>
            <span className="p-menuitem-text">{t("t.campaigns")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/socis"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-users fs-2"></span>
            <span className="p-menuitem-text">{t("t.members")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/patrocinadors"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-wallet fs-2"></span>
            <span className="p-menuitem-text">{t("t.sponsors")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/directiva"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-users fs-2"></span>
            <span className="p-menuitem-text">{t("t.directive")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/plantilla"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-sitemap fs-2"></span>
            <span className="p-menuitem-text">{t("t.plantilla")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/factures"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-money-bill fs-2"></span>
            <span className="p-menuitem-text">{t("t.caixa.fixa")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/mensualitats"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-money-bill fs-2"></span>
            <span className="p-menuitem-text">{t("t.mensualitats")}</span>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/configuracio"} className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-cog fs-2"></span>
            <span className="p-menuitem-text">{t("t.settings")}</span>
          </NavLink>
        );
      },
    },
  ];

  const visibleItems = [
    {
      className: "sidenav-item",

      template: () => {
        return (
          <NavLink to={"/home"} className="p-menuitem-link">
            <>
              <i className="pi pi-home"></i>
            </>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/campanya"} className="p-menuitem-link">
            <i className="pi pi-book"></i>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/socis"} className="p-menuitem-link">
            <>
              <i className="pi pi-users"></i>
            </>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/patrocinadors"} className="p-menuitem-link">
            <i className="pi pi-calendar"></i>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/factures"} className="p-menuitem-link">
            <i className="pi pi-money-bill"></i>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/mensualitats"} className="p-menuitem-link">
            <i className="pi pi-money-bill"></i>
          </NavLink>
        );
      },
    },
    {
      className: "sidenav-item ",
      template: () => {
        return (
          <NavLink to={"/plantilla"} className="p-menuitem-link">
            <i className="pi pi-sitemap"></i>
          </NavLink>
        );
      },
    },
  ];

  const items1 = [
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Features',
        icon: 'pi pi-star'
    },
    {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
            {
                label: 'Components',
                icon: 'pi pi-bolt'
            },
            {
                label: 'Blocks',
                icon: 'pi pi-server'
            },
            {
                label: 'UI Kit',
                icon: 'pi pi-pencil'
            },
            {
                label: 'Templates',
                icon: 'pi pi-palette',
                items: [
                    {
                        label: 'Apollo',
                        icon: 'pi pi-palette'
                    },
                    {
                        label: 'Ultima',
                        icon: 'pi pi-palette'
                    }
                ]
            }
        ]
    },
    {
        label: 'Contact',
        icon: 'pi pi-envelope'
    }
];

  /*    {
            className: "sidenav-item ",
                template: () => {
            return (
                <NavLink to={"/directiva"} className="p-menuitem-link">
                    <i className="pi pi-users"></i>
                </NavLink>
            );
        },
        },
        {
            className: "sidenav-item ",
                template: () => {
            return (
                <NavLink
                    to={"/configuracio"}
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
        }*/

  return (
    <>
      {viewWidth <= process.env.REACT_APP_XL_VW ? (
        <div className="card burger-menu-card">
        <Menubar model={items} className="burger-menu ml-5"/>
    </div>
      ) : (
        <Sidebar props={items}></Sidebar>
      )}
    </>
  );
};

export default Navbar;
