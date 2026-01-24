import "./delegatspage.css";
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
import FormCheckbox from "../../../components/formcheckbox/formcheckbox";
import moment from "moment";
import { useActiveCampaign } from "../../../hooks/campaignHook";

const DelegatContext = createContext();

const DelegatDataForm = () => {
  const { t } = useTranslation("common");
  const { formikDelegat } = useContext(DelegatContext);

  const [selectCheck, setSelectedCheck] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikDelegat.touched[name] && formikDelegat.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikDelegat.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikDelegat.values.nom,
    onChange: (e) => {
      formikDelegat.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikDelegat.values.llinatge1,
    onChange: (e) => {
      formikDelegat.setFieldValue("llinatge1", e.target.value);
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
    value: formikDelegat.values.llinatge2,
    onChange: (e) => {
      formikDelegat.setFieldValue("llinatge2", e.target.value);
    },
  };

  const dataNaixementProps = {
    id: "dataNaixement",
    label: `${t("t.data.naixement")}`,
    value: formikDelegat.values.dataNaixement,
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikDelegat.setFieldValue("dataNaixement", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataNaixement") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataNaixement") ? "form-text-invalid" : ""
    }`,
  };

  const esDelCampProps = {
    id: "delCamp",
    label: `${t("t.delegat.camp")}`,
    checked: formikDelegat.values.esDelegatCamp,
    onChange: (e) => {
      formikDelegat.setFieldValue("esDelegatCamp", e.checked);
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
          <FormCheckbox props={esDelCampProps}></FormCheckbox>
        </div>
      </div>
    </>
  );
};

const DelegatsPage = () => {
  const { viewWidth } = useContext(ConfigContext);
  const [delegats, setEntrendors] = useState([]);
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

  let emptyDelegat = {
    id: null,
    campanya: activeCampaignId,
    equip: selectedEquip,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    dataNaixement: null,
    esDelegatCamp: false,
  };
  const [selectedDelegat, setSelectedDelegat] = useState(emptyDelegat);
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

  const esDelegatCampBody = (rowData) => {
    return (
      <FormCheckbox
        props={{
          id: `delCamp_${rowData.id}`,
          checked: rowData.esDelegatCamp,
          disabled: true,
        }}
      ></FormCheckbox>
    );
  };

  const checkEditor = (options) => {
    const checkProps = {
      value: options.value,
      checked: options.value,
      onChange: (e) => options.editorCallback(e.checked),
    };
    return <FormCheckbox props={checkProps} />;
  };

  const tableColumns = [
    { field: "id", header: `${t("t.delegat")}` },
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
      editor: (options) => calendarEditor(options),
    },
    {
      field: "esDelegatCamp",
      header: `${t("t.delegat.camp")}`,
      body: esDelegatCampBody,
      editor: (options) => checkEditor(options),
    },
  ];

  const accept = () => {
    gestorfutbolService.deleteDelegat(selectedDelegat.id);
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
    disabled: selectedDelegat.id === null,
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
      setSelectedDelegat(emptyDelegat);
      formikDelegat.resetForm();
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

    gestorfutbolService.getDelegats(apiFilter).then((data) => {
      let results = data.data;
      setEntrendors(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData } = e;
    gestorfutbolService.saveDelegat(newData).then(() => loadLazyData());
  };

  const tableProps = {
    data: delegats,
    selectedData: selectedDelegat,
    selectionMode: "single",
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedDelegat(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedDelegat(emptyDelegat);
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

  const saveDelegat = (data) => {
    data.posicio = posicions.find((p) => p.name === data.posicio);

    gestorfutbolService.saveDelegat(data).then(() => {
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

  const formikDelegat = useFormik({
    initialValues: {
      nom: selectedDelegat.nom,
      llinatge1: selectedDelegat.llinatge1,
      llinatge2: selectedDelegat.llinatge2,
      dataNaixement: selectedDelegat.dataNaixement,
      esDelegatCamp: selectedDelegat.esDelegatCamp,
      campanya: activeCampaignId,
      equip: selectedDelegat.equip ? selectedDelegat.equip.id : null,
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
      if (!data.dataNaixement) {
        errors.dataNaixement = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveDelegat(data);
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
        header={t("t.nou.delegat").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikDelegat.handleSubmit}>
          <DelegatContext.Provider
            value={{ selectedDelegat, setSelectedDelegat, formikDelegat }}
          >
            <DelegatDataForm />
          </DelegatContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default DelegatsPage;
