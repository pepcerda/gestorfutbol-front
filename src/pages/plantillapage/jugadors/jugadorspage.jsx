import "./jugadorspage.css";
import { useTranslation } from "react-i18next";
import { createContext, useContext, useEffect, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import BasicButton from "../../../components/basicbutton/basicbutton";
import TableComponent from "../../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import FormInputText from "../../../components/forminputtext/forminputtext";
import { ConfigContext } from "../../../App";
import { gestorfutbolService } from "../../../services/real/gestorfutbolService";
import FormCalendar from "../../../components/formcalendar/formcalendar";
import SelectOneMenu from "../../../components/selectonemenu/selectonemenu";
import { EquipContext } from "../plantillapage";
import React from "react";
import moment from "moment";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import { useActiveCampaign } from "../../../hooks/campaignHook";

const JugadorContext = createContext();
const FiltraContext = createContext();

const FilterDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { formikFilters, tipoSocis } = useContext(FiltraContext);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();

  const dataDonacioCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString, "YYYY-MM-DD");
    if (value !== null) {
      return dateMomentObject.toDate();
    } else {
      return new Date();
    }
  };

  const nomCompletProps = {
    id: "nomComplet",
    label: `${t("t.nom.complet")}`,
    value: formikFilters.values.nomComplet,
    onChange: (e) => {
      formikFilters.setFieldValue("nomComplet", e.target.value);
    },
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomCompletProps}></FormInputText>
        </div>
      </div>
    </>
  );
};

const JugadorsDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedJugador, setSelectedJugador, formikJugador, posicions } =
    useContext(JugadorContext);

  const [selectCheck, setSelectedCheck] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikJugador.touched[name] && formikJugador.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikJugador.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const dataNaixamentCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString);
    return dateMomentObject.toDate();
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikJugador.values.nom,
    onChange: (e) => {
      formikJugador.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikJugador.values.llinatge1,
    onChange: (e) => {
      formikJugador.setFieldValue("llinatge1", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("llinatge1") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("llinatge1") ? "form-text-invalid" : ""
    }`,
  };

  const llinatge2Props = {
    id: "llinatge2",
    label: `${t("t.surname2")}`,
    value: formikJugador.values.llinatge2,
    onChange: (e) => {
      formikJugador.setFieldValue("llinatge2", e.target.value);
    },
  };

  const dataNaixementProps = {
    id: "dataNaixement",
    label: `${t("t.data.naixement")}`,
    value: dataNaixamentCalc(formikJugador.values.dataNaixement),
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikJugador.setFieldValue("dataNaixement", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataNaixement") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataNaixement") ? "form-text-invalid" : ""
    }`,
  };

  const posicioProps = {
    id: "posicio",
    label: `${t("t.posicio")}`,
    value: formikJugador.values.posicio.id,
    onChange: (e) => {
      formikJugador.setFieldValue(
        "posicio",
        posicions.find((p) => p.id === e.value)
      );
    },
    options: posicions,
    optionLabel: "valor",
    optionValue: "id",
    classNameError: `${isFormFieldInvalid("posicio") ? "invalid-select" : ""}`,
    labelClassName: `${
      isFormFieldInvalid("posicio") ? "form-text-invalid" : ""
    }`,
  };

  const addRow = () => {
    const newRow = {
      id: null,
      nom: "",
      email: "",
      telefon: "",
    };
    formikJugador.setFieldValue("contactes", [
      ...formikJugador.values.contactes,
      newRow,
    ]);
  };

  const addButton = {
    icon: "pi pi-plus",
    onClick: addRow,
    type: "button",
    className: "circular-btn basicbutton",
    tooltip: t("t.afegeix.contacte"),
    tooltipOptions: { position: "top" },
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomProps}></FormInputText>
          {getFormErrorMessage("nom")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={llinatge1Props}></FormInputText>
          {getFormErrorMessage("llinatge1")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={llinatge2Props}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormCalendar props={dataNaixementProps} />
          <br />
          {getFormErrorMessage("dataNaixement")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={posicioProps}></SelectOneMenu>
          {getFormErrorMessage("posicio")}
        </div>

        <Panel header={t("t.contactes").toUpperCase()} className="mt-4">
          <div className="row">
            {formikJugador.values.contactes &&
              formikJugador.values.contactes.map((c, index) => {
                const nomContacteProps = {
                  id: `nomContacte${index}`,
                  label: `${t("t.name")}`,
                  value: formikJugador.values.contactes[index].nom,
                  onChange: (e) => {
                    let contactes = formikJugador.values.contactes;
                    contactes[index].nom = e.target.value;
                    formikJugador.setFieldValue("contactes", contactes);
                  },
                };

                const emailContacteProps = {
                  id: `emailContacte${index}`,
                  label: `${t("t.email")}`,
                  value: formikJugador.values.contactes[index].email,
                  onChange: (e) => {
                    let contactes = formikJugador.values.contactes;
                    contactes[index].email = e.target.value;
                    formikJugador.setFieldValue("contactes", contactes);
                  },
                };

                const telefonContacteProps = {
                  id: `telefonContacte${index}`,
                  label: `${t("t.telefon")}`,
                  value: formikJugador.values.contactes[index].telefon,
                  onChange: (e) => {
                    let contactes = formikJugador.values.contactes;
                    contactes[index].telefon = e.target.value;
                    formikJugador.setFieldValue("contactes", contactes);
                  },
                };

                return (
                  <>
                    <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                      <FormInputText props={nomContacteProps}></FormInputText>
                    </div>
                    <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                      <FormInputText props={emailContacteProps}></FormInputText>
                    </div>
                    <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                      <FormInputText
                        props={telefonContacteProps}
                      ></FormInputText>
                    </div>
                  </>
                );
              })}

            <div className="col-12 form-group text-center text-md-start mt-3">
              <BasicButton props={addButton}></BasicButton>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
};

const JugadorsPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [jugadors, setJugadors] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const { selectedEquip } = useContext(EquipContext);
    const {
    campaigns,
    tabMenuItems,
    activeIndex,
    setActiveByIndex,
    activeCampaign,
    activeCampaignId,
  } = useActiveCampaign();
  const [posicions, setPosicions] = useState([]);

  let emptyJugador = {
    id: null,
    campanya: activeCampaignId,
    equip: selectedEquip,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    dataNaixement: null,
    posicio: "",
    contactes: [],
  };
  const [selectedJugador, setSelectedJugador] = useState(emptyJugador);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });

  const [filterVisible, setFilterVisible] = useState(false);

  const textEditor = (options) => {
    const textProps = {
      type: "text",
      value: options.value,
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormInputText props={textProps} />;
  };

  const calendarEditor = (options) => {
    let dateString = options.value;
    let dateMomentObject = moment(dateString, "YYYY-MM-DD");
    let dateObject = dateMomentObject.toDate();

    const calendarProps = {
      value: dateObject,
      dateFormat: "dd/mm/yy",
      view: "date",
      onChange: (e) => {
        options.editorCallback(
          moment(e.target.value).format("YYYY-MM-DD").toString()
        );
      },
    };
    return <FormCalendar props={calendarProps} />;
  };

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
    { field: "id", header: `${t("t.jugador")}`, sortable: true },
    {
      field: "nom",
      header: `${t("t.name")}`,
      editor: (options) => textEditor(options),
      sortable: true,
    },
    {
      field: "llinatge1",
      header: `${t("t.surname1")}`,
      editor: (options) => textEditor(options),
      sortable: true,
    },
    {
      field: "llinatge2",
      header: `${t("t.surname2")}`,
      editor: (options) => textEditor(options),
      sortable: true,
    },
    {
      field: "dataNaixement",
      header: `${t("t.data.naixement")}`,
      body: dataNaixementBody,
      editor: (options) => calendarEditor(options),
      sortable: true,
    },
    {
      field: "posicio.valor",
      header: `${t("t.posicio")}`,
      sortable: true,
    },
  ];

  const accept = () => {
    gestorfutbolService.deleteJugador(selectedJugador.id);
    setDeleteFlag(true);
  };

  const reject = () => {
    setDeleteFlag(false);
  };

  const confirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: `${t("t.confirm.delete")}`,
      icon: "pi pi-info-circle",
      acceptClassName: "rounded-border-btn basicbutton",
      rejectClassName: "confirm-popup-reject",
      acceptLabel: t("t.yes"),
      rejectLabel: t("t.no"),
      accept,
      reject,
    });
  };

  const deleteButton = {
    icon: "pi pi-trash",
    className: "circular-btn",
    disabled: selectedJugador.id === null,
    onClick: confirm,
    tooltip: `${t("t.elimina")}`,
    tooltipOptions: {
      position: "bottom",
    },
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedJugador(emptyJugador);
      formikJugador.resetForm();
      setCaptureDialog(true);
    },
    tooltip: `${t("t.nou")}`,
    tooltipOptions: {
      position: "bottom",
    },
  };

  const editButton = {
    icon: "pi pi-pencil",
    className: "circular-btn",
    onClick: () => {
      setCaptureDialog(true);
    },
    tooltip: `${t("t.edita")}`,
    tooltipOptions: {
      position: "bottom",
    },
    disabled: selectedJugador.id === null,
  };

  const filterButton = {
    icon: "pi pi-filter",
    className: "circular-btn",
    onClick: () => {
      setFilterVisible(!filterVisible);
    },
    tooltip: `${t("t.filtra")}`,
    tooltipOptions: {
      position: "bottom",
    },
  };

  const cercaFormButton = {
    icon: "pi pi-search",
    label: `${t("t.search")}`,
    type: "submit",
    className: "p-2 rounded-2 mx-2",
    onClick: () => {
      if (viewWidth < process.env.REACT_APP_XL_VW) setFilterVisible(false);
    },
  };

  const netejaFormButton = {
    className: "p-2 rounded-2 mx-2",
    label: `${t("t.neteja")}`,
    type: "button",
    onClick: () => {
      formikFilters.resetForm();
      setlazyState((prevState) => ({
        ...prevState,
        filters: null,
      }));
      setFilterVisible(false);
    },
  };

  useEffect(() => {
    gestorfutbolService.getAllPosicions().then((data) => {
      let results = data.data;
      //results.map((r) => (r.descripcion = t(`t.pos.${r.name}`)));
      setPosicions(results);
    });
  }, []);

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag, activeCampaign, selectedEquip]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaignId,
      equipActiu: selectedEquip ? selectedEquip.id : null,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };

    gestorfutbolService.getJugadors(apiFilter).then((data) => {
      let results = data.data;
      setJugadors(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveJugador(newData).then(() => loadLazyData());
  };

  const onSort = (event) => {
    event.page = lazyState.page;
    setlazyState(event);
  };

  const tableProps = {
    data: jugadors,
    selectedData: selectedJugador,
    selectionMode: "single",
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedJugador(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedJugador(emptyJugador);
    },
    columns: tableColumns,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    onPage: (e) => setlazyState(e),
    totalRecords: totalRecords,
    first: lazyState.first,
    onSort: onSort,
    sortOrder: lazyState.sortOrder,
    sortField: lazyState.sortField,
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    rowEditor: true,
    stripedRows: true,
  };

  const saveJugador = (data) => {
    if (selectedJugador.id) {
      data.id = selectedJugador.id;
      data.equip = selectedJugador.equip;
    }

    const filtered = data.contactes.filter(
      (c) =>
        c.nom.trim() !== "" || c.email.trim() !== "" || c.telefon.trim() !== ""
    );

    data.contactes = filtered;

    gestorfutbolService.saveJugador(data).then(() => {
      setCaptureDialog(false);
      loadLazyData();
    });
  };

  const filterJugador = (data) => {
    let jugadorFilters = {};
    if (data.nomComplet) {
      jugadorFilters.nomComplet = {
        value: data.nomComplet,
        matchMode: "contains",
      };
    }

    setlazyState((prevState) => ({
      ...prevState,
      filters: jugadorFilters,
    }));
  };

  const hideDialog = () => {
    setCaptureDialog(false);
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

  const formikJugador = useFormik({
    initialValues: {
      nom: selectedJugador.nom,
      llinatge1: selectedJugador.llinatge1,
      llinatge2: selectedJugador.llinatge2,
      dataNaixement: selectedJugador.dataNaixement,
      posicio: selectedJugador.posicio,
      campanya:  activeCampaignId,
      equip: selectedJugador.equip ? selectedJugador.equip.id : null,
      contactes: selectedJugador.contactes ? selectedJugador.contactes : [],
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
      if (!data.posicio) {
        errors.posicio = t("t.empty.field");
      }
      if (!data.dataNaixement) {
        errors.dataNaixement = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveJugador(data);
    },
  });

  const formikFilters = useFormik({
    initialValues: {
      nomComplet: "",
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      return errors;
    },
    onSubmit: (data) => {
      filterJugador(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <div className="row justify-content-between align-items-start flex-wrap">
        <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={filterButton} />
        </div>

        <div className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={newButton} />
          <BasicButton props={editButton} />
          <BasicButton props={deleteButton} />
        </div>
      </div>
      {filterVisible && viewWidth > process.env.REACT_APP_XL_VW ? (
        <Card className="mt-3">
          <form onSubmit={formikFilters.handleSubmit}>
            <FiltraContext.Provider value={{ formikFilters }}>
              <FilterDataForm />
            </FiltraContext.Provider>
            <div className="p-dialog-footer pb-0 mt-5">
              <BasicButton props={cercaFormButton} />
              <BasicButton props={netejaFormButton} />
            </div>
          </form>
        </Card>
      ) : (
        <Sidebar visible={filterVisible} onHide={() => setFilterVisible(false)}>
          <form onSubmit={formikFilters.handleSubmit}>
            <FiltraContext.Provider value={{ formikFilters }}>
              <FilterDataForm />
            </FiltraContext.Provider>
            <div className="p-dialog-footer pb-0 mt-5 text-center">
              <BasicButton props={cercaFormButton} />
              <BasicButton props={netejaFormButton} />
            </div>
          </form>
        </Sidebar>
      )}
      <div className="row mt-3">
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.nou.jugador").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikJugador.handleSubmit}>
          <JugadorContext.Provider
            value={{
              selectedJugador,
              setSelectedJugador,
              formikJugador,
              posicions,
            }}
          >
            <JugadorsDataForm />
          </JugadorContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default JugadorsPage;
