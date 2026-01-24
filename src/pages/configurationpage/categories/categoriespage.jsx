import "./categoriespage.css";
import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { getIn, useFormik } from "formik";
import BasicButton from "../../../components/basicbutton/basicbutton";
import TableComponent from "../../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import FormInputText from "../../../components/forminputtext/forminputtext";
import TabMenuComponent from "../../../components/tabmenucomponent/tabmenucomponent";
import { ConfigContext } from "../../../App";
import { gestorfutbolService } from "../../../services/real/gestorfutbolService";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TableNoRespComponent from "../../../components/tablenorespcomponent/tablenorespcomponent";
import { all } from "axios";
import FormInputNumber from "../../../components/forminputnumber/forminputnumber";
import { useActiveCampaign } from "../../../hooks/campaignHook";

const CategoriaContext = createContext();

const CategoriaDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedCategoria, setSelectedCategoria, formikCategoria } =
    useContext(CategoriaContext);

  const [selectCheck, setSelectedCheck] = useState(null);

  const [data, setData] = useState(formikCategoria.values.equips);

  const isFormFieldInvalid = (name) =>
    !!(
      getIn(formikCategoria.touched, name) &&
      getIn(formikCategoria.errors, name)
    );

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">
        {getIn(formikCategoria.errors, name)}
      </small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikCategoria.values.nom,
    onChange: (e) => {
      formikCategoria.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const addRow = () => {
    const newRow = {
      id: null,
      nom: "",
      quota: null,
      categoria: selectedCategoria.id,
    };
    formikCategoria.setFieldValue("equips", [
      ...formikCategoria.values.equips,
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
        <Panel header={t("t.equips").toUpperCase()} className="mt-4">
          <div className="row">
            {formikCategoria.values.equips &&
              formikCategoria.values.equips.map((c, index) => {
                const nameEquip = `equips[${index}].nom`;

                const nomEquipProps = {
                  id: `nomEquip${index}`,
                  label: `${t("t.name")}`,
                  value: getIn(formikCategoria.values, nameEquip) ?? "",
                  onChange: (e) => {
                    const value = e?.target?.value ?? e?.value ?? e; // según tu componente
                    formikCategoria.setFieldValue(nameEquip, value);
                  },
                  classNameError: isFormFieldInvalid(nameEquip)
                    ? "invalid-inputtext"
                    : "",
                  labelClassName: isFormFieldInvalid(nameEquip)
                    ? "form-text-invalid"
                    : "",
                };

                // dentro del map de equips:
                const nameQuota = `equips[${index}].quota`;

                const quotaProps = {
                  id: `quota${index}`,
                  label: `${t("t.quota")}`,
                  value: getIn(formikCategoria.values, nameQuota) ?? null,
                  onValueChange: (e) => {
                    formikCategoria.setFieldValue(nameQuota, e.target.value);
                  },
                  mode: "currency",
                  currency: "EUR",
                  classNameError: isFormFieldInvalid(nameQuota)
                    ? "invalid-inputnumber"
                    : "",
                  labelClassName: isFormFieldInvalid(nameQuota)
                    ? "form-text-invalid"
                    : "",
                };

                return (
                  <div className="row w-100 p-2 mb-3">
                    <div className="col-12 col-md-8 form-group text-center text-md-start mt-3 mt-md-0">
                      <FormInputText props={nomEquipProps}></FormInputText>
                      {getFormErrorMessage(nameEquip)}
                    </div>
                    <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                      <FormInputNumber props={quotaProps}></FormInputNumber>
                      {getFormErrorMessage(nameQuota)}
                    </div>
                  </div>
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

const CategoriasPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [tipoSocis, setCategorias] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
    const {
    campaigns,
    tabMenuItems,
    activeIndex,
    setActiveByIndex,
    activeCampaign,
    activeCampaignId,
    seasonLabel
  } = useActiveCampaign();
  let emptyCategoria = {
    id: null,
    nom: "",
    equips: [],
  };
  const [selectedCategoria, setSelectedCategoria] = useState(emptyCategoria);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });
  const [expandedRows, setExpandedRows] = useState(null);

  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveByIndex(e.index);
      let result = campaigns[e.index];
      setSelectedCategoria(emptyCategoria);
    },
  };

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
    },
    {
      field: "nom",
      header: `${t("t.name")}`
    },

  ];

  const accept = () => {
    gestorfutbolService.deleteCategoria(selectedCategoria.id);
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
    disabled: selectedCategoria.id === null,
    onClick: confirm,
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedCategoria(emptyCategoria);
      formikCategoria.resetForm();
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
    disabled: selectedCategoria.id === null,
  };

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag, activeCampaign]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaignId,
    };

    gestorfutbolService.getCategoria(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.result;
      setCategorias(results);
    });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveCategoria(newData).then(() => loadLazyData());
  };

  const allowExpansion = (rowData) => {
    return rowData.equips.length > 0;
  };

  const currencyTemplate = (rowData) => {
    return `${rowData.quota.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    })}`; 
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <DataTable value={data.equips}>
          <Column field="id" header={t("t.id")} sortable></Column>
          <Column field="nom" header={t("t.name")} sortable></Column>
          <Column field="quota" header={t("t.quota")} sortable body={currencyTemplate}></Column>
        </DataTable>
      </div>
    );
  };

  const tableProps = {
    data: tipoSocis,
    selectedData: selectedCategoria,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedCategoria(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedCategoria(emptyCategoria);
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
    stripedRows: true,
    rowExpansionTemplate: rowExpansionTemplate,
    expandedRows: expandedRows,
    onRowToggle: (e) => setExpandedRows(e.data),
  };

  const saveCategoria = (data) => {
    if (selectedCategoria.id) {
      data.id = selectedCategoria.id;
    }
    const filtered = data.equips.filter((c) => c.nom.trim() !== "");

    data.equips = filtered;
    gestorfutbolService.saveCategoria(data).then(() => {
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

  const formikCategoria = useFormik({
    initialValues: {
      nom: selectedCategoria.nom,
      campanya: activeCampaignId,
      equips: selectedCategoria.equips,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }

      if (data.equips && data.equips.length > 0) {
        data.equips.forEach((c, index) => {
          const itemErr = {};

          if (!c.nom?.trim()) {
            itemErr.nom = t("t.empty.field");
          }
          if (c.quota == null) {
            itemErr.quota = t("t.empty.field");
          }

          if (Object.keys(itemErr).length > 0) {
            if (!errors.equips) errors.equips = [];
            errors.equips[index] = {
              ...(errors.equips[index] || {}),
              ...itemErr,
            };
          }
        });
      }

      return errors;
    },
    onSubmit: (data) => {
      saveCategoria(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="row gap-3 justify-content-center justify-content-xl-end">
        <BasicButton props={newButton}></BasicButton>
        <BasicButton props={editButton}></BasicButton>
        <BasicButton props={deleteButton}></BasicButton>
      </div>
      <div className="row mt-3">
        <TableNoRespComponent props={tableProps}></TableNoRespComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.nova.categoria").toUpperCase()}
        onHide={hideDialog}
        style={{ width: "50vw" }}
      >
        <form onSubmit={formikCategoria.handleSubmit}>
          <CategoriaContext.Provider
            value={{ selectedCategoria, setSelectedCategoria, formikCategoria }}
          >
            <CategoriaDataForm />
          </CategoriaContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CategoriasPage;
