import "./proveidors.css";
import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import PageTitle from "../../../components/pagetitle/pagetitle";
import BasicButton from "../../../components/basicbutton/basicbutton";
import TableComponent from "../../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import FormInputText from "../../../components/forminputtext/forminputtext";
import TabMenuComponent from "../../../components/tabmenucomponent/tabmenucomponent";
import { ConfigContext } from "../../../App";
import { gestorfutbolService } from "../../../services/real/gestorfutbolService";
import FormInputNumber from "../../../components/forminputnumber/forminputnumber";
import { Panel } from "primereact/panel";

const ProveidorContext = createContext();

const ProveidorDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedProveidor, setSelectedProveidor, formikProveidor } =
    useContext(ProveidorContext);

  const [data, setData] = useState(formikProveidor.values.contactes);

  const [selectCheck, setSelectedCheck] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikProveidor.touched[name] && formikProveidor.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">
        {formikProveidor.errors[name]}
      </small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikProveidor.values.nom,
    onChange: (e) => {
      formikProveidor.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const cifProps = {
    id: "cif",
    label: `${t("t.cif")}`,
    value: formikProveidor.values.cif,
    onChange: (e) => {
      formikProveidor.setFieldValue("cif", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("cif") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("cif") ? "form-text-invalid" : ""}`,
  };

  const nomComercialProps = {
    id: "nomComercial",
    label: `${t("t.nom.comercial")}`,
    value: formikProveidor.values.nomComercial,
    onChange: (e) => {
      formikProveidor.setFieldValue("nomComercial", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nomComercial") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nomComercial") ? "form-text-invalid" : ""}`,
  };

  const addRow = () => {
    const newRow = {
      id: null,
      nom: "",
      email: "",
      telefon: "",
    };
    formikProveidor.setFieldValue("contactes", [
      ...formikProveidor.values.contactes,
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
          <FormInputText props={cifProps}></FormInputText>
          {getFormErrorMessage("cif")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomComercialProps}></FormInputText>
          {getFormErrorMessage("nomComercial")}
        </div>

        <Panel header={t("t.contactes").toUpperCase()} className="mt-4">
          <div className="row">
            {formikProveidor.values.contactes &&
              formikProveidor.values.contactes.map((c, index) => {
                const nomContacteProps = {
                  id: `nomContacte${index}`,
                  label: `${t("t.name")}`,
                  value: formikProveidor.values.contactes[index].nom,
                  onChange: (e) => {
                    let contactes = formikProveidor.values.contactes;
                    contactes[index].nom = e.target.value;
                    formikProveidor.setFieldValue("contactes", contactes);
                  },
                };

                const emailContacteProps = {
                  id: `emailContacte${index}`,
                  label: `${t("t.email")}`,
                  value: formikProveidor.values.contactes[index].email,
                  onChange: (e) => {
                    let contactes = formikProveidor.values.contactes;
                    contactes[index].email = e.target.value;
                    formikProveidor.setFieldValue("contactes", contactes);
                  },
                };

                const telefonContacteProps = {
                  id: `telefonContacte${index}`,
                  label: `${t("t.telefon")}`,
                  value: formikProveidor.values.contactes[index].telefon,
                  onChange: (e) => {
                    let contactes = formikProveidor.values.contactes;
                    contactes[index].telefon = e.target.value;
                    formikProveidor.setFieldValue("contactes", contactes);
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

const ProveidorsPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [proveidors, setProveidors] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  let emptyProveidor = {
    id: null,
    nom: "",
    cif: "",
    nomComercial: "",
    contactes: [],
  };
  const [selectedProveidor, setSelectedProveidor] = useState(emptyProveidor);
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

  const tableColumns = [
    { field: "id", header: `${t("t.id")}` },
    {
      field: "nom",
      header: `${t("t.name")}`
    },
    {
      field: "cif",
      header: `${t("t.cif")}`
    },
    {
      field: "nomComercial",
      header: `${t("t.nom.comercial")}`
    }
  ];

  const accept = () => {
    gestorfutbolService.deleteProveidor(selectedProveidor.id);
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
    disabled: selectedProveidor.id === null,
    onClick: confirm,
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedProveidor(emptyProveidor);
      formikProveidor.resetForm();
      setCaptureDialog(true);
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
    disabled: selectedProveidor.id === null,
  };

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag]);

  const loadLazyData = () => {
    console.log("Loading lazy data...");

    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
    };

    gestorfutbolService.getProveidors(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.result;
      setProveidors(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveProveidor(newData).then(() => loadLazyData());
  };

  const tableProps = {
    data: proveidors,
    selectedData: selectedProveidor,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedProveidor(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedProveidor(emptyProveidor);
    },
    columns: tableColumns,
    rows: lazyState.rows,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    lazy: true,
    onPage: (e) => setlazyState(e),
    totalRecords: totalRecords,
    first: lazyState.first,
    onSort: (e) => setlazyState(e),
    sortOrder: lazyState.sortOrder,
    sortField: lazyState.sortField,
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    rowEditor: true,
    stripedRows: true,
  };

  const saveProveidor = (data) => {

     if (selectedProveidor.id) {
      data.id = selectedProveidor.id;
    }
    const filtered = data.contactes.filter(
      (c) =>
        c.nom.trim() !== "" || c.email.trim() !== "" || c.telefon.trim() !== ""
    );

    data.contactes = filtered;

    gestorfutbolService.saveProveidor(data).then(() => {
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

  const formikProveidor = useFormik({
    initialValues: {
      nom: selectedProveidor.nom,
      cif: selectedProveidor.cif,
      nomComercial: selectedProveidor.nomComercial,
      contactes: selectedProveidor.contactes,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }

      if (!data.cif) {
        errors.cif = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveProveidor(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <div className="row gap-3 justify-content-center justify-content-xl-end">
        <BasicButton props={newButton}></BasicButton>
        <BasicButton props={editButton}></BasicButton>
        <BasicButton props={deleteButton}></BasicButton>
      </div>
      <div className="row mt-3">
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.nou.proveidor").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikProveidor.handleSubmit}>
          <ProveidorContext.Provider
            value={{ selectedProveidor, setSelectedProveidor, formikProveidor }}
          >
            <ProveidorDataForm />
          </ProveidorContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ProveidorsPage;
