import "./facturespage.css";
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
import * as xlsx from "xlsx";
import * as module from "file-saver";
import { explotacioDadesService } from "../../services/real/explotacioDadesService";
import { useLocation } from "react-router-dom";
import { useActiveCampaign } from "../../hooks/campaignHook";
import { exportToExcel } from "../../helpers/excelExport";

const FacturaContext = createContext();
const FiltraContext = createContext();

const FilterDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { formikFilters } = useContext(FiltraContext);
  const [estatsPagament, setEstatsPagament] = useState([]);
  const [categoriesDespesa, setCategoriesDespesa] = useState([]);
  const [proveidors, setProveidors] = useState([]);

  useEffect(() => {
    gestorfutbolService.getEstatsPagament().then((data) => {
      let results = data.data;

      const estatsFormatejats = results.map((item) => ({
        valor: item.valor,
        nom: t(`t.estat.${item.valor}`),
      }));
      setEstatsPagament(estatsFormatejats);
    });

    gestorfutbolService.getAllCategoriaDespesa().then((data) => {
      let results = data.data;
      setCategoriesDespesa(results);
    });

    gestorfutbolService.getAllProveidors().then((data) => {
      let results = data.data;
      setProveidors(results);
    });
  }, []);

  const dataDonacioCalc = (value) => {
    let dateString = value;
    let dateMomentObject = moment(dateString, "YYYY-MM-DD");
    return dateMomentObject.toDate();
  };

  const proveidorProps = {
    id: "proveidor",
    label: `${t("t.proveidor")}`,
    value: formikFilters.values.proveidor.id,
    onChange: (e) => {
      formikFilters.setFieldValue(
        "proveidor",
        proveidors.find((prov) => prov.id === e.value)
      );
    },
    options: proveidors,
    optionLabel: "nom",
    optionValue: "id",
  };

  const categoriaDespesaProps = {
    id: "categoriaDespesa",
    label: `${t("t.categoria.despesa")}`,
    value: formikFilters.values.categoriaDespesa.id,
    onChange: (e) => {
      formikFilters.setFieldValue(
        "categoriaDespesa",
        categoriesDespesa.find((cat) => cat.id === e.value)
      );
    },
    options: categoriesDespesa,
    optionLabel: "nom",
    optionValue: "id",
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

  const concepteProps = {
    id: "concepte",
    label: `${t("t.concepte")}`,
    value: formikFilters.values.concepte,
    onChange: (e) => {
      formikFilters.setFieldValue("concepte", e.value);
    },
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <SelectOneMenu props={proveidorProps}></SelectOneMenu>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <SelectOneMenu props={categoriaDespesaProps}></SelectOneMenu>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <FormInputText props={concepteProps}></FormInputText>
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
  const [estatsPagament, setEstatsPagament] = useState([]);
  const [categoriasDespesa, setCategoriesDespesa] = useState([]);
  const [proveidors, setProveidors] = useState([]);

  useEffect(() => {
    gestorfutbolService.getEstatsPagament().then((data) => {
      let results = data.data;

      const estatsFormatejats = results.map((item) => ({
        valor: item.valor,
        nom: t(`t.estat.${item.valor}`),
      }));
      setEstatsPagament(estatsFormatejats);
    });

    gestorfutbolService.getAllCategoriaDespesa().then((data) => {
      let results = data.data;
      setCategoriesDespesa(results);
    });

    gestorfutbolService.getAllProveidors().then((data) => {
      let results = data.data;
      setProveidors(results);
    });
  }, []);

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
    } else if(dateString!==null){
      return dateMomentObject.toDate();
    } else {
      return new Date();
    }
  };

  const proveidorProps = {
    id: "proveidor",
    label: `${t("t.proveidor")}`,
    value: formikFactura.values.proveidor.id,
    onChange: (e) => {
      formikFactura.setFieldValue(
        "proveidor",
        proveidors.find((prov) => prov.id === e.value)
      );
    },
    options: proveidors,
    optionLabel: "nom",
    optionValue: "id",
    classNameError: `${
      isFormFieldInvalid("proveidor") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("proveidor") ? "form-text-invalid" : ""
    }`,
    disabled: captureDialog.consulta,
  };

  const categoriaProps = {
    id: "categoriaDespesa",
    label: `${t("t.categoria.despesa")}`,
    value: formikFactura.values.categoriaDespesa.id,
    onChange: (e) => {
      formikFactura.setFieldValue(
        "categoriaDespesa",
        categoriasDespesa.find((cat) => cat.id === e.value)
      );
    },
    options: categoriasDespesa,
    optionLabel: "nom",
    optionValue: "id",
    classNameError: `${
      isFormFieldInvalid("categoriaDespesa") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("categoriaDespesa") ? "form-text-invalid" : ""
    }`,
    disabled: captureDialog.consulta,
  };

  const concepteProps = {
    id: "concepte",
    label: `${t("t.concepte")}`,
    value: formikFactura.values.concepte,
    onChange: (e) => {
      formikFactura.setFieldValue("concepte", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("concepte") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("concepte") ? "form-text-invalid" : ""
    }`,
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

  const estatPagamentProps = {
    id: "estatPagament",
    label: `${t("t.payment.state")}`,
    value: formikFactura.values.estatPagament,
    onChange: (e) => {
      formikFactura.setFieldValue("estatPagament", e.value);
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
    disabled: captureDialog.consulta,
  };

  const facturaUploader = {
    id: "document",
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
          <SelectOneMenu props={proveidorProps}></SelectOneMenu>
          {getFormErrorMessage("proveidor")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <SelectOneMenu props={categoriaProps}></SelectOneMenu>
          {getFormErrorMessage("categoriaDespesa")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormTextArea props={concepteProps}></FormTextArea>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputNumber props={despesaProps}></FormInputNumber>
          {getFormErrorMessage("despesa")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
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
        <div className="row align-items-center align-content-center mt-3 mt-md-0 gap-3">
          <div className="col-12 col-md-1 text-center text-md-start form-group">
            <FileUploader props={facturaUploader} />
          </div>
          {formikFactura.values.factura &&
            !esBase64Embebida(formikFactura.values.document) && (
              <div className="col-12 col-md-2 text-center text-md-start form-group mt-3 mt-md-0 ms-3 my-auto">
                <>
                  <p>{t("t.document.original")}</p>
                  <p>
                    <a
                      href={
                        process.env.REACT_APP_URI_BACK +
                        formikFactura.values.document
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

const FacturaPage = ({ props }) => {
  const location = useLocation();
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const [estatsPagament, setEstatsPagament] = useState([]);
  const [factures, setFactures] = useState([]);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState({
    visible: false,
    consulta: false,
  });
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
  let emptyFactura = {
    id: null,
    campanya: activeCampaign,
    proveidor: {
      id: null,
      nom: "",
      nomComercial: "",
      cif: "",
      contactes: [],
    },
    categoriaDespesa: {
      id: null,
      nom: "",
    },
    despesa: 0,
    dataFactura: null,
    observacio: "",
    document: "",
    estatPagament: null,
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


  const tabMenu = {
    model: tabMenuItems,
    activeIndex: activeIndex,
    onTabChange: (e) => {
      setActiveByIndex(e.index);
      let result = campaigns[e.index];
      setSelectedFactura(emptyFactura);
    },
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

  const facturaBodyTemplate = (factura) => {
    if (factura.document) {
      return (
        <a
          href={process.env.REACT_APP_URI_BACK + factura.document}
          target="_blank"
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
      options: estatsPagament,
      optionLabel: "nom",
      optionValue: "id",
      className: "selectonemenu-large",
    };
    return !options.rowData.patrocinador ? (
      <SelectOneMenu props={optionsProps} />
    ) : (
      <></>
    );
  };

  const dataFacturaBody = (rowData) => {
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
          <span className="fw-bold">{t("t.data.factura")}</span>
        ) : (
          <></>
        )}
        <span>{fechaFormateada}</span>
      </>
    );
  };

  const tableColumns = [
    { field: "id", header: `${t("t.id")}`, sortable: true },
    {
      field: "proveidor.nom",
      header: `${t("t.proveidor")}`,
      sortable: true,
    },
    {
      field: "proveidor.nomComercial",
      header: `${t("t.nom.comercial")}`,
      sortable: true,
    },
    {
      field: "dataFactura",
      header: `${t("t.data.factura")}`,
      body: dataFacturaBody,
      sortable: true,
    },
    {
      field: "categoriaDespesa.nom",
      header: `${t("t.categoria.despesa")}`,
      sortable: true,
    },
    {
      field: "concepte",
      header: `${t("t.concepte")}`,
      sortable: true,
    },
    {
      field: "despesa",
      header: `${t("t.despesa")}`,
      sortable: true,
    },
    {
      field: "estatPagament",
      header: `${t("t.payment.state")}`,
      body: estatPagamentBodyTemplate,
      sortable: true,
    },
    {
      field: "document",
      header: `${t("t.document")}`,
      body: facturaBodyTemplate,
    },
  ];

  const accept = () => {
    gestorfutbolService.deleteFactura(selectedFactura.id).then(() => {
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

  async function exportExcel() {
    let apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
      campanyaActiva: activeCampaignId,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };
    const res = await gestorfutbolService.getAllFacturas(apiFilter);
    const rows = res.data || [];

    await exportToExcel(rows, undefined, {
      fileName: "factures",
      sheetName: "Factures",
      tableName: "TablaFactures",
      totalsRow: true,
    });
  }

  useEffect(() => {
    let results;

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
      campanyaActiva: activeCampaignId,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    };

    gestorfutbolService
      .getFacturas(apiFilter)
      .then((data) => {
        setTotalRecords(data.data.total);
        let results = data.data.result;
        setFactures(results);
      })
      .then(() => {
        if (activeCampaign) {
          explotacioDadesService
            .getDadesExplotacioFactures(activeCampaignId)
            .then((data) => {
              setDadesFactures(data.data);
            });
        }
      });
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    gestorfutbolService.saveFactura(newData).then(() => loadLazyData());
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
      proveidor: formikFactura.values.proveidor,
      categoriaDespesa: formikFactura.values.categoriaDespesa,
      concepte: formikFactura.values.concepte,
      despesa: formikFactura.values.despesa,
      document: formikFactura.values.document,
      dataFactura: formikFactura.values.dataFactura,
      estatPagament: formikFactura.values.estatPagament,
    };

    gestorfutbolService.saveFactura(facturaData, file).then(() => {
      setCaptureDialog({
        visible: false,
        consulta: false,
      });
      loadLazyData();
    });
  };

  const filterFactura = (data) => {
    let facturaFilters = {};

    console.log("Filtering with data:", data);

    if (data.proveidor) {
      facturaFilters["proveidor.nom"] = {
        value: data.proveidor.nom,
        matchMode: "equals",
      };
    }

    if (data.categoriaDespesa) {
      facturaFilters["categoriaDespesa.nom"] = {
        value: data.categoriaDespesa.nom,
        matchMode: "equals",
      };
    }

    if (data.concepte) {
      facturaFilters["concepte"] = {
        value: data.concepte,
        matchMode: "contains",
      };
    }

    if (data.estatPagament) {
      facturaFilters["estatPagament"] = {
        value: data.estatPagament,
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
      proveidor: selectedFactura.proveidor,
      categoriaDespesa: selectedFactura.categoriaDespesa,
      concepte: selectedFactura.concepte,
      despesa: selectedFactura.despesa,
      observacio: selectedFactura.observacio,
      document: selectedFactura.document,
      facturaFile: null,
      facturaBlob: null,
      estatPagament: selectedFactura.estatPagament,
      campanya: activeCampaignId,
      dataFactura: selectedFactura.dataFactura,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.despesa) {
        errors.despesa = t("t.empty.field");
      }
      if (!data.dataFactura) {
        errors.dataFactura = t("t.empty.field");
      }
      if (!data.concepte) {
        errors.concepte = t("t.empty.field");
      }
      if (!data.categoriaDespesa || !data.categoriaDespesa.id) {
        errors.categoriaDespesa = t("t.empty.field");
      }
      if (!data.proveidor || !data.proveidor.id) {
        errors.proveidor = t("t.empty.field");
      }
      if (!data.estatPagament) {
        errors.estatPagament = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveFactura(data);
    },
  });

  const formikFilters = useFormik({
    initialValues: {
      proveidor: emptyFactura.proveidor,
      categoriaDespesa: emptyFactura.categoriaDespesa,
      estatPagament: emptyFactura.estatPagament,
      concepte: emptyFactura.concepte,
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
      <PageTitle props={{ title: `${t("t.factures")}` }}></PageTitle>
      <TabMenuComponent props={tabMenu}></TabMenuComponent>
      <div className="row justify-content-between align-items-start flex-wrap">
        <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
          <BasicButton props={filterButton} />
          <BasicButton props={exportButton} />
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

/*const FacturaPage = ({props}) => {
    return (
        <div>FacturaPage</div>
    )
}*/

export default FacturaPage;
