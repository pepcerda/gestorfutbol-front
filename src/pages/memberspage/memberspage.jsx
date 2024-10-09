import './memberspage.css';
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import {gestorfutbolService} from "../../services/mock/gestorfutbolService";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {useFormik} from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";

const MembersPage = ({props})=> {

    let emptyMember = {
        nom: "",
        llinatge1: "",
        llinatge2: "",
        patrocinador: false,
        estat_pagament: "D"
    }

    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(emptyMember);
    const {t, i18n} = useTranslation("common");
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortOrder: null,
        sortField: null
    });

    const patrocinadorBodyTemplate = (member) => {

        const checkBoxTaula = {
            checked: member.patrocinador,
            disabled: true
        }

        return <FormCheckbox props={checkBoxTaula}></FormCheckbox>
    }

    const tableColumns = [
        {field: "id", header: `${t('t.id')}`},
        {field: "nom", header: `${t('t.nom')}`},
        {field: "llinatge1", header: `${t('t.llinatge1')}`},
        {field: "llinatge2", header: `${t('t.llinatge2')}`},
        {field: "patrocinador", header: `${t('t.patrocinador')}`, body: patrocinadorBodyTemplate},
        {field: "estat_pagament", header: `${t('t.estat.pagament')}`}
    ];

    const accept = () => {
        gestorfutbolService.deleteCampaign(selectedCampaign.id);
        setDeleteFlag(true);
    };

    const reject = () => {
        setDeleteFlag(false);
    };

    const confirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: `${t('t.confirm.delete')}`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const deleteButton = {
        icon: "pi pi-trash",
        className: "circular-btn",
        disabled: selectedMember === null,
        onClick: confirm
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedMember(emptyMember);
            setCaptureDialog(true);
        }
    };

    useEffect(() => {
        loadLazyData();
        setDeleteFlag(false);
    }, [lazyState, deleteFlag]);

    const loadLazyData = () => {
        var apiFilter = {
            pageNum: lazyState.page,
            pageSize: lazyState.rows,
        }
        gestorfutbolService.getMembers(apiFilter).then((data) => {
            setTotalRecords(data.data.total)
            let results = data.data.results;
            setMembers(results);
        });
    };

    const tableProps = {
        data: members,
        selectedData: selectedMember,
        onChangeSelectedDataEvent: (e) => {
            if(e.value != null) {
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
        sortField: lazyState.sortField
    };


    const saveMember = () => {
        gestorfutbolService.newMember(selectedMember);
        setCaptureDialog(false);
    };

    const hideDialog = () => {
        setCaptureDialog(false);
    };

    const cancelFormButton = {
        icon: "pi pi-times",
        className: "basicbutton-outlined me-2",
        label: `${t('t.cancel')}`,
        onClick: hideDialog
    };

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t('t.save')}`,
        type: "submit"
    }

    const formikCampaign = useFormik({
        initialValues: {
            nom: selectedMember.nom,
            llinatge1: selectedMember.llinatge1,
            llinatge2: selectedMember.llinatge2,
            patrocinador: selectedMember.patrocinador,
            estat_pagament: selectedMember.estat_pagament
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (!data.titol) {
                errors.nom = t('t.empty.field');
            }
            if (!data.any) {
                errors.llinatge1 = t('t.empty.field');
            }
            if (!data.actual) {
                errors.estat_pagament = t('t.empty.field');
            }
            return errors;
        },
        onSubmit: (data) => {
            saveMember();
        }
    });

    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <PageTitle props={{title: `${t('t.members')}`}}></PageTitle>
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
                {/*           <BasicButton props={editButton}></BasicButton>*/}
                <BasicButton props={deleteButton}></BasicButton>

            </div>
            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog visible={captureDialog}
                    header={t('t.new.member').toUpperCase()}
                    onHide={hideDialog}>
                <form onSubmit={formikCampaign.handleSubmit}>
                    <CampaignContext.Provider value={{selectedCampaign, setSelectedCampaign, formikCampaign}}>
                        <CampaignDataForm/>
                    </CampaignContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

        </div>);return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <PageTitle props={{title: `${t('t.campaigns.title')}`}}></PageTitle>
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
                {/*           <BasicButton props={editButton}></BasicButton>*/}
                <BasicButton props={deleteButton}></BasicButton>

            </div>
            <div className="row mt-3">
                <TableComponent props={tableProps}></TableComponent>
            </div>
            <Dialog visible={captureDialog}
                    header={t('t.new.campaign').toUpperCase()}
                    onHide={hideDialog}>
                <form onSubmit={formikCampaign.handleSubmit}>
                    <CampaignContext.Provider value={{selectedCampaign, setSelectedCampaign, formikCampaign}}>
                        <CampaignDataForm/>
                    </CampaignContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

        </div>);
}


export default MembersPage;