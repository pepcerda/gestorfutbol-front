import "./entrenadorspage.css";
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
import { CampanyaContext, EquipContext } from "../plantillapage";
import React from "react";
import moment from "moment";
import { useActiveCampaign } from "../../../hooks/campaignHook";

const EntrenadorContext = createContext();

const EntrenadorDataForm = () => {
  const { t } = useTranslation("common");
  const { formikEntrenador } = useContext(EntrenadorContext);

  const [selectCheck, setSelectedCheck] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikEntrenador.touched[name] && formikEntrenador.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">
        {formikEntrenador.errors[name]}
      </small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikEntrenador.values.nom,
    onChange: (e) => {
      formikEntrenador.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikEntrenador.values.llinatge1,
    onChange: (e) => {
      formikEntrenador.setFieldValue("llinatge1", e.target.value);
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
    value: formikEntrenador.values.llinatge2,
    onChange: (e) => {
      formikEntrenador.setFieldValue("llinatge2", e.target.value);
    },
  };

  const dataNaixementProps = {
    id: "dataNaixement",
    label: `${t("t.data.naixement")}`,
    value: formikEntrenador.values.dataNaixement,
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikEntrenador.setFieldValue("dataNaixement", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataNaixement") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataNaixement") ? "form-text-invalid" : ""
    }`,
  };

  const carrecProps = {
    id: "carrec",
    label: `${t("t.carrec")}`,
    value: formikEntrenador.values.carrec,
    onChange: (e) => {
      formikEntrenador.setFieldValue("carrec", e.target.value);
    },
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
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={carrecProps}></FormInputText>
        </div>
      </div>
    </>
  );
};

const EntrenadorsPage = () => {
  const { viewWidth } = useContext(ConfigContext);
  const [entrenadors, setEntrendors] = useState([]);
  const { t } = useTranslation("common");
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
    seasonLabel
  } = useActiveCampaign();
  const [posicions, setPosicions] = useState([]);

  let emptyEntrenador = {
    id: null,
    campanya: activeCampaignId,
    equip: selectedEquip,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    dataNaixement: null,
    carrec: "",
  };
  const [selectedEntrenador, setSelectedEntrenador] = useState(emptyEntrenador);
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

  const tableColumns = [
    { field: "id", header: `${t("t.entrenador")}` },
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
      field: "carrec",
      header: `${t("t.carrec")}`,
      editor: (options) => textEditor(options),
    },
    {
      field: "dataNaixement",
      header: `${t("t.data.naixement")}`,
      body: dataNaixementBody,
      editor: (options) => calendarEditor(options),
    },
  ];

  const accept = () => {
    gestorfutbolService.deleteEntrenador(selectedEntrenador.id);
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
    disabled: selectedEntrenador.id === null,
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
      setSelectedEntrenador(emptyEntrenador);
      formikEntrenador.resetForm();
      setCaptureDialog(true);
    },
    tooltip: `${t("t.nou")}`,
    tooltipOptions: {
      position: "bottom",
    },
  };

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
    };

    gestorfutbolService.getEntrenadors(apiFilter).then((data) => {
      let results = data.data;
      setEntrendors(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData } = e;
    gestorfutbolService.saveEntrenador(newData).then(() => loadLazyData());
  };

  const tableProps = {
    data: entrenadors,
    selectedData: selectedEntrenador,
    selectionMode: "single",
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedEntrenador(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedEntrenador(emptyEntrenador);
    },
    columns: tableColumns,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    onPage: (e) => setlazyState(e),
    totalRecords: totalRecords,
    first: lazyState.first,
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    rowEditor: true,
    stripedRows: true,
  };

  const saveEntrenador = (data) => {
    data.posicio = posicions.find((p) => p.name === data.posicio);

    gestorfutbolService.saveEntrenador(data).then(() => {
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

  const formikEntrenador = useFormik({
    initialValues: {
      nom: selectedEntrenador.nom,
      llinatge1: selectedEntrenador.llinatge1,
      llinatge2: selectedEntrenador.llinatge2,
      dataNaixement: selectedEntrenador.dataNaixement,
      carrec: selectedEntrenador.carrec,
      campanya: activeCampaignId,
      equip: selectedEntrenador.equip ? selectedEntrenador.equip.id : null
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
      if(!data.dataNaixement){
        errors.dataNaixement = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveEntrenador(data);
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
        header={t("t.nou.entrenador").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikEntrenador.handleSubmit}>
          <EntrenadorContext.Provider
            value={{
              selectedEntrenador,
              setSelectedEntrenador,
              formikEntrenador,
            }}
          >
            <EntrenadorDataForm />
          </EntrenadorContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EntrenadorsPage;
