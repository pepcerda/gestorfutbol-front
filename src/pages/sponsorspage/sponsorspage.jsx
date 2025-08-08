import './sponsorspage.css';
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {useFormik} from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";
import FormInputText from "../../components/forminputtext/forminputtext";
import FormCalendar from "../../components/formcalendar/formcalendar";
import FormInputNumber from "../../components/forminputnumber/forminputnumber";
import moment from "moment";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import {saveAs} from 'file-saver';
import {Calendar} from "primereact/calendar";
import FormTextArea from "../../components/formtextarea/formtextarea";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import {ConfigContext} from "../../App";
import FileUploader from "../../components/fileuploader/fileuploader";
import {DataTable} from "primereact/datatable";
import {Card} from "primereact/card";
import {Sidebar} from "primereact/sidebar";
import * as xlsx from 'xlsx';
import * as module from 'file-saver';
import {useLocation} from "react-router-dom";

const SponsorContext = createContext();
const DuplicaContext = createContext();
const FiltraContext = createContext();

const FilterDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {formikFilters} = useContext(FiltraContext);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();

    const dataDonacioCalc = (value) => {
        let dateString = value;
        let dateMomentObject = moment(dateString, 'YYYY-MM-DD');
        return dateMomentObject.toDate();
    }

    const cifProps = {
        id: "cif",
        label: `${t("t.cif")}`,
        value: formikFilters.values.cif,
        onChange: (e) => {
            formikFilters.setFieldValue("cif", e.target.value);
        }
    };

    const nomProps = {
        id: "nom",
        label: `${t("t.name")}`,
        value: formikFilters.values.nom,
        onChange: (e) => {
            formikFilters.setFieldValue("nom", e.target.value);
        }
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
        optionValue: "valor"
    };

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={cifProps}></FormInputText>
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={nomProps}></FormInputText>
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
                    <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
                </div>
            </div>
        </>
    );
};
const SponsorDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {selectedSponsor, setSelectedSponsor, formikSponsor, captureDialog} =
        useContext(SponsorContext);

    const [selectCheck, setSelectedCheck] = useState(null);
    const [fecha, setFecha] = useState(null);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();
    const [fileName, setFileName] = useState(null);


    const isFormFieldInvalid = (name) =>
        !!(formikSponsor.touched[name] && formikSponsor.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikSponsor.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            formikSponsor.setFieldValue("logo", base64data);
            setFileName(file.name);
            event.options.clear();
        };

    };

    const dataDonacioCalc = (value) => {
        let dateString = value;
        let dateMomentObject = moment(dateString);
        if (captureDialog.consulta) {
            return dateMomentObject.format('DD-MM-YYYY');
        } else {
            return dateMomentObject.toDate();
        }
    }

    const cifProps = {
        id: "cif",
        label: `${t("t.cif")}`,
        value: formikSponsor.values.cif,
        onChange: (e) => {
            formikSponsor.setFieldValue("cif", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
        disabled: captureDialog.consulta
    };

    const nomProps = {
        id: "nom",
        label: `${t("t.name")}`,
        value: formikSponsor.values.nom,
        onChange: (e) => {
            formikSponsor.setFieldValue("nom", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
        disabled: captureDialog.consulta
    };

    const donacioProps = {
        id: "donacio",
        label: `${t('t.donation')}`,
        value: formikSponsor.values.donacio,
        mode: "currency",
        currency: "EUR",
        onValueChange: (e) => {
            formikSponsor.setFieldValue('donacio', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('donacio') ? 'invalid-inputnumber' : ''}`,
        labelClassName: `${isFormFieldInvalid('donacio') ? 'form-text-invalid' : ''}`,
        disabled: captureDialog.consulta
    };

    const dataDonacioProps = {
        id: "dataDonacio",
        label: `${t('t.donation.date')}`,
        value: dataDonacioCalc(formikSponsor.values.dataDonacio),
        view: "date",
        dateFormat: "dd/mm/yy",
        onChange: (e) => {
            formikSponsor.setFieldValue('dataDonacio', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('dataDonacio') ? 'formcalendar-invalid' : ''}`,
        labelClassName: `${isFormFieldInvalid('dataDonacio') ? 'form-text-invalid' : ''}`,
        disabled: captureDialog.consulta
    };

    const estatPagamentProps = {
        id: "estat-pagament",
        label: `${t("t.payment.state")}`,
        value: formikSponsor.values.estatPagament,
        onChange: (e) => {
            formikSponsor.setFieldValue("estatPagament", e.value);
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
        disabled: captureDialog.consulta
    };


    const observacioProps = {
        id: "observacions",
        label: `${t("t.observacions")}`,
        value: formikSponsor.values.observacio,
        onChange: (e) => {
            formikSponsor.setFieldValue("observacio", e.target.value);
        },
        disabled: captureDialog.consulta
    };

    const logoUploader = {
        id: "logo-up",
        mode: "basic",
        label: `${t(`t.logo`)}`,
        customUpload: true,
        uploadHandler: customBase64Uploader,
        accept: "image/*",
        auto: true,
        chooseLabel: `${t('t.afegeix')}`
    }


    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={cifProps}></FormInputText>
                    {getFormErrorMessage("cif")}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={nomProps}></FormInputText>
                    {getFormErrorMessage("nom")}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputNumber props={donacioProps}></FormInputNumber>
                    {getFormErrorMessage('donacio')}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    {!captureDialog.consulta ? (
                        <>
                            <FormCalendar props={dataDonacioProps}/>
                            <br/>
                            {getFormErrorMessage('dataDonacio')}
                        </>
                    ) : <FormInputText props={dataDonacioProps}></FormInputText>}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormTextArea props={observacioProps}></FormTextArea>
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
                    <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
                    {getFormErrorMessage("estatPagament")}
                </div>
                <div className="row align-items-center align-content-center mt-3 mt-md-0">
                    <div className="col-12 col-md-1 text-center text-md-start form-group">
                        <FileUploader props={logoUploader}/>
                    </div>
                    <div className="col-12 col-md-1 text-center text-md-start form-group mt-3 mt-md-0 ms-3 my-auto">
                        {formikSponsor.values.logo && <>
                            <p>{t('t.logo.original')}</p>
                            <p><a href={process.env.REACT_APP_URI_BACK + formikSponsor.values.logo}
                                  target="_blank">{t('t.document')}</a></p>
                        </>}
                    </div>
                    <div className="col-12 col-md-1 text-center text-md-start form-group mt-3 mt-md-0 ms-3">
                        {fileName && <>
                            <p>{t('t.logo.annexat')}</p>
                            <p>{fileName}</p>
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
};

const DuplicaForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {formikDuplica, campaigns} = useContext(DuplicaContext);

    const isFormFieldInvalid = (name) =>
        !!(formikDuplica.touched[name] && formikDuplica.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikDuplica.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const campanyesProps = {
        id: "campanya",
        label: `${t('t.campaign')}`,
        value: formikDuplica.values.campanya,
        onChange: (e) => {
            formikDuplica.setFieldValue(`campanya`, e.value);
        },
        options: campaigns,
        optionLabel: "titol",
        optionValue: "id",
        classNameError: `${
            isFormFieldInvalid("campanya") ? "invalid-select" : ""
        }`,
        labelClassName: `${
            isFormFieldInvalid("campanya") ? "form-text-invalid" : ""
        }`
    };

    return (
        <>
            <p>{t('t.select.campaign')}</p>
            <div className="row">
                <div className="col-12 form-group text-center text-md-start mt-3 mt-md-0">
                    <SelectOneMenu props={campanyesProps}></SelectOneMenu>
                    {getFormErrorMessage("campanya")}
                </div>
            </div>
        </>
    );


}

const SponsorsPage = ({props}) => {

    const location = useLocation();
    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const [sponsors, setSponsors] = useState([]);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState({
        visible: false,
        consulta: false
    });
    const [captureDialogDuplica, setCaptureDialogDuplica] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [campaigns, setCampaigns] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);
    let emptySponsor = {
        id: 0,
        cif: "",
        nom: "",
        donacio: 0,
        dataDonacio: new Date(),
        observacio: "",
        estatPagament: null,
        logo: "",
        campanya: activeCampaign
    };
    const [selectedSponsor, setSelectedSponsor] = useState(emptySponsor);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortOrder: null,
        sortField: null
    });

    const [activeIndex, setActiveIndex] = useState(0)
    const [tabMenuItems, setTabMenuItems] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);

    const tabMenu = {
        model: tabMenuItems,
        activeIndex: activeIndex,
        onTabChange: (e) => {
            setActiveIndex(e.index);
            let result = campaigns[e.index];
            setActiveCampaign(result.id);
            setSelectedSponsor(emptySponsor);
        }
    }

    const donwloadPdfButton = (id) => {
        const props = {
            icon: "pi pi-file",
            onClick: () => {
                gestorfutbolService.getReceipt(id)
                    .then(r => {
                        handleDownload(r.data)
                    })
            },
            className: "download-button p-0"
        }
        return (
            <BasicButton props={props}></BasicButton>
        )
    }

    const dataDonacioBody = (rowData) => {


        // Crear objeto Date
        const fecha = new Date(rowData.dataDonacio);

        // Obtener día, mes y año
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const anio = fecha.getFullYear();

        // Formatear como dd/mm/yyyy
        const fechaFormateada = `${dia}/${mes}/${anio}`;


        return (
            <>
                {viewWidth <= 900 ?
                    (
                        <span className="fw-bold">{t("t.donation.date")}</span>
                    ) : (
                        <></>
                    )
                }
                <span>{fechaFormateada}</span>
            </>
        );
        ;
    }

    const estatPagamentBodyTemplate = (sponsor) => {
        let estat = opcionsPagament.find(o => {
            return o.valor === sponsor.estatPagament;
        });

        if (estat != null) {
            return (
                <>
                    {viewWidth <= 900 ?
                        (
                            <span className="fw-bold">{t("t.payment.state")}</span>
                        ) : (
                            <></>
                        )
                    }
                    <span
                        className={`${estat.valor === 'P' ? 'text-bg-success' : 'text-bg-danger'} px-3 py-2 rounded-pill`}>{estat.nom}</span>
                </>
            );
        }

    };

    const logoBodyTemplate = (sponsor) => {
        if (sponsor.logo) {
            return (
                <a href={process.env.REACT_APP_URI_BACK + sponsor.logo} target="_blank">{t('t.document')}</a>
            )
        }

    }


    const tableColumns = [
        {field: "id", header: `${t("t.id")}`, sortable: true},
        {field: "cif", header: `${t("t.cif")}`, editor: (options) => textEditor(options), filter: true},
        {field: "nom", header: `${t("t.name")}`, editor: (options) => textEditor(options)},
        {field: "donacio", header: `${t("t.donation")}`, editor: (options) => numberEditor(options)},
        {
            field: "dataDonacio",
            header: `${t("t.donation.date")}`,
            editor: (options) => calendarEditor(options),
            body: dataDonacioBody
        },
        {
            field: "estatPagament",
            header: `${t("t.payment.state")}`,
            body: estatPagamentBodyTemplate,
            editor: (options) => opcionsEditor(options),
            sortable: true
        },
        {field: "logo", header: `${t("t.logo")}`, body: logoBodyTemplate},
        {header: `${t("t.rebut")}`, body: (rowData) => donwloadPdfButton(rowData.id)},
        {rowEditor: true}
    ];

    const accept = () => {
        gestorfutbolService.deleteSponsor(selectedSponsor.id)
            .then(() => {
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
            accept,
            reject,
        });
    };

    const deleteButton = {
        icon: "pi pi-trash",
        className: "circular-btn",
        disabled: selectedSponsor === null,
        onClick: confirm,
        tooltip: `${t('t.elimina')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const duplicaButton = {
        icon: "pi pi-clone",
        className: "circular-btn",
        disabled: campaigns !== null && campaigns.length === 1,
        onClick: () => {
            setCaptureDialogDuplica(true);
        },
        tooltip: `${t('t.duplica')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };


    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedSponsor(emptySponsor);
            formikSponsor.resetForm();
            setCaptureDialog({
                visible: true,
                consulta: false
            });
        },
        tooltip: `${t('t.nou')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const editButton = {
        icon: "pi pi-pencil",
        className: "circular-btn",
        onClick: () => {
            setCaptureDialog({
                visible: true,
                consulta: false
            });
        },
        tooltip: `${t('t.edita')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const consultaButton = {
        icon: "pi pi-eye",
        className: "circular-btn",
        onClick: () => {
            setCaptureDialog({
                visible: true,
                consulta: true
            });
        },
        tooltip: `${t('t.consulta')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const filterButton = {
        icon: "pi pi-filter",
        className: "circular-btn",
        onClick: () => {
            setFilterVisible(!filterVisible);
        },
        tooltip: `${t('t.filtra')}`,
        tooltipOptions: {
            position: "bottom"
        }
    }

    const exportButton = {
        icon: "pi pi-file-excel",
        className: "circular-btn",
        onClick: () => {
            exportExcel()
        },
        tooltip: `${t('t.exporta')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const exportExcel = () => {

        gestorfutbolService.getAllSponsors(activeCampaign)
            .then(data => {
                const worksheet = xlsx.utils.json_to_sheet(data.data);
                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer = xlsx.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array'
                });

                saveAsExcelFile(excelBuffer, 'patrocinadors');
            })
    };

    const saveAsExcelFile = (buffer, fileName) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    };

    useEffect(() => {
        let results;
        gestorfutbolService.getAllCampaigns().then((data) => {
            results = data.data;
            setCampaigns(results);
        })
    }, [])

    useEffect(() => {
        if (campaigns !== null) {
            setTabMenuItems(campaigns.map(r => {
                    return {label: r.titol}
                }
            ))
            let year = new Date().getFullYear();
            let campaign = campaigns.find(c =>
                new Date(c.any).getFullYear() === year
            )
            if (campaign) {
                let index = campaigns.findIndex(c => c.id === campaign.id);
                setActiveCampaign(campaign.id);
                setActiveIndex(index);
            } else {
                setActiveCampaign(campaigns[0].id);
            }
        }

    }, [campaigns])

    useEffect(() => {
        if(location.state?.filtre) {
            filterSponsor(location.state.filtre)
        }
    }, [])

    useEffect(() => {
        loadLazyData();
        setDeleteFlag(false);
    }, [lazyState, deleteFlag, activeCampaign]);

    const handleDownload = (base64Pdf) => {
        try {
            // Eliminar cualquier prefijo de la cadena Base64
            const base64 = base64Pdf.split(',')[1] || base64Pdf;

            // Convertir Base64 a Blob
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'application/pdf'});

            // Guardar el archivo PDF
            saveAs(blob, 'documento.pdf');
        } catch (error) {
            console.error('Error al decodificar la cadena Base64:', error);
        }
    };

    const loadLazyData = () => {
        var apiFilter = {
            pageNum: lazyState.page,
            pageSize: lazyState.rows,
            campanyaActiva: activeCampaign,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            filters: lazyState.filters
        };
        gestorfutbolService.getSponsors(apiFilter).then((data) => {
            setTotalRecords(data.data.total);
            /*data.data.result.forEach(r => {
                r.dataDonacio = new Date(r.dataDonacio).toLocaleDateString('es-ES')
            })*/
            let results = data.data.result;
            setSponsors(results);
        });
    };

    const onRowEditComplete = (e) => {
        let {newData, index} = e;
        //Aquí faríem call a service, un put actualitzant dades de la fila modificada per id
        gestorfutbolService.saveSponsor(newData)
            .then(() => loadLazyData());

    };

    const onSort = (event) => {
        event.page = lazyState.page;
        setlazyState(event);
    };

    const tableProps = {
        data: sponsors,
        selectedData: selectedSponsor,
        selectionMode: "single",
        onChangeSelectedDataEvent: (e) => {
            if (e.value != null) {
                setSelectedSponsor(e.value);
            }
        },
        onRowUnselect: () => {
            setSelectedSponsor(emptySponsor);
        },
        columns: tableColumns,
        paginator: true,
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
        editMode: 'row',
        onRowEditComplete: onRowEditComplete,
        rowEditor: true,
        stripedRows: true
    };

    const saveSponsor = (data) => {
        if (selectedSponsor.id) {
            data.id = selectedSponsor.id;
        }
        gestorfutbolService.saveSponsor(data).then(() => {
                setCaptureDialog({
                    visible: false,
                    consulta: false
                });
                loadLazyData();
            }
        );
    };

    const filterSponsor = (data) => {
        let sponsorFilters = {};
        if (data.cif) {
            sponsorFilters.cif = {
                value: data.cif,
                matchMode: 'contains'
            };
        }
        ;
        if (data.nom) {
            sponsorFilters.nom = {
                value: data.nom,
                matchMode: 'contains'
            };
        }
        ;
        if (data.estatPagament) {
            sponsorFilters.estatPagament = {
                value: data.estatPagament,
                matchMode: 'equals'
            }
        }

        setlazyState(prevState => ({
            ...prevState,
            filters: sponsorFilters
        }));
    }

    const duplicaSponsor = (data) => {

        gestorfutbolService.duplicaSponsor(selectedSponsor, data.campanya)
            .then(() => {
                setCaptureDialogDuplica(false);
                setActiveCampaign(data.campanya);
                let index = campaigns.findIndex(c => c.id === data.campanya);
                setActiveIndex(index);
                loadLazyData();
            })
    }

    const hideDialog = () => {
        setCaptureDialog({
            visible: false,
            consulta: false
        });
    };

    const hideDialogDuplica = () => {
        setCaptureDialogDuplica(false);
    };

    const formikSponsor = useFormik({
        initialValues: {
            cif: selectedSponsor.cif,
            nom: selectedSponsor.nom,
            donacio: selectedSponsor.donacio,
            dataDonacio: selectedSponsor.dataDonacio,
            observacio: selectedSponsor.observacio,
            estatPagament: selectedSponsor.estatPagament,
            logo: selectedSponsor.logo,
            campanya: activeCampaign
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (!data.cif) {
                errors.cif = t("t.empty.field");
            }
            if (!data.nom) {
                errors.nom = t("t.empty.field");
            }
            if (!data.donacio) {
                errors.donacio = t("t.empty.field");
            }
            if (!data.dataDonacio) {
                errors.dataDonacio = t("t.empty.field");
            }
            if (!data.estatPagament) {
                errors.estatPagament = t("t.empty.field");
            }
            return errors;
        },
        onSubmit: (data) => {
            saveSponsor(data);
        },
    });

    const formikFilters = useFormik({
        initialValues: {
            cif: emptySponsor.cif,
            nom: emptySponsor.nom,
            donacio: emptySponsor.donacio,
            estatPagament: emptySponsor.estatPagament
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            return errors;
        },
        onSubmit: (data) => {
            filterSponsor(data);
        },
    });


    const formikDuplica = useFormik({
        initialValues: {
            campanya: activeCampaign
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (data.campanya === activeCampaign) {
                errors.campanya = t("t.sponsor.repeated");
            }

            return errors;
        },
        onSubmit: (data) => {
            duplicaSponsor(data);
        },

    });

    const cancelFormButton = {
        icon: "pi pi-times",
        className: "basicbutton-outlined me-2",
        label: `${t("t.cancel")}`,
        type: "button",
        onClick: hideDialog,
    };

    const cancelFormDuplicaButton = {
        icon: "pi pi-times",
        className: "basicbutton-outlined me-2",
        label: `${t("t.cancel")}`,
        type: "button",
        onClick: hideDialogDuplica,
    };

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t("t.save")}`,
        type: "submit",
        className: "p-2 rounded-2",
        visible: !captureDialog.consulta
    };

    const cercaFormButton = {
        icon: "pi pi-search",
        label: `${t("t.search")}`,
        type: "submit",
        className: "p-2 rounded-2 mx-2",
        onClick: () => {
            if (viewWidth < process.env.REACT_APP_XL_VW)
                setFilterVisible(false);
        }
    };

    const netejaFormButton = {
        className: "p-2 rounded-2 mx-2",
        label: `${t("t.neteja")}`,
        type: "button",
        onClick: () => {
            formikFilters.resetForm();
            setlazyState(prevState => ({
                ...prevState,
                filters: null
            }));
            setFilterVisible(false);
        }
    };


    const textEditor = (options) => {
        const textProps = {
            type: "text",
            value: options.value,
            onChange: (e) => options.editorCallback(e.target.value)
        }
        return (
            <FormInputText props={textProps}/>
        );
    };

    const numberEditor = (options) => {
        const numberProps = {
            value: options.value,
            keyfilter: "int",
            onChange: (e) => options.editorCallback(e.target.value)
        }
        return (
            <FormInputText props={numberProps}/>
        );
    };

    const textAreaEditor = (options) => {
        const textProps = {
            type: "text",
            value: options.value,
            onChange: (e) => options.editorCallback(e.target.value)
        }
        return (
            <FormTextArea props={textProps}/>
        );
    };

    const calendarEditor = (options) => {
        let dateString = options.value;
        let dateMomentObject = moment(dateString, 'YYYY-MM-DD');
        let dateObject = dateMomentObject.toDate();

        const calendarProps = {
            value: dateObject,
            dateFormat: "yy-mm-dd",
            view: "date",
            onChange: (e) => {
                options.editorCallback(moment(e.target.value).format("YYYY-MM-DD").toString());
            },
        };
        return (
            <FormCalendar props={calendarProps}/>
        );
    };

    const opcionsEditor = (options) => {

        const optionsProps = {
            id: "estatPagament_editor",
            value: options.rowData.estatPagament,
            onChange: (e) => options.editorCallback(e.value),
            options: opcionsPagament,
            optionLabel: "nom",
            optionValue: "valor",
            className: "selectonemenu-large"
        };
        return (
            !options.rowData.patrocinador ? <SelectOneMenu props={optionsProps}/> : <></>

        );
    };


    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <PageTitle props={{title: `${t("t.sponsors")}`}}></PageTitle>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            <div className="row justify-content-between align-items-start flex-wrap">
                <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
                    <BasicButton props={filterButton}/>
                    <BasicButton props={exportButton}/>
                </div>

                <div
                    className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
                    <BasicButton props={newButton}/>
                    <BasicButton props={duplicaButton}/>
                    <BasicButton props={consultaButton}/>
                    <BasicButton props={editButton}/>
                    <BasicButton props={deleteButton}/>
                </div>
            </div>

            {filterVisible && viewWidth > process.env.REACT_APP_XL_VW ? (
                <Card className="mt-3">
                    <form onSubmit={formikFilters.handleSubmit}>
                        <FiltraContext.Provider
                            value={{formikFilters}}
                        >
                            <FilterDataForm/>
                        </FiltraContext.Provider>
                        <div className="p-dialog-footer pb-0 mt-5">
                            <BasicButton props={cercaFormButton}/>
                            <BasicButton props={netejaFormButton}/>
                        </div>
                    </form>
                </Card>
            ) : <Sidebar visible={filterVisible} onHide={() => setFilterVisible(false)}>
                <form onSubmit={formikFilters.handleSubmit}>
                    <FiltraContext.Provider
                        value={{formikFilters}}
                    >
                        <FilterDataForm/>
                    </FiltraContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5 text-center">
                        <BasicButton props={cercaFormButton}/>
                        <BasicButton props={netejaFormButton}/>
                    </div>
                </form>
            </Sidebar>
            }


            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog
                visible={captureDialog.visible}
                header={t("t.new.sponsor").toUpperCase()}
                onHide={hideDialog}
            >
                <form onSubmit={formikSponsor.handleSubmit}>
                    <SponsorContext.Provider
                        value={{selectedSponsor, setSelectedSponsor, formikSponsor, captureDialog}}
                    >
                        <SponsorDataForm/>
                    </SponsorContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

            <Dialog
                visible={captureDialogDuplica}
                header={t("t.duplicate.sponsor").toUpperCase()}
                onHide={hideDialogDuplica} className="campaign-dialog"
            >
                <form onSubmit={formikDuplica.handleSubmit}>
                    <DuplicaContext.Provider
                        value={{formikDuplica, campaigns}}
                    >
                        <DuplicaForm/>
                    </DuplicaContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}


export default SponsorsPage;