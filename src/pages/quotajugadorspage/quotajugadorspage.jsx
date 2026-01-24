import { createContext, useContext, useEffect, useState } from "react";
import "./quotajugadorspage.css";
import { useTranslation } from "react-i18next";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import { ConfigContext } from "../../App";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import { confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import { Card } from "primereact/card";
import FormInputText from "../../components/forminputtext/forminputtext";
import moment from "moment";
import { Sidebar } from "primereact/sidebar";
import FormCalendar from "../../components/formcalendar/formcalendar";
import { Panel } from "primereact/panel";
import FormInputNumber from "../../components/forminputnumber/forminputnumber";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import { Dialog } from "primereact/dialog";

const FiltraContext = createContext();
const QuotaJugadorContext = createContext();

const FilterDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { formikFilters, tipoSocis } = useContext(FiltraContext);
  const [estatsPagament, setEstatsPagament] = useState([]);

  const dataDonacioCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString, "YYYY-MM-DD");
    if (value !== null) {
      return dateMomentObject.toDate();
    } else {
      return new Date();
    }
  };

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

  const nomCompletProps = {
    id: "nomComplet",
    label: `${t("t.nom.complet")}`,
    value: formikFilters.values.nomComplet,
    onChange: (e) => {
      formikFilters.setFieldValue("nomComplet", e.target.value);
    },
  };

  const estatPagamentProps = {
    id: "estatPagament",
    label: `${t("t.payment.state")}`,
    value: formikFilters.values.estatPagament,
    onChange: (e) => {
      formikFilters.setFieldValue("estatPagament", e.value);
    },
    options: estatsPagament,
    optionLabel: "nom",
    optionValue: "valor",
  };


  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomCompletProps}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
        </div>
      </div>
    </>
  );
};

const QuotaJugadorsDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedQuotaJugador, setSelectedQuotaJugador, formikQuotaJugador } =
    useContext(QuotaJugadorContext);
  const [selectCheck, setSelectedCheck] = useState(null);
  const [estatsPagament, setEstatsPagament] = useState([]);
  const [excepcio, setExcepcio] = useState(formikQuotaJugador.values.excepcio);

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

  const isFormFieldInvalid = (name) =>
    !!(formikQuotaJugador.touched[name] && formikQuotaJugador.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">
        {formikQuotaJugador.errors[name]}
      </small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const dataCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString);
    return dateMomentObject.toDate();
  };

  const quantitatProps = {
    id: "quantitat",
    label: `${t("t.quantitat")}`,
    value: formikQuotaJugador.values.quantitat,
    mode: "currency",
    currency: "EUR",
    onValueChange: (e) => {
      formikQuotaJugador.setFieldValue("quantitat", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("quantitat") ? "invalid-inputnumber" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("quantitat") ? "form-text-invalid" : ""
    }`,
    disabled: !excepcio,
  };

  const dataPagamentProps = {
    id: "dataPagament",
    label: `${t("t.data.pagament")}`,
    value: dataCalc(formikQuotaJugador.values.dataPagament),
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikQuotaJugador.setFieldValue("dataPagament", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataPagament") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataPagament") ? "form-text-invalid" : ""
    }`,
    disabled: formikQuotaJugador.values.estatPagament === "PENDENT",
  };

  const estatPagamentProps = {
    id: "estatPagament",
    label: `${t("t.payment.state")}`,
    value: formikQuotaJugador.values.estatPagament,
    onChange: (e) => {
      formikQuotaJugador.setFieldValue("estatPagament", e.value);
    },
    options: estatsPagament,
    optionLabel: "nom",
    optionValue: "valor",
    classNameError: `${
      isFormFieldInvalid("estatPagament") ? "invalid-select" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("estatPagament") ? "form-text-invalid" : ""
    }`,
  };

  const excepcioProps = {
    id: "excepcio",
    label: `${t("t.excepcio")}`,
    checked: formikQuotaJugador.values.excepcio,
    onChange: (e) => {
      formikQuotaJugador.setFieldValue("excepcio", e.checked);
      setExcepcio(e.checked);
    },
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikQuotaJugador.values.jugador.nom,
    disabled: true,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikQuotaJugador.values.jugador.llinatge1,
    disabled: true,
  };

  const llinatge2Props = {
    id: "llinatge2",
    label: `${t("t.surname2")}`,
    value: formikQuotaJugador.values.jugador.llinatge2,
    disabled: true,
  };

  const dataNaixementProps = {
    id: "dataNaixement",
    label: `${t("t.data.naixement")}`,
    value: dataCalc(formikQuotaJugador.values.jugador.dataNaixement),
    view: "date",
    dateFormat: "dd/mm/yy",
    disabled: true,
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

        {formikQuotaJugador.values.contactes && (
          <Panel header={t("t.contactes").toUpperCase()} className="mt-4">
            <div className="row">
              {formikQuotaJugador.values.contactes &&
                formikQuotaJugador.values.contactes.map((c, index) => {
                  const nomContacteProps = {
                    id: `nomContacte${index}`,
                    label: `${t("t.name")}`,
                    value:
                      formikQuotaJugador.values.jugador.contactes[index].nom,
                    diasbled: true,
                  };

                  const emailContacteProps = {
                    id: `emailContacte${index}`,
                    label: `${t("t.email")}`,
                    value:
                      formikQuotaJugador.values.jugador.contactes[index].email,
                    disabled: true,
                  };

                  const telefonContacteProps = {
                    id: `telefonContacte${index}`,
                    label: `${t("t.telefon")}`,
                    value:
                      formikQuotaJugador.values.jugador.contactes[index]
                        .telefon,
                    disabled: true,
                  };

                  return (
                    <>
                      <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                        <FormInputText props={nomContacteProps}></FormInputText>
                      </div>
                      <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                        <FormInputText
                          props={emailContacteProps}
                        ></FormInputText>
                      </div>
                      <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                        <FormInputText
                          props={telefonContacteProps}
                        ></FormInputText>
                      </div>
                    </>
                  );
                })}
            </div>
          </Panel>
        )}

        <Panel header={t("t.quota").toUpperCase()} className="mt-4">
          <div className="row">
            <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
              <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
              {getFormErrorMessage("estatPagament")}
            </div>
            <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
              <FormCalendar props={dataPagamentProps} />
              <br />
              {getFormErrorMessage("dataPagament")}
            </div>
            <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
              <FormCheckbox props={excepcioProps}></FormCheckbox>
            </div>
            <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
              <FormInputNumber props={quantitatProps}></FormInputNumber>
              {getFormErrorMessage("quantitat")}
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
};

const QuotaJugadorsPage = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [equips, setEquips] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [tabMenuItems, setTabMenuItems] = useState([]);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [quotesJugadors, setQuotesJugadors] = useState([]);
  const [estatsPagament, setEstatsPagament] = useState([]);

  let emptyQuotaJugador = {
    id: null,
    jugador: {
      id: null,
      campanya: activeCampaign,
      equip: selectedEquip,
      nom: "",
      llinatge1: "",
      llinatge2: "",
      dataNaixement: null,
      posicio: "",
      contactes: [],
    },
    dataPagament: null,
    estatPagament: null,
    excepcio: false,
    quantitat: null,
  };

  const [selectedQuotaJugador, setSelectedQuotaJugador] =
    useState(emptyQuotaJugador);

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });

  const [filterVisible, setFilterVisible] = useState(false);

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
      gestorfutbolService
        .getCategories(activeCampaign)
        .then((data) => {
          let results = data.data;
          setCategories(results);
        })
        .then(() => {
          gestorfutbolService.getEquips(activeCampaign).then((data) => {
            let results = data.data;
            setEquips(results);
            setSelectedEquip(results[0]);
          });
        });
    }
  }, [activeCampaign]);

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag, activeCampaign, selectedEquip]);

  const loadLazyData = () => {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaign,
      equipActiu: selectedEquip ? selectedEquip.id : null,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };

    gestorfutbolService.getQuotasJugadors(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.result;
      console.log(results);
      setQuotesJugadors(results);
    });
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

  const groupedEquips = () => {
    if (categories == null) return [];

    let grups = categories.map((c) => {
      return {
        label: c.nom,
        items: c.equips,
      };
    });

    return grups;
  };

  const equipProps = {
    id: "equip",
    label: t("t.selecciona.equip"),
    value: selectedEquip ? selectedEquip.id : null,
    onChange: (e) => {
      let equip = equips.find((c) => c.id === e.value);
      setSelectedEquip(equip);
    },
    options: groupedEquips(),
    optionLabel: "nom",
    optionValue: "id",
    className: "w-60",
    optionGroupLabel: "label",
    optionGroupChildren: "items",
    filter: true,
  };

  const dataBody = (rowData) => {
    if (!rowData.dataPagament)
      return (
        <>
          {viewWidth <= 900 ? (
            <span className="fw-bold">{t("t.data.pagament")}</span>
          ) : (
            <></>
          )}
          <span>-</span>
        </>
      );

    // Crear objeto Date
    const fecha = new Date(rowData.dataPagament);

    // Obtener día, mes y año
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const anio = fecha.getFullYear();

    // Formatear como dd/mm/yyyy
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return (
      <>
        {viewWidth <= 900 ? (
          <span className="fw-bold">{t("t.data.pagament")}</span>
        ) : (
          <></>
        )}
        <span>{fechaFormateada}</span>
      </>
    );
  };

  const estatPagamentBodyTemplate = (factura) => {
    let estat = estatsPagament.find((o) => {
      return o.valor === factura.estatPagament;
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
              estat.valor === "PAGADA" ? "text-bg-success" : "text-bg-danger"
            } px-3 py-2 rounded-pill`}
          >
            {estat.nom}
          </span>
        </>
      );
    }
  };

  const tableColumns = [
    { field: "id", header: `${t("t.jugador")}`, sortable: true },
    {
      field: "jugador.nom",
      header: `${t("t.name")}`,
      sortable: true,
    },
    {
      field: "jugador.llinatge1",
      header: `${t("t.surname1")}`,
      sortable: true,
    },
    {
      field: "jugador.llinatge2",
      header: `${t("t.surname2")}`,
      sortable: true,
    },
    {
      field: "dataPagament",
      header: `${t("t.data.pagament")}`,
      body: dataBody,
      sortable: true,
    },
    {
      field: "estatPagament",
      header: `${t("t.payment.state")}`,
      body: estatPagamentBodyTemplate,
      sortable: true,
    },
    {
      field: "quantitat",
      header: `${t("t.quantitat")}`,
      sortable: true,
    },
  ];

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveJugador(newData).then(() => loadLazyData());
  };

  const onSort = (event) => {
    event.page = lazyState.page;
    setlazyState(event);
  };

  const tableProps = {
    data: quotesJugadors,
    selectedData: selectedQuotaJugador,
    selectionMode: "single",
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedQuotaJugador(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedQuotaJugador(emptyQuotaJugador);
    },
    columns: tableColumns,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    lazy: true,
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onPage: (e) => {
      setlazyState((prevState) => ({
        ...prevState,
        first: e.first,
        page: e.page,
        rows: e.rows,
      }));
    },
    rows: lazyState.rows,
    rowsPerPageOptions: [5, 10, 25, 50],
    totalRecords: totalRecords,
    first: lazyState.first,
    onSort: onSort,
    sortOrder: lazyState.sortOrder,
    sortField: lazyState.sortField,
    editMode: "row",
    onRowEditComplete: onRowEditComplete,
    stripedRows: true,
  };

  const accept = () => {
    gestorfutbolService.deleteQuotaJugador(selectedQuotaJugador.id);
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

  const hideDialog = () => {
    setCaptureDialog(false);
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      setSelectedQuotaJugador(emptyQuotaJugador);
      formikQuotaJugador.resetForm();
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
    disabled: selectedQuotaJugador.id === null,
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

  const deleteButton = {
    icon: "pi pi-trash",
    className: "circular-btn",
    disabled: selectedQuotaJugador.id === null,
    onClick: confirm,
    tooltip: `${t("t.elimina")}`,
    tooltipOptions: {
      position: "bottom",
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

  const saveQuotaJugador = (data) => {
    if (selectedQuotaJugador.id) {
      data.id = selectedQuotaJugador.id;
      data.equip = selectedQuotaJugador.equip;
    }

    gestorfutbolService.saveQuotaJugador(data).then(() => {
      setCaptureDialog(false);
      loadLazyData();
    });
  };

  const filterQuotaJugador = (data) => {
    let quotaJugadorsFilters = {};
    if (data.nomComplet) {
      quotaJugadorsFilters.nomComplet = {
        value: data.nomComplet,
        matchMode: "contains",
      };
    }

    if (data.estatPagament) {
      quotaJugadorsFilters["estatPagament"] = {
        value: data.estatPagament,
        matchMode: "equals",
      };
    }


    setlazyState((prevState) => ({
      ...prevState,
      filters: quotaJugadorsFilters,
    }));
  };

  const formikQuotaJugador = useFormik({
    initialValues: {
      id: selectedQuotaJugador.id,
      jugador: selectedQuotaJugador.jugador,
      dataPagament: selectedQuotaJugador.dataPagament,
      estatPagament: selectedQuotaJugador.estatPagament,
      excepcio: selectedQuotaJugador.excepcio,
      quantitat: selectedQuotaJugador.quantitat,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      return errors;
    },
    onSubmit: (data) => {
      saveQuotaJugador(data);
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
      filterQuotaJugador(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="d-flex gap-4 align-items-center mb-3 mt-3">
        <SelectOneMenu props={equipProps}></SelectOneMenu>
      </div>
      <div className="row justify-content-between align-items-start flex-wrap">
        <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={filterButton} />
        </div>
        <div className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={newButton} />
          <BasicButton props={editButton} />
          <BasicButton props={deleteButton} />
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
          <Sidebar
            visible={filterVisible}
            onHide={() => setFilterVisible(false)}
          >
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
      </div>
      <div className="row mt-3">
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.nou.jugador").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikQuotaJugador.handleSubmit}>
          <QuotaJugadorContext.Provider
            value={{
              selectedQuotaJugador,
              setSelectedQuotaJugador,
              formikQuotaJugador,
            }}
          >
            <QuotaJugadorsDataForm />
          </QuotaJugadorContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default QuotaJugadorsPage;
