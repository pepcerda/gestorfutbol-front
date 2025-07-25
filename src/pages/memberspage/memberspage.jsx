import "./memberspage.css";
import {useTranslation} from "react-i18next";
import React, {createContext, useContext, useEffect, useReducer, useState} from "react";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {useFormik} from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import FormInputText from "../../components/forminputtext/forminputtext";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import {ConfigContext} from "../../App";
import * as xlsx from 'xlsx';
import * as module from 'file-saver';


const MemberContext = createContext();

const MemberDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {selectedMember, setSelectedMember, formikMember, activeCampaign} =
        useContext(MemberContext);

    const [selectCheck, setSelectedCheck] = useState(null);
    const [tipoSocis, setTipoSocis] = useState(null);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();

    useEffect(() => {
        gestorfutbolService.getAllTipoSocis(activeCampaign).then((data) => {
            let results = data.data;
            setTipoSocis(results);
        })
    }, [])

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
            formikMember.setFieldValue("tipoSoci", tipoSocis[e.value - 1]);
        },
        options: tipoSocis,
        optionLabel: "nom",
        optionValue: "id",
        classNameError: `${
            isFormFieldInvalid("tipoSoci") ? "invalid-select" : ""
        }`,
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
                    {getFormErrorMessage("estatPagament")}
                </div>
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3">
                    <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
                    {getFormErrorMessage("estatPagament")}
                </div>
            </div>
        </>
    );
};

const MembersPage = ({props}) => {

    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();
    const [tipoSocis, setTipoSocis] = useState(null);
    const [members, setMembers] = useState([]);
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [campaigns, setCampaigns] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    let emptyMember = {
        id: null,
        nom: "",
        llinatge1: "",
        llinatge2: "",
        estatPagament: null,
        tipoSoci: {
            id: null,
            campanya: activeCampaign,
            nom: "",
            cuota: 0
        },
        campanya: activeCampaign
    };
    const [selectedMember, setSelectedMember] = useState(emptyMember);
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
            setSelectedMember(emptyMember);
        }
    }

    const estatPagamentBodyTemplate = (member) => {
        let estat = opcionsPagament.find(o => {
            return o.valor === member.estatPagament;
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

    const allowEdit = (rowData) => {
        return true;
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

    const checkEditor = (options) => {
        const checkProps = {
            value: options.value,
            checked: options.value,
            onChange: (e) => options.editorCallback(e.checked)
        }
        return (
            <FormCheckbox props={checkProps}/>
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
             <SelectOneMenu props={optionsProps}/>
        );
    };

    const tipoSocisEditor = (options) => {


        const handleChange = (e) => {
            options.rowData.tipoSoci = tipoSocis[e.value - 1];
            forceUpdate();
        };


        const optionsProps = {
            id: "tipoSoci_editor",
            value: options.rowData.tipoSoci.id,
            onChange: handleChange,
            options: tipoSocis,
            optionLabel: "nom",
            optionValue: "id",
            className: "selectonemenu-large"
        };
        return (
            <SelectOneMenu props={optionsProps}/>
        );
    };


    const tableColumns = [
        {field: "id", header: `${t("t.id")}`},
        {field: "nom", header: `${t("t.name")}`, editor: (options) => textEditor(options)},
        {field: "llinatge1", header: `${t("t.surname1")}`, editor: (options) => textEditor(options)},
        {field: "llinatge2", header: `${t("t.surname2")}`, editor: (options) => textEditor(options)},
        {
            field: "estatPagament",
            header: `${t("t.payment.state")}`,
            body: estatPagamentBodyTemplate,
            editor: (options) => opcionsEditor(options)
        },
        {
            field: "tipoSoci.nom",
            header: `${t("t.tipo.soci")}`,
            editor: (options) => tipoSocisEditor(options)
        },
        {rowEditor: true}
    ];

    const accept = () => {
        gestorfutbolService.deleteMember(selectedMember.id);
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
        disabled: selectedMember.id === null,
        onClick: confirm,
        tooltip: `${t('t.elimina')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedMember(emptyMember);
            formikMember.resetForm();
            setCaptureDialog(true);
        },
        tooltip: `${t('t.nou')}`,
        tooltipOptions: {
            position: "bottom"
        }
    };

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

        gestorfutbolService.getAllMembers(activeCampaign)
            .then(data => {
                const worksheet = xlsx.utils.json_to_sheet(data.data);
                const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
                const excelBuffer = xlsx.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array'
                });

                saveAsExcelFile(excelBuffer, 'socis');
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
        });
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

    }, [campaigns]);

    useEffect(() => {
        if(activeCampaign) {
            gestorfutbolService.getAllTipoSocis(activeCampaign).then((data) => {
                let results = data.data;
                setTipoSocis(results);
            })
        }
    }, [activeCampaign]);

    useEffect(() => {
        loadLazyData();
        setDeleteFlag(false);
    }, [lazyState, deleteFlag, activeCampaign]);

    const loadLazyData = () => {
        let apiFilter = {
            pageNum: lazyState.page,
            pageSize: lazyState.rows,
            campanyaActiva: activeCampaign
        };

        gestorfutbolService.getMembers(apiFilter).then((data) => {
            setTotalRecords(data.data.total);
            let results = data.data.result;
            setMembers(results);
        });
    };

    const onRowEditComplete = (e) => {
        let {newData, index} = e;
        gestorfutbolService.saveMember(newData)
            .then(() => loadLazyData())
    };

    const tableProps = {
        data: members,
        selectedData: selectedMember,
        selectionMode: "single",
        paginator: true,
        onChangeSelectedDataEvent: (e) => {
            console.log(e)
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

    const saveMember = (data) => {
        console.log(data);
        gestorfutbolService.saveMember(data)
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

    const formikMember = useFormik({
        initialValues: {
            nom: selectedMember.nom,
            llinatge1: selectedMember.llinatge1,
            llinatge2: selectedMember.llinatge2,
            estatPagament: selectedMember.estatPagament,
            tipoSoci: selectedMember.tipoSoci,
            campanya: activeCampaign
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (!data.nom) {
                errors.nom = t("t.empty.field");
            }
            if (!data.llinatge1) {
                errors.llinatge1 = t("t.empty.field");
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

    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <PageTitle props={{title: `${t("t.members")}`}}></PageTitle>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            <div className="row justify-content-between align-items-start flex-wrap">
                <div className="col-12 col-xl-auto mb-3 mb-xl-0 d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
                    <BasicButton props={exportButton}/>
                </div>

                <div
                    className="col-12 col-xl-auto d-flex flex-wrap gap-2 justify-content-center justify-content-xl-end">
                    <BasicButton props={newButton}/>
                    <BasicButton props={deleteButton}/>
                </div>
            </div>
            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog
                visible={captureDialog}
                header={t("t.new.member").toUpperCase()}
                onHide={hideDialog}
            >
                <form onSubmit={formikMember.handleSubmit}>
                    <MemberContext.Provider
                        value={{selectedMember, setSelectedMember, formikMember, activeCampaign}}
                    >
                        <MemberDataForm/>
                    </MemberContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default MembersPage;
