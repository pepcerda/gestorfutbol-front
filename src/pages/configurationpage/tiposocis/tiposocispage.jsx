import "./tiposocispage.css";
import {useTranslation} from "react-i18next";
import React, {createContext, useContext, useEffect, useState} from "react";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {useFormik} from "formik";
import PageTitle from "../../../components/pagetitle/pagetitle";
import BasicButton from "../../../components/basicbutton/basicbutton";
import TableComponent from "../../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";
import FormInputText from "../../../components/forminputtext/forminputtext";
import TabMenuComponent from "../../../components/tabmenucomponent/tabmenucomponent";
import {ConfigContext} from "../../../App";
import {gestorfutbolService} from "../../../services/real/gestorfutbolService";
import FormInputNumber from "../../../components/forminputnumber/forminputnumber";

const TipoSociContext = createContext();

const TipoSociDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {selectedTipoSoci, setSelectedTipoSoci, formikTipoSoci} =
        useContext(TipoSociContext);

    const [selectCheck, setSelectedCheck] = useState(null);

    const isFormFieldInvalid = (name) =>
        !!(formikTipoSoci.touched[name] && formikTipoSoci.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikTipoSoci.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const nomProps = {
        id: "nom",
        label: `${t("t.name")}`,
        value: formikTipoSoci.values.nom,
        onChange: (e) => {
            formikTipoSoci.setFieldValue("nom", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
    };

    const cuotaProps = {
        id: "cuota",
        label: `${t('t.cuota')}`,
        value: formikTipoSoci.values.cuota,
        mode: "currency",
        currency: "EUR",
        onValueChange: (e) => {
            formikTipoSoci.setFieldValue('cuota', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('cuota') ? 'invalid-inputnumber' : ''}`,
        labelClassName: `${isFormFieldInvalid('cuota') ? 'form-text-invalid' : ''}`
    };

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={nomProps}></FormInputText>
                    {getFormErrorMessage("nom")}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputNumber props={cuotaProps}></FormInputNumber>
                    {getFormErrorMessage('cuota')}
                </div>
            </div>
        </>
    );
};

const TipoSocisPage = ({props}) => {

    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const [tipoSocis, setTipoSocis] = useState([]);
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [campaigns, setCampaigns] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);
    let emptyTipoSoci = {
        id: null,
        nom: "",
        cuota: 0,
    };
    const [selectedTipoSoci, setSelectedTipoSoci] = useState(emptyTipoSoci);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortOrder: null,
        sortField: null
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
            setSelectedTipoSoci(emptyTipoSoci);
        }
    }


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

    const tableColumns = [
        {field: "id", header: `${t("t.id")}`},
        {field: "nom", header: `${t("t.name")}`, editor: (options) => textEditor(options)},
        {field: "cuota", header: `${t("t.surname1")}`, editor: (options) => textEditor(options)},
        {rowEditor: true}
    ];

    const accept = () => {
        gestorfutbolService.deleteTipoSoci(selectedTipoSoci.id);
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
        disabled: selectedTipoSoci.id === null,
        onClick: confirm,
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedTipoSoci(emptyTipoSoci);
            formikTipoSoci.resetForm();
            setCaptureDialog(true);
        },
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
            if(campaign) {
                let index = campaigns.findIndex(c => c.id === campaign.id);
                setActiveCampaign(campaign.id);
                setActiveIndex(index);
            } else {
                setActiveCampaign(campaigns[0].id);
            }
        }

    }, [campaigns])


    useEffect(() => {
        console.log("Entro")
        loadLazyData();
        setDeleteFlag(false);
    }, [lazyState, deleteFlag, activeCampaign]);

    const loadLazyData = () => {
        let apiFilter = {
            pageNum: lazyState.page,
            pageSize: lazyState.rows,
            campanyaActiva: activeCampaign
        };

        gestorfutbolService.getTipoSoci(apiFilter).then((data) => {
            console.log(apiFilter.campanyaActiva)
            setTotalRecords(data.data.total);
            let results = data.data.result;
            setTipoSocis(results);
        });
    };

    const onRowEditComplete = (e) => {
        let {newData, index} = e;
        gestorfutbolService.saveTipoSoci(newData)
            .then(() => loadLazyData())
    };

    const tableProps = {
        data: tipoSocis,
        selectedData: selectedTipoSoci,
        selectionMode: "single",
        paginator: true,
        paginatorPosition: `${viewWidth < process.env.REACT_APP_XL_VW ? "top" : "bottom"}`,
        onChangeSelectedDataEvent: (e) => {
            if (e.value != null) {
                setSelectedTipoSoci(e.value);
            }
        },
        onRowUnselect: () => {
            setSelectedTipoSoci(emptyTipoSoci);
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
        editMode: 'row',
        onRowEditComplete: onRowEditComplete,
        rowEditor: true,
        stripedRows: true
    };

    const saveTipoSoci = (data) => {
        gestorfutbolService.saveTipoSoci(data)
            .then(() => {
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

    const formikTipoSoci = useFormik({
        initialValues: {
            nom: selectedTipoSoci.nom,
            cuota: selectedTipoSoci.cuota,
            campanya: activeCampaign
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (!data.nom) {
                errors.nom = t("t.empty.field");
            };
            if (!data.cuota) {
                errors.cuota = t("t.empty.field");
            };
            return errors;
        },
        onSubmit: (data) => {
            saveTipoSoci(data);
        },
    });

    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
                <BasicButton props={deleteButton}></BasicButton>
            </div>
            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog
                visible={captureDialog}
                header={t("t.new.member").toUpperCase()}
                onHide={hideDialog}
            >
                <form onSubmit={formikTipoSoci.handleSubmit}>
                    <TipoSociContext.Provider
                        value={{selectedTipoSoci, setSelectedTipoSoci, formikTipoSoci}}
                    >
                        <TipoSociDataForm/>
                    </TipoSociContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default TipoSocisPage;
