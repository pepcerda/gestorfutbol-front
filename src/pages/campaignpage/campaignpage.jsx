import './campaignpage.css';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {createContext, useEffect, useState, useContext, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {useFormik} from "formik";
import FormCalendar from "../../components/formcalendar/formcalendar";
import FormInputText from "../../components/forminputtext/forminputtext";
import {Dialog} from "primereact/dialog";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";

const CampaignContext = createContext();

const calculateCampaignYears = (year) => {
    if(year === undefined) {
        let now = new Date();
        return `${now.getFullYear()} - ${(now.getFullYear() + 1)}`
    } else {
        return `${year.getFullYear()} - ${year.getFullYear()+1}`
    }
}

const filterData = (data) => {
    data.any = data.any.getFullYear();
    return data;
}

const CampaignDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {selectedCampaign, setSelectedCampaign, formikCampaign} = useContext(CampaignContext);

    const isFormFieldInvalid = (name) => !!(formikCampaign.touched[name] && formikCampaign.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="form-text-invalid">{formikCampaign.errors[name]}</small> :
            <small className="form-text-invalid">&nbsp;</small>;
    }


    const titleProps = {
        id: "titol",
        label: `${t('t.title')}`,
        value: formikCampaign.values.titol,
        disabled: true,
        onChange: (e) => {
            formikCampaign.setFieldValue('titol', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('titol') ? 'invalid-inputtext' : ''}`,
        labelClassName: `${isFormFieldInvalid('titol') ? 'form-text-invalid' : ''}`
    };

    const calendar = {
        id: "any",
        label: `${t('t.year')}`,
        value: new Date(formikCampaign.values.any),
        view: "year",
        dateFormat: "yy",
        onChange: (e) => {
            formikCampaign.setFieldValue('any', e.target.value);
            formikCampaign.setFieldValue('titol', `${t('t.temporada.nova')} ${calculateCampaignYears(e.target.value)}`)
        },
        classNameError: `${isFormFieldInvalid('any')? 'formcalendar-invalid' : ''}`,
        labelClassName: `${isFormFieldInvalid('any') ? 'form-text-invalid' : ''}`
    };


    return (
        <>
            <div className="row">
                <div className="col-12 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={titleProps}></FormInputText>
                    {getFormErrorMessage('titol')}
                </div>
                <div className="col-12 col-md-5 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormCalendar props={calendar}/>
                    <br/>
                    {getFormErrorMessage('any')}
                </div>
            </div>

        </>

    )


}


const CampaignPage = ({props}) => {

    const {t, i18n} = useTranslation("common");

    let emptyCampaign = {
        titol: `${t('t.temporada.nova')} ${calculateCampaignYears()}`,
        any: new Date()
    }

    const {user} = useKindeAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(emptyCampaign);
    const navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState(0);
    const [captureDialog, setCaptureDialog] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const confirmRef = useRef();
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortOrder: null,
        sortField: null
    });

    const tableColumns = [
        {field: "id", header: `${t('t.id')}`},
        {field: "titol", header: `${t('t.title')}`}
    ];


    const accept = () => {
        gestorfutbolService.deleteCampaign(selectedCampaign.id)
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
            message: `${t('t.confirm.delete')}`,
            acceptClassName: "rounded-border-btn basicbutton",
            rejectClassName: "confirm-popup-reject",
            acceptLabel: "Sí",
            rejectLabel: "No",
            accept,
            reject
        });
    };

    const deleteButton = {
        icon: "pi pi-trash",
        className: "circular-btn",
        disabled: selectedCampaign.id === undefined,
        onClick: confirm
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedCampaign(emptyCampaign);
            formikCampaign.resetForm();
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
        gestorfutbolService.getCampaigns(apiFilter).then((data) => {
                setTotalRecords(data.data.total)
            let results = data.data.result;
            setCampaigns(results);
        });
    };


    const tableProps = {
        data: campaigns,
        selectedData: selectedCampaign,
        selectionMode: "single",
        onChangeSelectedDataEvent: (e) => {
            if (e.value != null) {
                setSelectedCampaign(e.value);
            }
        },
        onRowUnselect: () => {
            setSelectedCampaign(emptyCampaign);
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
        stripedRows: true,
        paginator: true
    };


    const saveCampaign = (data) => {
        gestorfutbolService.newCampaign(data)
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
        label: `${t('t.cancel')}`,
        type: 'button',
        onClick: hideDialog
    };

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t('t.save')}`,
        type: "submit",
        className: "p-2 rounded-2"
    }

    const formikCampaign = useFormik({
        initialValues: {
            titol: selectedCampaign.titol,
            any: selectedCampaign.any
        },
        enableReinitialize: true,
        validate: (data) => {
            let errors = {};
            if (!data.titol) {
                errors.titol = t('t.empty.field');
            }
            if (!data.any) {
                errors.any = t('t.empty.field');
            }
            if(campaigns !== null) {
                if(campaigns.find((c) => {
                    let any = new Date(c.any).getFullYear();
                    return any === data.any.getFullYear();
                }) != undefined) {
                    errors.any = t('t.duplicate.year');
                }
            }

            return errors;
        },
        onSubmit: (data) => {
                saveCampaign(data);
        }
    });


    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <ConfirmDialog/>
            <PageTitle props={{title: `${t('t.campaigns.title')}`}}></PageTitle>
            <div className="row gap-3 justify-content-center justify-content-xl-end">
                <BasicButton props={newButton}></BasicButton>
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
                    <div ref={confirmRef} className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

        </div>);
}


export default CampaignPage;