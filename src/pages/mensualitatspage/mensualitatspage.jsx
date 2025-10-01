import { useTranslation } from "react-i18next";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import "./mensualitatspage.css";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Stepper } from "primereact/stepper";
import BasicButton from "../../components/basicbutton/basicbutton";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { ConfigContext } from "../../App";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import { StepperPanel } from "primereact/stepperpanel";
import FormInputText from "../../components/forminputtext/forminputtext";
import FormCalendar from "../../components/formcalendar/formcalendar";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";

const NominaContext = createContext();

const NominaDataForm = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");
  const { formikMensualitat } = useContext(NominaContext);
  const [plantilla, setPlantilla] = useState(null);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepperRef = useRef(null);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [nomines, setNomines] = useState(null);
  const [estatsPagament, setEstatsPagament] = useState(null);

  const emptyNomina = {
    id: null,
    membre: null,
    mensualitat: null,
    estatPagament: null,
    dataPagament: null,
    quantitat: 0,
  };

  useEffect(() => {
    let results;
    const filter = {
      campanyaActiva: formikMensualitat.values.mensualitat.campanya,
    };
    gestorfutbolService.getMembresPlantilla(filter).then((data) => {
      results = data.data;
      setPlantilla(results);
    });
  }, []);

  useEffect(() => {
    gestorfutbolService.getEstatsPagament().then((data) => {
      let results = data.data;

      const estatsFormatejats = results.map((item) => ({
        valor: item.valor,
        nom: t(`t.estat.${item.valor}`),
      }));
      setEstatsPagament(estatsFormatejats);
    });
  }, []);

  useEffect(() => {
    formikMensualitat.setFieldValue("mensualitat.nomines", nomines);
  }, [nomines]);

  const dataNaixementBody = (rowData) => {
    // Crear objeto Date
    const fecha = new Date(rowData.dataNaixement);

    // Obtener día, mes y año
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const anio = fecha.getFullYear();

    // Formatear como dd/mm/yyyy
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return (
      <>
        {viewWidth <= 900 ? (
          <span className="fw-bold">{t("t.data.naixement")}</span>
        ) : (
          <></>
        )}
        <span>{fechaFormateada}</span>
      </>
    );
  };

  const tableColumns = [
    { field: "id", header: `${t("t.jugador")}` },
    {
      field: "nom",
      header: `${t("t.name")}`,
    },
    {
      field: "llinatge1",
      header: `${t("t.surname1")}`,
    },
    {
      field: "llinatge2",
      header: `${t("t.surname2")}`,
    },
    {
      field: "dataNaixement",
      header: `${t("t.data.naixement")}`,
      body: dataNaixementBody,
    },
  ];

  const tableProps = {
    dataKey: "id",
    data: plantilla,
    selectedData: selectedPlantilla,
    selectionMode: "checkbox",
    rowSelectionMode: "multiple",
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedPlantilla(e.value);
      }
    },
    columns: tableColumns,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    onPage: (e) => setlazyState(e),
    totalRecords: totalRecords,
    first: lazyState.first,
    stripedRows: true,
  };

  const handleSelectedNomines = (e) => {
    selectedPlantilla.forEach((p) => {
      let nomina = {
        ...emptyNomina,
        mensualitat: formikMensualitat.values.mensualitat.id,
        membre: p.id,
      };
      setNomines((prevNomines) => [...(prevNomines || []), nomina]);
    });
  };

  const nextButtonI = {
    label: `${t("t.endavant")}`,
    icon: "pi pi-arrow-right",
    iconPos: "right",
    className: "rounded-border-btn",
    onClick: () => {
      handleSelectedNomines();
      setActiveStep((prev) => prev + 1);
      stepperRef.current.nextCallback();
    },
  };

  const backButtonI = {
    label: `${t("t.enrrere")}`,
    icon: "pi pi-arrow-left",
    iconPos: "right",
    className: "rounded-border-btn",
    onClick: () => {
      setActiveStep((prev) => prev - 1);
      stepperRef.current.nextCallback();
    },
  };

  /********   Propietats formulari nòmines  ***********************/

  return (
    <div className="row mt-3">
      <Stepper activeStep={activeStep} className="w-100" ref={stepperRef}>
        <StepperPanel header={t("t.seleccio.jugadors")}>
          <div className="row mt-3">
            <TableComponent props={tableProps}></TableComponent>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            <BasicButton props={nextButtonI}></BasicButton>
          </div>
        </StepperPanel>
        <StepperPanel header={t("t.dades.nomina")}>
          {activeStep === 1 &&
            selectedPlantilla !== null &&
            selectedPlantilla.map((d, idx) => {
              const nomProps = {
                id: `nom-${idx}`,
                value: d.nom,
                className: "directiva-form-inputs",
                disabled: true,
              };

              const llinatge1Props = {
                id: `llinatge1-${idx}`,
                value: d.llinatge1,
                className: "directiva-form-inputs",
                disabled: true,
              };

              const llinatge2Props = {
                id: `llinatge2-${idx}`,
                value: d.llinatge2,
                className: "directiva-form-inputs",
                disabled: true,
              };

              const quantitatProps = {
                id: `quantitat-${idx}`,
                value: nomines[idx].quantitat,
                className: "directiva-form-inputs",
                onChange: (e) => {
                  setNomines((prevNomines) => {
                    const updatedNomines = [...(prevNomines || [])];
                    updatedNomines[idx] = {
                      ...updatedNomines[idx],
                      quantitat: e.target.value,
                    };
                    return updatedNomines;
                  });
                },
              };

              const estatPagamentProps = {
                id: `estat-pagament-${idx}`,
                value: nomines[idx].estatPagament,
                onChange: (e) => {
                  setNomines((prevNomines) => {
                    const updatedNomines = [...(prevNomines || [])];
                    updatedNomines[idx] = {
                      ...updatedNomines[idx],
                      estatPagament: e.value,
                    };
                    return updatedNomines;
                  });
                },
                options: estatsPagament,
                optionLabel: "nom",
                optionValue: "valor",
                className: "w-100",
              };

              const dataPagamentProps = {
                id: `dataNaixement-${idx}`,
                value: nomines[idx].dataPagament,
                view: "date",
                dateFormat: "dd/mm/yy",
                onChange: (e) => {
                  setNomines((prevNomines) => {
                    const updatedNomines = [...(prevNomines || [])];
                    updatedNomines[idx] = {
                      ...updatedNomines[idx],
                      dataPagament: e.target.value,
                    };
                    return updatedNomines;
                  });
                },
              };

              return (
                <>
                  {idx === 0 && (
                    <div className="row">
                      <div className="col-2">
                        <span className="fw-bold">{t("t.name")}</span>
                      </div>
                      <div className="col-2">
                        <span className="fw-bold">{t("t.surname1")}</span>
                      </div>
                      <div className="col-2">
                        <span className="fw-bold">{t("t.surname2")}</span>
                      </div>
                      <div className="col-2">
                        <span className="fw-bold">{t("t.quantitat")}</span>
                      </div>
                      <div className="col-2">
                        <span className="fw-bold">{t("t.estat.pagament")}</span>
                      </div>
                      <div className="col-2">
                        <span className="fw-bold">{t("t.data.pagament")}</span>
                      </div>
                    </div>
                  )}
                  <div className="row mt-2">
                    <div className="col-2">
                      <FormInputText props={nomProps}></FormInputText>
                    </div>
                    <div className="col-2">
                      <FormInputText props={llinatge1Props}></FormInputText>
                    </div>
                    <div className="col-2">
                      <FormInputText props={llinatge2Props}></FormInputText>
                    </div>
                    <div className="col-2">
                      <FormInputText props={quantitatProps}></FormInputText>
                    </div>
                    <div className="col-2">
                      <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
                    </div>
                    <div className="col-2">
                      <FormCalendar props={dataPagamentProps}></FormCalendar>
                    </div>
                  </div>
                </>
              );
            })}
          <div className="mt-3 d-flex justify-content-between">
            <BasicButton props={backButtonI}></BasicButton>
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
};

const MensualitatsPage = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [tabMenuItems, setTabMenuItems] = useState([]);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [mensualitats, setMensualitats] = useState(null);
  const [mensualitat, setMensualitat] = useState(null);

  const handleMensualitats = () => {};

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
    const apiFilter = { campanyaActiva: activeCampaign };

    gestorfutbolService.getMensualitats(apiFilter).then(async (data) => {
      const mensualitatsOriginals = data.data;

      const mensualitatsEnriquides = await Promise.all(
        mensualitatsOriginals.map(async (m) => {
          if (m.nomines && m.nomines.length > 0) {
            const apiFilterMembres = {
              campanyaActiva: activeCampaign,
              ids: m.nomines.map((n) => n.membre),
            };

            try {
              const membresData = await gestorfutbolService.getMembresPlantilla(apiFilterMembres);
              const membres = membresData.data;

              const nominesCompletes = m.nomines.map((n) => {
                const membre = membres.find((r) => r.id === n.membre);
                return { ...n, membre };
              });

              return { ...m, nomines: nominesCompletes };
            } catch (error) {
              console.error("Error al cargar membres:", error);
              return m;
            }
          } else {
            return m;
          }
        })
      );

      setMensualitats(mensualitatsEnriquides);
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

  const saveNomines = (data) => {
    console.log(data);
    gestorfutbolService.saveMensualitat(data.mensualitat).then(() => {
      let apiFilter = {
        campanyaActiva: activeCampaign,
      };
      gestorfutbolService.getMensualitats(apiFilter).then((data) => {
        let results = data.data;
        setMensualitats(results);
      });
    });
    setCaptureDialog(false);
  };

  const formikMensualitat = useFormik({
    initialValues: {
      mensualitat: mensualitat,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
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

                const newButton = {
                  label: `${t("t.alta.nomines")}`,
                  className: "rounded-border-btn",
                  onClick: () => {
                    setMensualitat(m);
                    setCaptureDialog(true);
                  },
                };

                let tableProps = null;

                if (m.nomines && m.nomines.length > 0) {
                  console.log(m);
                  const tableColumns = [
                    { field: "membre.id", header: `${t("t.jugador")}` },
                    {
                      field: "membre.nom",
                      header: `${t("t.name")}`,
                    },
                    {
                      field: "membre.llinatge1",
                      header: `${t("t.surname1")}`,
                    },
                    {
                      field: "membre.llinatge2",
                      header: `${t("t.surname2")}`,
                    },
                    {
                      field: "quantitat",
                      header: `${t("t.quantitat")}`,
                    },
                    {
                      field: "estatPagament",
                      header: `${t("t.estat.pagament")}`,
                    },
                    {
                      field: "dataPagament",
                      header: `${t("t.data.pagament")}`,
                      body: (rowData) => {
                        if (rowData.dataPagament) {
                          // Crear objeto Date
                          const fecha = new Date(rowData.dataPagament);
                          // Obtener día, mes y año
                          const dia = String(fecha.getDate()).padStart(2, "0");
                          const mes = String(fecha.getMonth() + 1).padStart(
                            2,
                            "0"
                          ); // Los meses van de 0 a 11
                          const anio = fecha.getFullYear();
                          // Formatear como dd/mm/yyyy
                          const fechaFormateada = `${dia}/${mes}/${anio}`;
                          return <span>{fechaFormateada}</span>;
                        } else {
                          return <span></span>;
                        }
                      },
                    },
                  ];
                  tableProps = {
                    dataKey: "id",
                    data: m.nomines,
                    columns: tableColumns,
                    rowsPerPageOptions: [5, 10, 25, 50],
                    breakpoint: "900px",
                    stripedRows: true,
                  };
                }

                return (
                  <AccordionTab
                    key={m.id}
                    header={header}
                    className="main-color"
                    contentClassName="main-color"
                    headerClassName="main-color"
                  >
                    {m.nomines && m.nomines.length > 0 ? (
                      <TableComponent props={tableProps}></TableComponent>
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
            <form onSubmit={formikMensualitat.handleSubmit}>
              <NominaContext.Provider
                value={{ activeCampaign, formikMensualitat }}
              >
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
