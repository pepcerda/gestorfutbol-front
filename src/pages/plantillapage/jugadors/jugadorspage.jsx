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
import { CampanyaContext } from "../plantillapage";
import React from "react";

const JugadorContext = createContext();

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
    value: formikJugador.values.dataNaixement,
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikJugador.setFieldValue("dataNaixement", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataDonacio") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataDonacio") ? "form-text-invalid" : ""
    }`,
  };

  const posicioProps = {
    id: "posicio",
    label: `${t("t.posicio")}`,
    value: formikJugador.values.posicio,
    onChange: (e) => {
      formikJugador.setFieldValue("posicio", e.target.value);
    },
    options: posicions,
    optionLabel: "descripcion",
    optionValue: "name",
    classNameError: `${isFormFieldInvalid("posicio") ? "invalid-select" : ""}`,
    labelClassName: `${
      isFormFieldInvalid("posicio") ? "form-text-invalid" : ""
    }`,
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
          {getFormErrorMessage("dataDonacio")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={posicioProps}></SelectOneMenu>
          {getFormErrorMessage("posicio")}
        </div>
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
  const [campaigns, setCampaigns] = useState(null);
  const { activeCampaign, setActiveCampaign } = useContext(CampanyaContext);
  const [posicions, setPosicions] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  let emptyJugador = {
    id: null,
    campanya: activeCampaign,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    dataNaixement: null,
    posicio: "",
  };
  const [selectedJugador, setSelectedJugador] = useState(emptyJugador);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });

  const textEditor = (options) => {
    const textProps = {
      type: "text",
      value: options.value,
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormInputText props={textProps} />;
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
    { field: "id", header: `${t("t.jugador")}` },
    {
      field: "nom",
      header: `${t("t.name")}`,
      editor: (options) => textEditor(options),
    },
    {
      field: "llinatge1",
      header: `${t("t.surname1")}`,
      editor: (options) => textEditor(options),
    },
    {
      field: "llinatge2",
      header: `${t("t.surname2")}`,
      editor: (options) => textEditor(options),
    },
    {
      field: "dataNaixement",
      header: `${t("t.data.naixement")}`,
      body: dataNaixementBody,
      editor: (options) => textEditor(options),
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

  useEffect(() => {
    gestorfutbolService.getPosicions().then((data) => {
      let results = data.data;
      results.map((r) => (r.descripcion = t(`t.pos.${r.name}`)));
      setPosicions(results);
    });
  }, []);

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag, activeCampaign]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaign,
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

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.posicio.descripcion}
        </span>
      </React.Fragment>
    );
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
    sortOrder: 1,
    sortField: "posicio.valor",
    sortMode: "single",
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    rowEditor: true,
    stripedRows: true,
    rowGroupMode: "subheader",
    groupRowsBy: "posicio",
    rowGroupHeaderTemplate: headerTemplate,
    expandableRowGroups: true,
    expandedRows: expandedRows,
    onRowToggle: (e) => setExpandedRows(e.data),
  };

  const saveJugador = (data) => {
    data.posicio = posicions.find((p) => p.name === data.posicio);

    gestorfutbolService.saveJugador(data).then(() => {
      setCaptureDialog(false);
      loadLazyData();
    });
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
      saveJugador(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <div className="row gap-3 justify-content-center justify-content-xl-end">
        <BasicButton props={newButton}></BasicButton>
        <BasicButton props={deleteButton}></BasicButton>
      </div>
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
