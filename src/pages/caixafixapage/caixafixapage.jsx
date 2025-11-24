import "./caixafixapage.css";
import { ConfigContext } from "../../App";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import { useTranslation } from "react-i18next";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import FormInputText from "../../components/forminputtext/forminputtext";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import FormInputNumber from "../../components/forminputnumber/forminputnumber";
import FormCalendar from "../../components/formcalendar/formcalendar";
import FormTextArea from "../../components/formtextarea/formtextarea";
import FileUploader from "../../components/fileuploader/fileuploader";
import imageCompression from "browser-image-compression";
import { ContextMenu } from "primereact/contextmenu";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import moment from "moment";
import { explotacioDadesService } from "../../services/real/explotacioDadesService";
import { useLocation } from "react-router-dom";

const FacturaContext = createContext();
const FiltraContext = createContext();

const FilterDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { formikFilters } = useContext(FiltraContext);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();

  const dataDonacioCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString, "YYYY-MM-DD");
    return dateMomentObject.toDate();
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikFilters.values.nom,
    onChange: (e) => {
      formikFilters.setFieldValue("nom", e.target.value);
    },
  };

  const observacioProps = {
    id: "observacio",
    label: `${t("t.observacio")}`,
    value: formikFilters.values.observacio,
    onChange: (e) => {
      formikFilters.setFieldValue("observacio", e.target.value);
    },
  };

  const estatProps = {
    id: "estat",
    label: `${t("t.payment.state")}`,
    value: formikFilters.values.estat,
    onChange: (e) => {
      formikFilters.setFieldValue("estat", e.value);
    },
    options: opcionsPagament,
    optionLabel: "nom",
    optionValue: "valor",
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomProps}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={observacioProps}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatProps}></SelectOneMenu>
        </div>
      </div>
    </>
  );
};

const FacturaDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedFactura, setSelectedFactura, formikFactura, captureDialog } =
    useContext(FacturaContext);

  const [selectCheck, setSelectedCheck] = useState(null);
  const [fecha, setFecha] = useState(null);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();
  const [fileName, setFileName] = useState(null);

  const isFormFieldInvalid = (name) =>
    !!(formikFactura.touched[name] && formikFactura.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikFactura.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const esBase64Embebida = (cadena) => {
    if (typeof cadena !== "string") return false;

    // Expresión regular para detectar el esquema data:image/...;base64,...
    const base64DataUrlRegex =
      /^data:([a-z]+\/[a-z0-9\-\+\.]+);base64,[A-Za-z0-9+/]+={0,2}$/i;

    return base64DataUrlRegex.test(cadena.trim());
  };

  const isImageFile = (file) => {
    if (!file || !file.type) return false;
    return (
      file.type.startsWith("image/") ||
      file.type === "image/heic" ||
      file.type === "image/heif"
    );
  };

  const customUploader = async (event) => {
    const file = event.files[0];
    if (!file) return;

    let processedFile = file;

    // Detectar si es imagen
    if (isImageFile(file)) {
      try {
        const options = {
          maxSizeMB: 1, // reducir a ~1MB
          maxWidthOrHeight: 1920, // ajustar dimensiones si es muy grande
          useWebWorker: true,
        };
        processedFile = await imageCompression(file, options);
      } catch (err) {
        console.error("Error al comprimir imagen:", err);
      }
    } else {
      console.log("Archivo no es imagen, se sube sin cambios:", file.type);
    }

    // Guardamos directamente el File en formik
    formikFactura.setFieldValue("facturaFile", processedFile);

    // Opcional: guardar el nombre para mostrarlo en UI
    setFileName(file.name);

    // Si quieres previsualizar imágenes/pdf:
    const objectUrl = URL.createObjectURL(file);
    formikFactura.setFieldValue("facturaBlob", objectUrl);

    // Limpiar input
    event.options.clear();
  };

  const dataDespesaCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString);
    if (captureDialog.consulta) {
      return dateMomentObject.format("DD-MM-YYYY");
    } else if (value !== null) {
      return dateMomentObject.toDate();
    } else {
      return new Date();
    }
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.name")}`,
    value: formikFactura.values.nom,
    onChange: (e) => {
      formikFactura.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
    disabled: captureDialog.consulta,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.surname1")}`,
    value: formikFactura.values.llinatge1,
    onChange: (e) => {
      formikFactura.setFieldValue("llinatge1", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("llinatge1") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("llinatge1") ? "form-text-invalid" : ""
    }`,
    disabled: captureDialog.consulta,
  };

  const llinatge2Props = {
    id: "llinatge2",
    label: `${t("t.surname2")}`,
    value: formikFactura.values.llinatge2,
    onChange: (e) => {
      formikFactura.setFieldValue("llinatge2", e.target.value);
    },
    disabled: captureDialog.consulta,
  };

  const despesaProps = {
    id: "despesa",
    label: `${t("t.despesa")}`,
    value: formikFactura.values.despesa,
    mode: "currency",
    currency: "EUR",
    onValueChange: (e) => {
      formikFactura.setFieldValue("despesa", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("despesa") ? "invalid-inputnumber" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("despesa") ? "form-text-invalid" : ""
    }`,
    disabled: captureDialog.consulta,
  };

  const dataFacturaProps = {
    id: "dataFactura",
    label: `${t("t.data.despesa")}`,
    value: dataDespesaCalc(formikFactura.values.dataFactura),
    view: "date",
    dateFormat: "dd/mm/yy",
    onChange: (e) => {
      formikFactura.setFieldValue("dataFactura", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("dataFactura") ? "formcalendar-invalid" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("dataFactura") ? "form-text-invalid" : ""
    }`,
    disabled: captureDialog.consulta,
  };

  const estatProps = {
    id: "estat",
    label: `${t("t.payment.state")}`,
    value: formikFactura.values.estat,
    onChange: (e) => {
      formikFactura.setFieldValue("estat", e.value);
    },
    options: opcionsPagament,
    optionLabel: "nom",
    optionValue: "valor",
    classNameError: `${isFormFieldInvalid("estat") ? "invalid-select" : ""}`,
    labelClassName: `${isFormFieldInvalid("estat") ? "form-text-invalid" : ""}`,
    disabled: captureDialog.consulta,
  };

  const observacioProps = {
    id: "observacions",
    label: `${t("t.observacions")}`,
    value: formikFactura.values.observacio,
    onChange: (e) => {
      formikFactura.setFieldValue("observacio", e.target.value);
    },
    disabled: captureDialog.consulta,
  };

  const facturaUploader = {
    id: "logo-up",
    mode: "basic",
    label: `${t(`t.document`)}`,
    customUpload: true,
    uploadHandler: customUploader,
    accept: "*",
    auto: true,
    chooseLabel: `${t("t.afegeix")}`,
    disabled: captureDialog.consulta,
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
          <FormInputNumber props={despesaProps}></FormInputNumber>
          {getFormErrorMessage("despesa")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatProps}></SelectOneMenu>
          {getFormErrorMessage("estatPagament")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          {!captureDialog.consulta ? (
            <>
              <FormCalendar props={dataFacturaProps} />
              <br />
              {getFormErrorMessage("dataFactura")}
            </>
          ) : (
            <FormInputText props={dataFacturaProps}></FormInputText>
          )}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormTextArea props={observacioProps}></FormTextArea>
        </div>
        <div className="row align-items-center align-content-center mt-3 mt-md-0 gap-3">
          <div className="col-12 col-md-1 text-center text-md-start form-group">
            <FileUploader props={facturaUploader} />
          </div>
          {formikFactura.values.factura &&
            !esBase64Embebida(formikFactura.values.factura) && (
              <div className="col-12 col-md-2 text-center text-md-start form-group mt-3 mt-md-0 ms-3 my-auto">
                <>
                  <p>{t("t.document.original")}</p>
                  <p>
                    <a
                      href={
                        process.env.REACT_APP_URI_BACK +
                        formikFactura.values.factura
                      }
                      target="_blank"
                    >
                      {t("t.document")}
                    </a>
                  </p>
                </>
              </div>
            )}
          <div className="col-12 col-md-2 text-center text-md-start form-group mt-3 mt-md-0 ms-3">
            {formikFactura.values.facturaBlob && (
              <>
                <p>{t("t.document.annexat")}</p>
                <p>
                  <a href={formikFactura.values.facturaBlob} target="_blank">
                    {t("t.document")}
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const CaixaFixaPage = ({ props }) => {
  const location = useLocation();
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const opcionsPagament = gestorfutbolService.getOpcionsPagament();
  const [factures, setFactures] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState({
    visible: false,
    consulta: false,
  });
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);
  let emptyFactura = {
    id: null,
    nom: "",
    llinatge1: "",
    llinatge2: "",
    despesa: 0,
    dataFactura: null,
    observacio: "",
    factura: "",
    estat: null,
    campanya: activeCampaign,
  };
  const [selectedFactura, setSelectedFactura] = useState(emptyFactura);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });
  const [filterVisible, setFilterVisible] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const cm = useRef(null);

  const emptyDadesFactures = {
    totalFactures: 0,
    totalPagat: 0,
    pendentPagar: 0,
  };

  const [dadesFactures, setDadesFactures] = useState(emptyDadesFactures);

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
    {
      label: `${t("t.consulta")}`,
      icon: "pi pi-fw pi-eye",
      command: () => {
        setCaptureDialog({
          visible: true,
          consulta: true,
        });
      },
    },
  ];

  const [tabMenuItems, setTabMenuItems] = useState(null);

  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveIndex(e.index);
      let result = campaigns[e.index];
      setActiveCampaign(result.id);
      setSelectedFactura(emptyFactura);
    },
  };

  const estatPagamentBodyTemplate = (factura) => {
    let estat = opcionsPagament.find((o) => {
      return o.valor === factura.estat;
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

  const dataDespesaBody = (rowData) => {
    // Crear objeto Date
    const fecha = new Date(rowData.dataFactura);

    // Obtener día, mes y año
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const anio = fecha.getFullYear();

    // Formatear como dd/mm/yyyy
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return (
      <>
        {viewWidth <= 900 ? (
          <span className="fw-bold">{t("t.data.despesa")}</span>
        ) : (
          <></>
        )}
        <span>{fechaFormateada}</span>
      </>
    );
  };

  const facturaBodyTemplate = (factura) => {
    if (factura.factura) {
      return (
        <a
          href={process.env.REACT_APP_URI_BACK + factura.factura}
          target="_blank"
          rel="noreferrer"
        >
          {t("t.document")}
        </a>
      );
    }
  };

  const textEditor = (options) => {
    const textProps = {
      type: "text",
      value: options.value,
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormInputText props={textProps} />;
  };

  const textAreaEditor = (options) => {
    const textProps = {
      type: "text",
      value: options.value,
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormTextArea props={textProps} />;
  };

  const numberEditor = (options) => {
    const numberProps = {
      value: options.value,
      keyfilter: "int",
      onChange: (e) => options.editorCallback(e.target.value),
    };
    return <FormInputText props={numberProps} />;
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
      id: "estat_editor",
      value: options.rowData.estat,
      onChange: (e) => options.editorCallback(e.value),
      options: opcionsPagament,
      optionLabel: "nom",
      optionValue: "valor",
      className: "selectonemenu-large",
    };
    return !options.rowData.patrocinador ? (
      <SelectOneMenu props={optionsProps} />
    ) : (
      <></>
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
    { field: "id", header: `${t("t.id")}`, sortable: true },
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
      field: "despesa",
      header: `${t("t.despesa")}`,
      editor: (options) => numberEditor(options),
      sortable: true,
    },
    {
      field: "dataFactura",
      header: `${t("t.data.despesa")}`,
      editor: (options) => calendarEditor(options),
      body: dataDespesaBody,
      sortable: true,
    },
    {
      field: "estat",
      header: `${t("t.payment.state")}`,
      body: estatPagamentBodyTemplate,
      editor: (options) => opcionsEditor(options),
      sortable: true,
    },
    {
      field: "observacio",
      header: `${t("t.observacions")}`,
      editor: (options) => textAreaEditor(options),
    },
    {
      field: "factura",
      header: `${t("t.document")}`,
      body: facturaBodyTemplate,
    },
    { rowEditor: true },
  ];

  const accept = () => {
    gestorfutbolService.deleteCaixaFixa(selectedFactura.id).then(() => {
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
    disabled: selectedFactura.id === null,
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
      setSelectedFactura(emptyFactura);
      formikFactura.resetForm();
      setCaptureDialog({
        visible: true,
        consulta: false,
      });
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
      setCaptureDialog({
        visible: true,
        consulta: false,
      });
    },
    tooltip: `${t("t.edita")}`,
    tooltipOptions: {
      position: "bottom",
    },
    disabled: selectedFactura.id === null,
  };

  const consultaButton = {
    icon: "pi pi-eye",
    className: "circular-btn",
    onClick: () => {
      setCaptureDialog({
        visible: true,
        consulta: true,
      });
    },
    tooltip: `${t("t.consulta")}`,
    tooltipOptions: {
      position: "bottom",
    },
    disabled: selectedFactura.id === null,
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

  useEffect(() => {
    let results;
    gestorfutbolService.getAllCampaigns().then((data) => {
      results = data.data;
      setCampaigns(results);
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
    if (location.state?.filtre) {
      filterFactura(location.state.filtre);
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
      campanyaActiva: activeCampaign,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };

    gestorfutbolService
      .getCaixesFixes(apiFilter)
      .then((data) => {
        setTotalRecords(data.data.total);
        let results = data.data.result;
        setFactures(results);
      })
      .then(() => {
        if (activeCampaign) {
          explotacioDadesService
            .getDadesExplotacioCaixaFixa(activeCampaign)
            .then((data) => {
              setDadesFactures(data.data);
            });
        }
      });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveCaixaFixa(newData).then(() => loadLazyData());
  };

  const onSort = (event) => {
    event.page = lazyState.page;
    setlazyState(event);
  };

  const tableHeader = () => {
    return (
      <div className="table-header-container d-flex flex-column flex-md-row gap-3">
        <span>
          {t("t.total.tiquets")}: {dadesFactures.totalFactures} €
        </span>
        <span>
          {t("t.total.pagat")}: {dadesFactures.totalPagat} €
        </span>
        <span>
          {t("t.pendent.pagar")}: {dadesFactures.pendentPagar} €
        </span>
      </div>
    );
  };

  const tableProps = {
    data: factures,
    selectedData: selectedFactura,
    selectionMode: "single",
    paginator: true,
    paginatorPosition: `${
      viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"
    }`,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedFactura(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedFactura(emptyFactura);
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
    onContextMenu: (e) => cm.current.show(e.originalEvent),
    contextMenuSelection: selectedFactura,
    onContextMenuSelectionChange: (e) => setSelectedFactura(e.value),
    header: tableHeader,
  };

  const saveFactura = (data) => {
    if (selectedFactura.id) {
      data.id = selectedFactura.id;
    }

    let file;

    if (formikFactura.values.facturaFile) {
      file = formikFactura.values.facturaFile;
    } else {
      file = "";
    }

    const facturaData = {
      id: formikFactura.values.id,
      campanya: formikFactura.values.campanya,
      nom: formikFactura.values.nom,
      llinatge1: formikFactura.values.llinatge1,
      llinatge2: formikFactura.values.llinatge2,
      despesa: formikFactura.values.despesa,
      dataFactura: formikFactura.values.dataFactura,
      observacio: formikFactura.values.observacio,
      estat: formikFactura.values.estat,
      factura: formikFactura.values.factura,
    };

    gestorfutbolService.saveCaixaFixa(facturaData, file).then(() => {
      setCaptureDialog({
        visible: false,
        consulta: false,
      });
      loadLazyData();
    });
  };

  const filterFactura = (data) => {
    let facturaFilters = {};
    if (data.observacio) {
      facturaFilters.observacio = {
        value: data.observacio,
        matchMode: "contains",
      };
    }
    if (data.nom) {
      facturaFilters.nom = {
        value: data.nom,
        matchMode: "contains",
      };
    }
    if (data.estat) {
      facturaFilters.estat = {
        value: data.estat,
        matchMode: "equals",
      };
    }

    setlazyState((prevState) => ({
      ...prevState,
      filters: facturaFilters,
    }));
  };

  const hideDialog = () => {
    setCaptureDialog({
      visible: false,
      consulta: false,
    });
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

  const formikFactura = useFormik({
    initialValues: {
      nom: selectedFactura.nom,
      llinatge1: selectedFactura.llinatge1,
      llinatge2: selectedFactura.llinatge2,
      despesa: selectedFactura.despesa,
      dataFactura: selectedFactura.dataFactura,
      observacio: selectedFactura.observacio,
      factura: selectedFactura.factura,
      facturaFile: null,
      facturaBlob: null,
      estat: selectedFactura.estat,
      campanya: activeCampaign,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }
      if (!data.llinatge2) {
      }
      if (!data.despesa) {
        errors.despesa = t("t.empty.field");
      }
      if (!data.patrocinador) {
      }
      if (!data.estat) {
        errors.estat = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveFactura(data);
    },
  });

  const formikFilters = useFormik({
    initialValues: {
      observacio: emptyFactura.observacio,
      nom: emptyFactura.nom,
      despesa: emptyFactura.donacio,
      estatPagament: emptyFactura.estatPagament,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      return errors;
    },
    onSubmit: (data) => {
      filterFactura(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <PageTitle props={{ title: `${t("t.tiquets")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="row justify-content-between align-items-start flex-wrap">
        <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={filterButton} />
        </div>
        <div className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={newButton}></BasicButton>
          <BasicButton props={editButton}></BasicButton>
          <BasicButton props={consultaButton}></BasicButton>
          <BasicButton props={deleteButton}></BasicButton>
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
        <ContextMenu model={menuModel} ref={cm} />
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog.visible}
        header={t("t.nou.tiquet").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikFactura.handleSubmit}>
          <FacturaContext.Provider
            value={{
              selectedFactura,
              setSelectedFactura,
              formikFactura,
              captureDialog,
            }}
          >
            <FacturaDataForm />
          </FacturaContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

/*const CaixaFixaPage = ({props}) => {
    return (
        <div>CAixaFixaPage</div>
    )
}*/

export default CaixaFixaPage;
