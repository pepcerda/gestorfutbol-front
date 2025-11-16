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
      template: () => {
        return (
            <span className="p-menuitem-link">
              <span className="p-menuitem-text fw-bold">{t("t.ingressos")}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-submenu-icon" aria-hidden="true" data-pc-section="submenuicon"><path d="M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z" fill="currentColor"></path></svg>
            </span>
        );
      },
      items: [
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
      ],
    },
        {
      template: () => {
        return (
            <span className="p-menuitem-link">
              <span className="p-menuitem-text fw-bold">{t("t.despeses")}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-submenu-icon" aria-hidden="true" data-pc-section="submenuicon"><path d="M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z" fill="currentColor"></path></svg>
            </span>
        );
      },
      items: [
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
              <NavLink to={"/tiquets"} className="p-menuitem-link">
                <span className="p-menuitem-icon pi pi-fw pi-money-bill fs-2"></span>
                <span className="p-menuitem-text">{t("t.caixa.fixa")}</span>
              </NavLink>
            );
          },
        },
      ],
    },

    {
      template: () => {
        return (
            <span className="p-menuitem-link">
              <span className="p-menuitem-text fw-bold">{t("t.administracio")}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-submenu-icon" aria-hidden="true" data-pc-section="submenuicon"><path d="M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z" fill="currentColor"></path></svg>
            </span>
        );
      },
      items: [
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
                label: `${t("t.tiquets")}`,
                command: () => {
                  navigate("/tiquets");
                },
              },
            ],
          },
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
        ],
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
          <Menubar
            model={items}
            className="burger-menu ml-5"
            orientation="vertical"
            breakpoint={process.env.REACT_APP_L_VW}
          />
        </div>
      ) : (
        <Sidebar props={itemsPrueba}></Sidebar>
      )}
    </>
  );
};

export default Navbar;
