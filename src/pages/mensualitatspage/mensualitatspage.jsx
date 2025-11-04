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
import FormInputNumber from "../../components/forminputnumber/forminputnumber";
import { use } from "react";
import moment from "moment";
import TableNoRespComponent from "../../components/tablenorespcomponent/tablenorespcomponent";
import { FilterMatchMode } from "primereact/api";
import { Divider } from "primereact/divider";

const NominaContext = createContext();

const NominaDataForm = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");
  const { formikMensualitat, selectedCategoria } = useContext(NominaContext);
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
  const [filters, setFilters] = useState({
    nomComplet: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

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
      categoriaActiva: selectedCategoria ? selectedCategoria.id : null,
    };
    gestorfutbolService.getMembresPlantilla(filter).then((data) => {
      results = data.data.map((m) => ({
        ...m,
        nomComplet: `${m.nom} ${m.llinatge1 ?? ""} ${m.llinatge2 ?? ""}`.trim(),
      }));
      setPlantilla(results);
    });
  }, []);

  useEffect(() => {
    if (
      formikMensualitat.values.mensualitat &&
      Array.isArray(formikMensualitat.values.mensualitat.nomines)
    ) {
      if (
        formikMensualitat.values.mensualitat.nomines.every(
          (n) => typeof n.membre === "object" && n !== null
        )
      ) {
        const nominesCorregides =
          formikMensualitat.values.mensualitat.nomines.map((n) => {
            let nomina = {
              ...n,
              membre: n.membre.id,
            };
            return nomina;
          });

        setNomines(nominesCorregides);
        setSelectedPlantilla(
          formikMensualitat.values.mensualitat.nomines.map((n) => n.membre)
        );
      } else {
        setNomines(formikMensualitat.values.mensualitat.nomines);

        let ident = formikMensualitat.values.mensualitat.nomines.map((n) => {
          return n.membre;
        });
        const apiFilterMembres = {
          campanyaActiva: formikMensualitat.values.mensualitat.campanya,
          categoriaActiva: selectedCategoria ? selectedCategoria.id : null,
          ids: ident,
        };
        gestorfutbolService
          .getMembresPlantilla(apiFilterMembres)
          .then((data) => {
            setSelectedPlantilla(data.data);
          });
      }
    }
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
        <span>{fechaFormateada}</span>
      </>
    );
  };

  const tableColumns = [
    {
      field: "nomComplet",
      header: `${t("t.name")}`,
      filter: true,
      filterField: "nomComplet",
      className: "mw-60vw",
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
    filterDisplay: "row",
    filters: filters,
    showFilterMatchModes: false,
    globalFilterFields: ["nomComplet"],
  };

  const handleSelectedNomines = (e) => {
    selectedPlantilla.forEach((p) => {
      if (nomines && !nomines.find((n) => n.membre === p.id)) {
        let nomina = {
          ...emptyNomina,
          mensualitat: formikMensualitat.values.mensualitat.id,
          membre: p.id,
        };
        setNomines((prevNomines) => [...(prevNomines || []), nomina]);
      }
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
    label: `${t("t.endarrere")}`,
    icon: "pi pi-arrow-left",
    iconPos: "right",
    className: "rounded-border-btn",
    type: "button",
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
            <TableNoRespComponent props={tableProps}></TableNoRespComponent>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            <BasicButton props={nextButtonI}></BasicButton>
          </div>
        </StepperPanel>
        <StepperPanel header={t("t.dades.nomina")}>
          {activeStep === 1 &&
            selectedPlantilla !== null &&
            selectedPlantilla.map((d, idx) => {
              const dataPagamentCalc = (value) => {
                let dateString = value;
                let dateMomentObject = moment(dateString);
                return dateMomentObject.toDate();
              };

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
                mode: "currency",
                currency: "EUR",
                onValueChange: (e) => {
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
                value: dataPagamentCalc(nomines[idx].dataPagament),
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
                  {viewWidth <= process.env.REACT_APP_XL_VW ? (
                    <>
                      <Divider className="mt-2 mb-2" />
                      <div className="row">
                        <div className="col-12">
                          <span className="fw-bold">{idx + 1}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">{t("t.name")}</span>
                          <FormInputText props={nomProps}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">{t("t.surname1")}</span>
                          <FormInputText props={llinatge1Props}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">{t("t.surname2")}</span>
                          <FormInputText props={llinatge2Props}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">{t("t.quantitat")}</span>
                          <FormInputNumber
                            props={quantitatProps}
                          ></FormInputNumber>
                        </div>
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">
                            {t("t.estat.pagament")}
                          </span>
                          <SelectOneMenu
                            props={estatPagamentProps}
                          ></SelectOneMenu>
                        </div>
                        <div className="col-12 col-lg-2">
                          <span className="fw-bold">
                            {t("t.data.pagament")}
                          </span>
                          <FormCalendar
                            props={dataPagamentProps}
                          ></FormCalendar>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {idx === 0 && (
                        <div className="row">
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">{t("t.name")}</span>
                          </div>
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">{t("t.surname1")}</span>
                          </div>
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">{t("t.surname2")}</span>
                          </div>
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">{t("t.quantitat")}</span>
                          </div>
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">
                              {t("t.estat.pagament")}
                            </span>
                          </div>
                          <div className="col-12 col-lg-2">
                            <span className="fw-bold">
                              {t("t.data.pagament")}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="row mt-2">
                        <div className="col-12 col-lg-2">
                          <FormInputText props={nomProps}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <FormInputText props={llinatge1Props}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <FormInputText props={llinatge2Props}></FormInputText>
                        </div>
                        <div className="col-12 col-lg-2">
                          <FormInputNumber
                            props={quantitatProps}
                          ></FormInputNumber>
                        </div>
                        <div className="col-12 col-lg-2">
                          <SelectOneMenu
                            props={estatPagamentProps}
                          ></SelectOneMenu>
                        </div>
                        <div className="col-12 col-lg-2">
                          <FormCalendar
                            props={dataPagamentProps}
                          ></FormCalendar>
                        </div>
                      </div>
                    </>
                  )}
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
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [tabMenuItems, setTabMenuItems] = useState([]);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [mensualitats, setMensualitats] = useState(null);
  const [mensualitat, setMensualitat] = useState(null);
  const [estatsPagament, setEstatsPagament] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const handleMensualitats = () => {};

  useEffect(() => {
    let results;
    gestorfutbolService.getAllCampaigns().then((data) => {
      results = data.data;
      setCampaigns(results);
    });

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
        gestorfutbolService.getCategories(activeCampaign).then((data) => {
          let results = data.data;
          setCategories(results);
          setSelectedCategoria(results[0]);
        });
      }
    }, [activeCampaign]);

  useEffect(() => {
    if (activeCampaign !== null) {
      const apiFilter = { 
        campanyaActiva: activeCampaign
       };

      gestorfutbolService.getMensualitats(apiFilter).then(async (data) => {
        const mensualitatsOriginals = data.data;

        const mensualitatsEnriquides = await Promise.all(
          mensualitatsOriginals.map(async (m) => {
            if (m.nomines && m.nomines.length > 0) {
              const apiFilterMembres = {
                campanyaActiva: activeCampaign,
                categoriaActiva: selectedCategoria ? selectedCategoria.id : null,
                ids: m.nomines.map((n) => n.membre),
              };

              try {
                const membresData =
                  await gestorfutbolService.getMembresPlantilla(
                    apiFilterMembres
                  );
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
  }, [activeCampaign, selectedCategoria]);

  /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/

  const hideDialog = () => {
    setCaptureDialog(false);
    formikMensualitat.resetForm();
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

    const categoriaProps = {
    id: "categoria",
    label: t("t.selecciona.categoria"),
    value: selectedCategoria ? selectedCategoria.id : null,
    onChange: (e) => {
      let category = categories.find((c) => c.id === e.value);
      setSelectedCategoria(category);
    },
    options: categories,
    optionLabel: "nom",
    optionValue: "id",
    className: "w-auto",
  };

  const saveNomines = (data) => {
    gestorfutbolService.saveMensualitat(data.mensualitat).then(() => {
      let apiFilter = {
        campanyaActiva: activeCampaign,
      };
      gestorfutbolService.getMensualitats(apiFilter).then(async (data) => {
        const mensualitatsOriginals = data.data;

        const mensualitatsEnriquides = await Promise.all(
          mensualitatsOriginals.map(async (m) => {
            if (m.nomines && m.nomines.length > 0) {
              const apiFilterMembres = {
                campanyaActiva: activeCampaign,
                categoriaActiva: selectedCategoria ? selectedCategoria.id : null,
                ids: m.nomines.map((n) => n.membre),
              };

              try {
                const membresData =
                  await gestorfutbolService.getMembresPlantilla(
                    apiFilterMembres
                  );
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
      <div className="d-flex gap-4 align-items-center mb-3 mt-3">
        <SelectOneMenu props={categoriaProps}></SelectOneMenu>
      </div>
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

                const editButton = {
                  icon: "pi pi-pencil",
                  label: `${t("t.edita")}`,
                  className: "rounded-border-btn",
                  onClick: () => {
                    setMensualitat(m);
                    setCaptureDialog(true);
                  },
                };

                const newButton = {
                  label: `${t("t.alta.nomines")}`,
                  className: "rounded-border-btn",
                  onClick: () => {
                    setMensualitat(m);
                    setCaptureDialog(true);
                  },
                };

                const headerTemplate = () => {
                  return (
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
                      <span className="accordion-header-text">{`Mensualitat ${mesFormateado}-${m.any}`}</span>
                      {m.nomines && m.nomines.length > 0 ? (
                        <>
                          <span className="accordion-header-text">
                            {m.nomines.length} {t("t.nomines")}
                          </span>
                          <BasicButton props={editButton}></BasicButton>
                        </>
                      ) : (
                        <>{t("t.no.mensualitat")}</>
                      )}
                    </div>
                  );
                };

                let tableProps = null;

                const estatPagamentBodyTemplate = (nomina) => {
                  let estat = estatsPagament.find((o) => {
                    return o.valor === nomina.estatPagament;
                  });

                  if (estat != null) {
                    return (
                      <>
                        {viewWidth <= 900 ? (
                          <span className="fw-bold">
                            {t("t.payment.state")}
                          </span>
                        ) : (
                          <></>
                        )}
                        <span
                          className={`${
                            estat.valor === "PAGADA"
                              ? "text-bg-success"
                              : "text-bg-danger"
                          } px-3 py-2 rounded-pill`}
                        >
                          {estat.nom}
                        </span>
                      </>
                    );
                  }
                };

                if (m.nomines && m.nomines.length > 0) {
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
                      body: estatPagamentBodyTemplate,
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
                          return (
                            <>
                              {viewWidth <= 900 ? (
                                <span className="fw-bold">
                                  {t("t.data.pagament")}
                                </span>
                              ) : (
                                <></>
                              )}
                              <span>{fechaFormateada}</span>
                            </>
                          );
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
                    headerTemplate={headerTemplate}
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
            maximizable={true}
            resizable={true}
            className="w-100"
          >
            <form onSubmit={formikMensualitat.handleSubmit}>
              <NominaContext.Provider
                value={{ activeCampaign, formikMensualitat, selectedCategoria}}
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
