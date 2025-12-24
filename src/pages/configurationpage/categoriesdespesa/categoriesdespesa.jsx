import "./categoriesdespesa.css";
import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import BasicButton from "../../../components/basicbutton/basicbutton";
import TableComponent from "../../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import FormInputText from "../../../components/forminputtext/forminputtext";
import { ConfigContext } from "../../../App";
import { gestorfutbolService } from "../../../services/real/gestorfutbolService";


const CategoriaDespesaContext = createContext();

const CategoriaDespesaDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedCategoriaDespesa, setSelectedCategoriaDespesa, formikCategoriaDespesa } =
    useContext(CategoriaDespesaContext);

  const isFormFieldInvalid = (name) =>
    !!(formikCategoriaDespesa.touched[name] && formikCategoriaDespesa.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikCategoriaDespesa.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikCategoriaDespesa.values.nom,
    onChange: (e) => {
      formikCategoriaDespesa.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  return (
    <>
      <div className="row">
        <div className="col-12 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomProps}></FormInputText>
          {getFormErrorMessage("nom")}
        </div>
      </div>
    </>
  );
};

const CategoriaDespesasPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [categoriaDespesas, setCategoriaDespesas] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  let emptyCategoriaDespesa = {
    id: null,
    nom: ""
  };
  const [selectedCategoriaDespesa, setSelectedCategoriaDespesa] = useState(emptyCategoriaDespesa);
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
    { 
      field: "id", 
      header: `${t("t.id")}`,
      sortable: true,
    },
    {
      field: "nom",
      header: `${t("t.name")}`,
      editor: (options) => textEditor(options),
      sortable: true,
    },
    { rowEditor: true },
  ];

  const accept = () => {
    gestorfutbolService.deleteCategoriaDespesa(selectedCategoriaDespesa.id);
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
    disabled: selectedCategoriaDespesa.id === null,
    onClick: confirm,
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedCategoriaDespesa(emptyCategoriaDespesa);
      formikCategoriaDespesa.resetForm();
      setCaptureDialog(true);
    },
  };

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag]);

  const loadLazyData = () => {
    
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
    };

    gestorfutbolService.getCategoriaDespesa(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.result;
      setCategoriaDespesas(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveCategoriaDespesa(newData).then(() => loadLazyData());
  };

  const onSort = (event) => {
    event.page = lazyState.page;
    setlazyState(event);
  };

  const tableProps = {
    data: categoriaDespesas,
    selectedData: selectedCategoriaDespesa,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedCategoriaDespesa(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedCategoriaDespesa(emptyCategoriaDespesa);
    },
    columns: tableColumns,
    rows: lazyState.rows,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    lazy: true,
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

  const saveCategoriaDespesa = (data) => {
    gestorfutbolService.saveCategoriaDespesa(data).then(() => {
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

  const formikCategoriaDespesa = useFormik({
    initialValues: {
      nom: selectedCategoriaDespesa.nom
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveCategoriaDespesa(data);
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
        header={t("t.nova.categoria").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikCategoriaDespesa.handleSubmit}>
          <CategoriaDespesaContext.Provider
            value={{ selectedCategoriaDespesa, setSelectedCategoriaDespesa, formikCategoriaDespesa }}
          >
            <CategoriaDespesaDataForm />
          </CategoriaDespesaContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CategoriaDespesasPage;
