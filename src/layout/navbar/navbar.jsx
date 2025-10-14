import "./navbar.css";
import { NavLink, redirect, useNavigate } from "react-router-dom";
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
      <MegaMenu
        model={props}
        className="sidenav-menu"
        orientation="vertical"
        breakpoint={process.env.REACT_APP_L_VW}
      ></MegaMenu>
    </div>
  );
};

const Navbar = () => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();

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

  const itemsPrueba = [
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
      className: "sidenav-item",
      template: () => {
        return (
          <a href="" className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-money-bill fs-2"></span>
            <span className="p-menuitem-text">{t("t.ingressos")}</span>
          </a>
        );
      },
      items: [
        [
          {
            // No label aquí, así no se reserva espacio para el header
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-users",
                label: `${t("t.members")}`,
                command: () => {
                  navigate("/socis");
                },
              },
            ],
          },
        ],
        [
          {
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-wallet",
                label: `${t("t.sponsors")}`,
                command: () => {
                  navigate("/patrocinadors");
                },
              },
            ],
          },
        ],
      ],
    },

    {
      className: "sidenav-item ",
      label: `${t("t.despeses")}`,
      icon: "pi pi-fw pi-credit-card",
      template: () => {
        return (
          <a href="" className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-credit-card fs-2"></span>
            <span className="p-menuitem-text">{t("t.despeses")}</span>
          </a>
        );
      },
      items: [
        [
          {
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-file",
                label: `${t("t.factures")}`,
                command: () => {
                  navigate("/factures");
                },
              },
            ],
          },
        ],
        [
          {
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-money-bill",
                label: `${t("t.mensualitats")}`,
                command: () => {
                  navigate("/mensualitats");
                },
              },
            ],
          },
        ],
      ],
    },
    {
      className: "sidenav-item ",
      label: `${t("t.administracio")}`,
      icon: "pi pi-fw pi-cog",
      template: () => {
        return (
          <a href="" className="p-menuitem-link">
            <span className="p-menuitem-icon pi pi-fw pi-sitemap fs-2"></span>
            <span className="p-menuitem-text">{t("t.administracio")}</span>
          </a>
        );
      },
      items: [
        [
          {
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-users",
                label: `${t("t.plantilla")}`,
                command: () => {
                  navigate("/plantilla");
                },
              },
            ],
          },
        ],
        [
          {
            items: [
              {
                className: "sidenav-item",
                icon: "pi pi-fw pi-users",
                label: `${t("t.directive")}`,
                command: () => {
                  navigate("/directiva");
                },
              },
            ],
          },
        ]
      ],
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



  return (
    <>
      {viewWidth <= process.env.REACT_APP_XL_VW ? (
        <div className="card burger-menu-card">
          <Menubar model={items} className="burger-menu ml-5" />
        </div>
      ) : (
        <Sidebar props={itemsPrueba}></Sidebar>
      )}
    </>
  );
};

export default Navbar;
