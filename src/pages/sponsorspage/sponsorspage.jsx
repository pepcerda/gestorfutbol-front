import './sponsorspage.css';
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {createContext, useContext, useEffect, useState} from "react";
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

const SponsorContext = createContext();

const SponsorDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {selectedSponsor, setSelectedSponsor, formikSponsor} =
        useContext(SponsorContext);

    const [selectCheck, setSelectedCheck] = useState(null);
    const [fecha, setFecha] = useState(null);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();


    const isFormFieldInvalid = (name) =>
        !!(formikSponsor.touched[name] && formikSponsor.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikSponsor.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const cifProps = {
        id: "cif",
        label: `${t("t.cif")}`,
        value: formikSponsor.values.cif,
        onChange: (e) => {
            formikSponsor.setFieldValue("cif", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
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
        labelClassName: `${isFormFieldInvalid('donacio') ? 'form-text-invalid' : ''}`
    };

    const dataDonacioProps = {
        id: "dataDonacio",
        label: `${t('t.donation.date')}`,
        value: formikSponsor.values.dataDonacio,
        view: "date",
        dateFormat: "dd/mm/yy",
        onChange: (e) => {
            formikSponsor.setFieldValue('dataDonacio', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('dataDonacio') ? 'formcalendar-invalid' : ''}`,
        labelClassName: `${isFormFieldInvalid('dataDonacio') ? 'form-text-invalid' : ''}`
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
    };


    const observacioProps = {
        id: "observacions",
        label: `${t("t.observacions")}`,
        value: formikSponsor.values.observacio,
        onChange: (e) => {
            formikSponsor.setFieldValue("observacio", e.target.value);
        }
    };


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
                    <FormCalendar props={dataDonacioProps}/>
                    <br/>
                    {getFormErrorMessage('dataDonacio')}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormTextArea props={observacioProps}></FormTextArea>
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
                    <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
                    {getFormErrorMessage("estatPagament")}
                </div>
            </div>
        </>
    );
};

const SponsorsPage = ({props}) => {

    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const [sponsors, setSponsors] = useState([]);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
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
        campanya: activeCampaign
    };
    const [selectedSponsor, setSelectedSponsor] = useState(emptySponsor);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortOrder: null,
        sortField: null,
    });

    const [activeIndex, setActiveIndex] = useState(0)
    const [tabMenuItems, setTabMenuItems] = useState(null);

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
            className: "download-button"
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
        );;
    }

    const dataDonacioBodyTemplate = (sponsor) => {

        if (sponsor.dataDonacio != null) {
            return (
                <>
                    {viewWidth <= 900 ?
                        (
                            <span className="fw-bold">{t("t.donation.date")}</span>
                        ) : (
                            <></>
                        )
                    }
                    <span>{sponsor.dataDonacio}</span>
                </>
            );
        }

    };

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
                    <span className={`${estat.valor === 'P' ? 'text-bg-success' : 'text-bg-danger'} px-3 py-2 rounded-pill`}>{estat.nom}</span>
                </>
            );
        }

    };


    const tableColumns = [
        {field: "id", header: `${t("t.id")}`},
        {field: "cif", header: `${t("t.cif")}`, editor: (options) => textEditor(options)},
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
            editor: (options) => opcionsEditor(options)
        },
        {field: "observacio", header: `${t("t.observacions")}`, editor: (options) => textAreaEditor(options)},
        {header: `${t("t.rebut")}`, body: (rowData) => donwloadPdfButton(rowData.id)},
        {rowEditor: true}
    ];

    const accept = () => {
        gestorfutbolService.deleteSponsor(selectedSponsor.id);
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
            accept,
            reject,
        });
    };

    const deleteButton = {
        icon: "pi pi-trash",
        className: "circular-btn",
        disabled: selectedSponsor === null,
        onClick: confirm,
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedSponsor(emptySponsor);
            formikSponsor.resetForm();
            setCaptureDialog(true);
        },
    };

    useEffect(() => {
        let results;
        gestorfutbolService.getAllCampaigns().then((data) => {
            results = data.data;
            console.log(data.data.results);
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
            campanyaActiva: activeCampaign
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

        console.log(index, newData);
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
        onSort: (e) => setlazyState(e),
        sortOrder: lazyState.sortOrder,
        sortField: lazyState.sortField,
        editMode: 'row',
        onRowEditComplete: onRowEditComplete,
        rowEditor: true,
        stripedRows: true
    };

    const saveSponsor = (data) => {
        gestorfutbolService.saveSponsor(data).then(() => {
                setCaptureDialog(false);
                loadLazyData();
            }
        );
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
        className: "p-2 rounded-2"
    };

    const formikSponsor = useFormik({
        initialValues: {
            cif: selectedSponsor.cif,
            nom: selectedSponsor.nom,
            donacio: selectedSponsor.donacio,
            dataDonacio: selectedSponsor.dataDonacio,
            observacio: selectedSponsor.observacio,
            estatPagament: selectedSponsor.estatPagament,
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
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
                {/*           <BasicButton props={editButton}></BasicButton>*/}
                <BasicButton props={deleteButton}></BasicButton>
            </div>
            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog
                visible={captureDialog}
                header={t("t.new.sponsor").toUpperCase()}
                onHide={hideDialog}
            >
                <form onSubmit={formikSponsor.handleSubmit}>
                    <SponsorContext.Provider
                        value={{selectedSponsor, setSelectedSponsor, formikSponsor}}
                    >
                        <SponsorDataForm/>
                    </SponsorContext.Provider>
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