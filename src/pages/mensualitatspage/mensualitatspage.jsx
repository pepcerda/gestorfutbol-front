import { useTranslation } from "react-i18next";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import "./mensualitatspage.css";
import { createContext, useContext, useEffect, useState } from "react";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import { Accordion, AccordionTab } from "primereact/accordion";
import BasicButton from "../../components/basicbutton/basicbutton";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";

const NominaContext = createContext();

const NominaDataForm = ({ props }) => {

  const {activeCampaign} = useContext(NominaContext); 
  const [plantilla, setPlantilla] = useState(null); 

   useEffect(() => {
    let results;
    const filter = {
      campanyaActiva: activeCampaign
    }
    gestorfutbolService.getMembresPlantilla(filter).then((data) => {
      results = data.data;
      setPlantilla(results);
    });
  }, []);


};

const MensualitatsPage = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [tabMenuItems, setTabMenuItems] = useState([]);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [mensualitats, setMensualitats] = useState(null);

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
      let apiFilter = {
        campanyaActiva: activeCampaign,
      };

      gestorfutbolService.getMensualitats(apiFilter).then((data) => {
        let results = data.data;
        setMensualitats(results);
      });
    }
  }, [activeCampaign]);

  /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/

  const hideDialog = () => {
    setCaptureDialog(false);
  };

  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveIndex(e.index);
      let result = campaigns[e.index];
      setActiveCampaign(result.id);
    },
  };

  const newButton = {
    label: `${t("t.alta.nomines")}`,
    className: "rounded-border-btn",
    onClick: () => {
      setCaptureDialog(true);
    },
  };

  const cancelFormButton = {
    icon: "pi pi-times",
    className: "basicbutton-outlined me-2",
    label: `${t("t.cancel")}`,
    type: "button",
    onClick: hideDialog,
  };

  const saveFormButton = {
    icon: "pi pi-check",
    label: `${t("t.save")}`,
    type: "submit",
    className: "p-2 rounded-2",
  };

  const saveNomines = (data) => {};

  const formikNomina = useFormik({
    initialValues: {
      campanya: activeCampaign,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }
      if (!data.llinatge1) {
        errors.llinatge1 = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveNomines(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <PageTitle props={{ title: `${t("t.mensualitats")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      {mensualitats && mensualitats.length > 0 ? (
        <>
          <Accordion activeIndex={0} className="mt-4 d-flex flex-column gap-3">
            {mensualitats
              .slice() // para no mutar el array original
              .sort((a, b) => {
                const dateA = new Date(a.any, a.mes - 1); // mes - 1 porque en JS enero es 0
                const dateB = new Date(b.any, b.mes - 1);
                return dateA.getTime() - dateB.getTime(); // orden ascendente
              })

              .map((m, index) => {
                const mesFormateado = String(m.mes).padStart(2, "0"); // Asegura formato 01, 02, ..., 12
                const header = `Mensualitat ${mesFormateado}-${m.any}`;

                return (
                  <AccordionTab
                    key={m.id}
                    header={header}
                    className="main-color"
                    contentClassName="main-color"
                    headerClassName="main-color"
                  >
                    {m.nomines && m.nomines.length > 0 ? (
                      <></>
                    ) : (
                      <BasicButton props={newButton}></BasicButton>
                    )}
                  </AccordionTab>
                );
              })}
          </Accordion>
          <Dialog
            visible={captureDialog}
            header={t("t.alta.nomina").toUpperCase()}
            onHide={hideDialog}
          >
            <form onSubmit={formikNomina.handleSubmit}>
              <NominaContext.Provider value={{activeCampaign}}>
                <NominaDataForm />
              </NominaContext.Provider>
              <div className="p-dialog-footer pb-0 mt-5">
                <BasicButton props={cancelFormButton} />
                <BasicButton props={saveFormButton} />
              </div>
            </form>
          </Dialog>
        </>
      ) : (
        <div className="alert alert-info mt-4" role="alert">
          {t("t.no_mensualitats")}
        </div>
      )}
    </div>
  );
};

export default MensualitatsPage;
