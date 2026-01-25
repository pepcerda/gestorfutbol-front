import "./memberspage.css";
import { useTranslation } from "react-i18next";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import FormInputText from "../../components/forminputtext/forminputtext";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import { ConfigContext } from "../../App";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import { useLocation } from "react-router-dom";
import { explotacioDadesService } from "../../services/real/explotacioDadesService";
import { ContextMenu } from "primereact/contextmenu";
import { useActiveCampaign } from "../../hooks/campaignHook";
import { exportToExcel } from "../../helpers/excelExport";

const MemberContext = createContext();
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

  const estatPagamentProps = {
    id: "estat-pagament",
    label: `${t("t.payment.state")}`,
    value: formikFilters.values.estatPagament,
    onChange: (e) => {
      formikFilters.setFieldValue("estatPagament", e.value);
    },
    options: opcionsPagament,
    optionLabel: "nom",
    optionValue: "valor",
  };

  const tipoSocisProps = {
    id: "tipo-soci",
    label: `${t("t.tipo.soci")}`,
    value: formikFilters.values.tipoSoci.id,
    onChange: (e) => {
      formikFilters.setFieldValue(
        "tipoSoci",
        tipoSocis.find((c) => c.id === e.value),
      );
    },
    options: tipoSocis,
    optionLabel: "nom",
    optionValue: "id",
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomCompletProps}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={tipoSocisProps}></SelectOneMenu>
        </div>
      </div>
    </>
  );
};

const MemberDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedMember, setSelectedMember, formikMember, activeCampaignId } =
    useContext(MemberContext);

  const [selectCheck, setSelectedCheck] = useState(null);
  const [tipoSocis, setTipoSocis] = useState(null);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();

  useEffect(() => {
    gestorfutbolService.getAllTipoSocis(activeCampaignId).then((data) => {
      let results = data.data;
      setTipoSocis(results);
    });
  }, []);

  const isFormFieldInvalid = (name) =>
    !!(formikMember.touched[name] && formikMember.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikMember.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikMember.values.nom,
    onChange: (e) => {
      formikMember.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikMember.values.llinatge1,
    onChange: (e) => {
      formikMember.setFieldValue("llinatge1", e.target.value);
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
    value: formikMember.values.llinatge2,
    onChange: (e) => {
      formikMember.setFieldValue("llinatge2", e.target.value);
    },
  };

  const tipoSociProps = {
    id: "tipo-soci",
    label: `${t("t.tipo.soci")}`,
    value: formikMember.values.tipoSoci.id,
    onChange: (e) => {
      formikMember.setFieldValue(
        "tipoSoci",
        tipoSocis.find((c) => c.id === e.value),
      );
    },
    options: tipoSocis,
    optionLabel: "nom",
    optionValue: "id",
    classNameError: `${isFormFieldInvalid("tipoSoci") ? "invalid-select" : ""}`,
    labelClassName: `${
      isFormFieldInvalid("tipoSoci") ? "form-text-invalid" : ""
    }`,
  };

  const estatPagamentProps = {
    id: "estat-pagament",
    label: `${t("t.payment.state")}`,
    value: formikMember.values.estatPagament,
    onChange: (e) => {
      formikMember.setFieldValue("estatPagament", e.value);
    },
    options: opcionsPagament,
    optionLabel: "nom",
    optionValue: "valor",
    classNameError: `${
      isFormFieldInvalid("estatPagament") ? "invalid-select" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("estatPagament") ? "form-text-invalid" : ""
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
          <SelectOneMenu props={tipoSociProps}></SelectOneMenu>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
          {getFormErrorMessage("estatPagament")}
        </div>
      </div>
    </>
  );
};

const MembersPage = ({ props }) => {
  const location = useLocation();
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();
  const [tipoSocis, setTipoSocis] = useState(null);
  const [members, setMembers] = useState([]);
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
    seasonLabel,
  } = useActiveCampaign();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  let emptyMember = {
    id: null,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    estatPagament: null,
    idSoci: null,
    tipoSoci: {
      id: null,
      campanya: activeCampaignId,
      nom: "",
      cuota: 0,
    },
    campanya: activeCampaignId,
  };

  const emptyDadesSocis = {
    previsioRecaptacio: 0,
    totalRecaptat: 0,
    totalSocis: 0,
  };
  const [selectedMember, setSelectedMember] = useState(emptyMember);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });

  const [filterVisible, setFilterVisible] = useState(false);
  const [dadesSocis, setDadesSocis] = useState(emptyDadesSocis);

  const cm = useRef(null);
  const menuModel = [
    {
      label: `${t("t.edita")}`,
      icon: "pi pi-fw pi-pencil",
      command: () => {
        setCaptureDialog({
          visible: true,
          consulta: false,
        });
      },
    },
    {
      label: `${t("t.elimina")}`,
      icon: "pi pi-fw pi-trash",
      command: () => accept(),
    },
  ];

  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveByIndex(e.index);
      let result = campaigns[e.index];
      setSelectedMember(emptyMember);
    },
  };

  const estatPagamentBodyTemplate = (member) => {
    let estat = opcionsPagament.find((o) => {
      return o.valor === member.estatPagament;
    });

    if (estat != null) {
      return (
        <>
          {viewWidth <= 900 ? (
            <span className="fw-bold">{t("t.payment.state")}</span>
          ) : (
            <></>
          )}
          <span
            className={`${
              estat.valor === "P" ? "text-bg-success" : "text-bg-danger"
            } px-3 py-2 rounded-pill`}
          >
            {estat.nom}
          </span>
        </>
      );
    }
  };

  const allowEdit = (rowData) => {
    return true;
  };

  const textEditor = (options) => {
    const textProps = {
      type: "text",
      value: options.value,
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormInputText props={textProps} />;
  };

  const checkEditor = (options) => {
    const checkProps = {
      value: options.value,
      checked: options.value,
      onChange: (e) => options.editorCallback(e.checked),
    };
    return <FormCheckbox props={checkProps} />;
  };

  const opcionsEditor = (options) => {
    const optionsProps = {
      id: "estatPagament_editor",
      value: options.rowData.estatPagament,
      onChange: (e) => options.editorCallback(e.value),
      options: opcionsPagament,
      optionLabel: "nom",
      optionValue: "valor",
      className: "selectonemenu-large",
    };
    return <SelectOneMenu props={optionsProps} />;
  };

  const tipoSocisEditor = (options) => {
    const handleChange = (e) => {
      options.rowData.tipoSoci = tipoSocis.find((c) => c.id === e.value);
      forceUpdate();
    };

    const optionsProps = {
      id: "tipoSoci_editor",
      value: options.rowData.tipoSoci.id,
      onChange: handleChange,
      options: tipoSocis,
      optionLabel: "nom",
      optionValue: "id",
      className: "selectonemenu-large",
    };
    return <SelectOneMenu props={optionsProps} />;
  };

  const tableColumns = [
    { field: "idSoci", header: `${t("t.num.soci")}`, sortable: true },
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
      field: "estatPagament",
      header: `${t("t.payment.state")}`,
      body: estatPagamentBodyTemplate,
      editor: (options) => opcionsEditor(options),
      sortable: true,
    },
    {
      field: "tipoSoci.nom",
      header: `${t("t.tipo.soci")}`,
      editor: (options) => tipoSocisEditor(options),
      sortable: true,
    },
    { rowEditor: true },
  ];

  const accept = () => {
    gestorfutbolService.deleteMember(selectedMember.id).then(() => {
      setDeleteFlag(true);
    });
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
    disabled: selectedMember.id === null,
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
      setSelectedMember(emptyMember);
      formikMember.resetForm();
      setCaptureDialog(true);
    },
    tooltip: `${t("t.nou")}`,
    tooltipOptions: {
      position: "bottom",
    },
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

  const exportButton = {
    icon: "pi pi-file-excel",
    className: "circular-btn",
    onClick: () => {
      exportExcel();
    },
    tooltip: `${t("t.exporta")}`,
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

  async function exportExcel() {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaignId,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };
    const res = await gestorfutbolService.getAllMembers(apiFilter);
    const rows = res.data || [];

    await exportToExcel(rows, undefined, {
      fileName: "socis",
      sheetName: "Socis",
      tableName: "TablaSocis",
      totalsRow: true,
    });
  }

  useEffect(() => {
    if (activeCampaign) {
      explotacioDadesService
        .getDadesExplotacioSocis(activeCampaignId)
        .then((data) => {
          setDadesSocis(data.data);
        });
    }
  }, [activeCampaign]);

  useEffect(() => {
    if (location.state?.filtre) {
      filterMember(location.state.filtre);
    }
  }, []);

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag, activeCampaign]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaignId,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };

    gestorfutbolService
      .getMembers(apiFilter)
      .then((data) => {
        setTotalRecords(data.data.total);
        let results = data.data.result;
        setMembers(results);
      })
      .then(() => {
        if (activeCampaign) {
          gestorfutbolService.getAllTipoSocis(activeCampaignId).then((data) => {
            let results = data.data;
            setTipoSocis(results);
          });
        }
      });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveMember(newData).then(() => loadLazyData());
  };

  const onSort = (event) => {
    event.page = lazyState.page;
    setlazyState(event);
  };

  const tableHeader = () => {
    return (
      <div className="table-header-container d-flex flex-column flex-md-row gap-3">
        <span>
          {t("t.total.socis")}: {dadesSocis.totalSocis}
        </span>
        <span>
          {t("t.total.recaptacio")}: {dadesSocis.totalRecaptat} €
        </span>
        <span>
          {t("t.previsio.recaptacio")}: {dadesSocis.previsioRecaptacio} €
        </span>
      </div>
    );
  };

  const tableProps = {
    data: members,
    selectedData: selectedMember,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedMember(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedMember(emptyMember);
    },
    columns: tableColumns,
    rows: lazyState.rows,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    lazy: true,
    onPage: (e) => {
      setlazyState((prevState) => ({
        ...prevState,
        first: e.first,
        page: e.page,
        rows: e.rows,
      }));
    },
    totalRecords: totalRecords,
    first: lazyState.first,
    onSort: onSort,
    sortOrder: lazyState.sortOrder,
    sortField: lazyState.sortField,
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    rowEditor: true,
    stripedRows: true,
    header: tableHeader,
    onContextMenu: (e) => cm.current.show(e.originalEvent),
    contextMenuSelection: selectedMember,
    onContextMenuSelectionChange: (e) => setSelectedMember(e.value),
  };

  const saveMember = (data) => {
    gestorfutbolService.saveMember(data).then(() => {
      setCaptureDialog(false);
      loadLazyData();
    });
  };

  const filterMember = (data) => {
    let sponsorFilters = {};
    if (data.nomComplet) {
      sponsorFilters.nomComplet = {
        value: data.nomComplet,
        matchMode: "contains",
      };
    }

    if (data.estatPagament) {
      sponsorFilters.estatPagament = {
        value: data.estatPagament,
        matchMode: "equals",
      };
    }

    if (data.tipoSoci && data.tipoSoci.id !== 0) {
      sponsorFilters.tipoSoci = {
        value: data.tipoSoci.id,
        matchMode: "equals",
      };
    }

    setlazyState((prevState) => ({
      ...prevState,
      filters: sponsorFilters,
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

  const formikMember = useFormik({
    initialValues: {
      nom: selectedMember.nom,
      llinatge1: selectedMember.llinatge1,
      llinatge2: selectedMember.llinatge2,
      estatPagament: selectedMember.estatPagament,
      tipoSoci: selectedMember.tipoSoci,
      campanya: activeCampaignId,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }

      if (!data.llinatge2) {
      }
      if (!data.estatPagament) {
        errors.estatPagament = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveMember(data);
    },
  });

  const formikFilters = useFormik({
    initialValues: {
      nom: emptyMember.nomComplet,
      estatPagament: emptyMember.estatPagament,
      tipoSoci: emptyMember.tipoSoci,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      return errors;
    },
    onSubmit: (data) => {
      filterMember(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <PageTitle props={{ title: `${t("t.members")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="row justify-content-between align-items-start flex-wrap">
        <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={filterButton} />
          <BasicButton props={exportButton} />
        </div>

        <div className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={newButton} />
          <BasicButton props={deleteButton} />
        </div>
      </div>

      {filterVisible && viewWidth > process.env.REACT_APP_XL_VW ? (
        <Card className="mt-3">
          <form onSubmit={formikFilters.handleSubmit}>
            <FiltraContext.Provider value={{ formikFilters, tipoSocis }}>
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
            <FiltraContext.Provider value={{ formikFilters, tipoSocis }}>
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
        <ContextMenu model={menuModel} ref={cm} />
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.new.member").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikMember.handleSubmit}>
          <MemberContext.Provider
            value={{
              selectedMember,
              setSelectedMember,
              formikMember,
              activeCampaignId,
            }}
          >
            <MemberDataForm />
          </MemberContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default MembersPage;
