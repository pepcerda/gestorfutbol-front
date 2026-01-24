import "./posicions.css";
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

const PosicioContext = createContext();

const PosicioDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedPosicio, setSelectedPosicio, formikPosicio } =
    useContext(PosicioContext);

  const [data, setData] = useState(formikPosicio.values.contactes);

  const [selectCheck, setSelectedCheck] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikPosicio.touched[name] && formikPosicio.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikPosicio.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const valorProps = {
    id: "valor",
    label: `${t("t.valor")}`,
    value: formikPosicio.values.valor,
    onChange: (e) => {
      formikPosicio.setFieldValue("valor", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("valor") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("valor") ? "form-text-invalid" : ""}`,
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={valorProps}></FormInputText>
          {getFormErrorMessage("valor")}
        </div>
      </div>
    </>
  );
};

const PosicionsPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [posicions, setPosicions] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  let emptyPosicio = {
    id: null,
    nom: "",
    cif: "",
    nomComercial: "",
    contactes: [],
  };
  const [selectedPosicio, setSelectedPosicio] = useState(emptyPosicio);
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
      field: "valor",
      header: `${t("t.valor")}`,
      editor: (options) => textEditor(options),
    },
  ];

  const accept = () => {
    gestorfutbolService.deletePosicio(selectedPosicio.id);
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
    disabled: selectedPosicio.id === null,
    onClick: confirm,
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedPosicio(emptyPosicio);
      formikPosicio.resetForm();
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
    disabled: selectedPosicio.id === null,
  };

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
    };

    gestorfutbolService.getPosicions(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.result;
      setPosicions(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.savePosicio(newData).then(() => loadLazyData());
  };

  const tableProps = {
    data: posicions,
    selectedData: selectedPosicio,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedPosicio(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedPosicio(emptyPosicio);
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

  const savePosicio = (data) => {
    if (selectedPosicio.id) {
      data.id = selectedPosicio.id;
    }

    gestorfutbolService.savePosicio(data).then(() => {
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

  const formikPosicio = useFormik({
    initialValues: {
      valor: selectedPosicio.valor,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.valor) {
        errors.valor = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      savePosicio(data);
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
        header={t("t.nou.posicio").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikPosicio.handleSubmit}>
          <PosicioContext.Provider
            value={{ selectedPosicio, setSelectedPosicio, formikPosicio }}
          >
            <PosicioDataForm />
          </PosicioContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default PosicionsPage;
