import './caixafixapage.css';
import {useContext, useEffect, useState} from "@types/react";
import {ConfigContext} from "../../App";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {useTranslation} from "react-i18next";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import FormInputText from "../../components/forminputtext/forminputtext";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {useFormik} from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";



/*const CaixaFixaPage = ({props})=> {

    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const opcionsPagament = gestorfutbolService.getOpcionsPagament();
    const [factures, setFactures] = useState([]);
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [campaigns, setCampaigns] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);
    let emptyFactura = {
        id: null,
        nom: "",
        llinatge1: "",
        llinatge2: "",
        despesa: 0,
        observacio: "",
        factura: "",
        estat: null,
        campanya: activeCampaign
    };
    const [selectedFactura, setSelectedFactura] = useState(emptyFactura);
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
            setSelectedFactura(emptyFactura);
        }
    }

    const estatPagamentBodyTemplate = (factura) => {
        let estat = opcionsPagament.find(o => {
            return o.valor === factura.estat;
        });

        if(estat != null) {
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
            !options.rowData.patrocinador ? <SelectOneMenu props={optionsProps}/> : <></>

        );
    };

    const tableColumns = [
        {field: "id", header: `${t("t.id")}`},
        {field: "nom", header: `${t("t.name")}`, editor: (options) => textEditor(options)},
        {field: "llinatge1", header: `${t("t.surname1")}`, editor: (options) => textEditor(options)},
        {field: "llinatge2", header: `${t("t.surname2")}`, editor: (options) => textEditor(options)},
        {field: "despesa", header: `${t("t.despesa")}`, editor: (options) => numberEditor(options)},
        {field: "observacio", header: `${t("t.observacions")}`},
        {
            field: "estat",
            header: `${t("t.payment.state")}`,
            body: estatPagamentBodyTemplate,
            editor: (options) => opcionsEditor(options)
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
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedMember(emptyMember);
            formikMember.resetForm();
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
                setActiveCampaign(campaign.id);
            } else {
                setActiveCampaign(campaigns[0].id);
            }
        }

    }, [campaigns])


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
        if(newData.patrocinador) {
            newData.estatPagament = null;
        }
        gestorfutbolService.saveMember(newData)
            .then(() => loadLazyData())
    };

    const tableProps = {
        data: members,
        selectedData: selectedMember,
        selectionMode: "single",
        paginator: true,
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
    };

    const formikMember = useFormik({
        initialValues: {
            nom: selectedMember.nom,
            llinatge1: selectedMember.llinatge1,
            llinatge2: selectedMember.llinatge2,
            patrocinador: selectedMember.patrocinador,
            estatPagament: selectedMember.estatPagament,
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
            if (!data.patrocinador) {
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
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
                {/!*           <BasicButton props={editButton}></BasicButton>*!/}
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
                <form onSubmit={formikMember.handleSubmit}>
                    <MemberContext.Provider
                        value={{selectedMember, setSelectedMember, formikMember}}
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
}*/

const CaixaFixaPage = ({props}) => {
    return (
        <div>CAixaFixaPage</div>
    )
}

export default CaixaFixaPage;