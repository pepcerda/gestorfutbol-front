import './campaignpage.css';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {createContext, useEffect, useState, useContext} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {gestorfutbolService} from "../../services/mock/gestorfutbolService";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Checkbox} from "primereact/checkbox";
import {useFormik} from "formik";
import FormCalendar from "../../components/formcalendar/formcalendar";
import FormInputText from "../../components/forminputtext/forminputtext";
import {Dialog} from "primereact/dialog";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import FormInputNumber from "../../components/forminputnumber/forminputnumber";

const CampaignContext = createContext();

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
        dateFormat : "yy",
        onChange: (e) => {
            formikCampaign.setFieldValue('any', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('any') ? 'formcalendar-invalid' : ''}`,
        labelClassName: `${isFormFieldInvalid('any') ? 'form-text-invalid' : ''}`
    };

    const importProps = {
        id: "import",
        label: `${t('t.import')}`,
        value: formikCampaign.values.import,
        mode: "currency",
        currency: "EUR",
        onValueChange: (e) => {
            formikCampaign.setFieldValue('import', e.target.value);
        },
        classNameError: `${isFormFieldInvalid('import') ? 'invalid-inputnumber' : ''}`,
        labelClassName: `${isFormFieldInvalid('import') ? 'form-text-invalid' : ''}`
    }

    const actualProps = {
        id: "actual",
        label: `${t('t.actual')}`,
        value: formikCampaign.values.actual,
        checked: formikCampaign.values.actual,
        onChange: (e) => {
            formikCampaign.setFieldValue('actual', e.checked);
        },
        classNameError: `${isFormFieldInvalid('actual') ? 'invalid-inputtext' : ''}`,
        labelClassName: `${isFormFieldInvalid('actual') ? 'form-text-invalid' : ''}`    }

    return (
        <>
            <div className="row">
                <div className="col-12 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputText props={titleProps}></FormInputText>
                    {getFormErrorMessage('species')}
                </div>
                <div className="col-12 col-md-5 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormCalendar props={calendar}/>
                    <br/>
                    {getFormErrorMessage('date')}
                </div>
                <div className="col-12 col-md-4 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormInputNumber props={importProps}></FormInputNumber>
                    {getFormErrorMessage('depth')}
                </div>
                <div className="col-12 col-md-2 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormCheckbox props={actualProps}></FormCheckbox>
                </div>
            </div>
            <div className="row">

            </div>

        </>

    )


}


const CampaignPage = ({props})=> {

    let emptyCampaign = {
        titol: "",
        any: new Date(),
        import: 0,
        actual: true
    }


    const {user} = useKindeAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(emptyCampaign);
    const {t, i18n} = useTranslation("common");
    const navigate = useNavigate();
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

    const actualBodyTemplate = (campaign) => {
        return <Checkbox checked={campaign.actual} disabled></Checkbox>
    }

    const tableColumns = [
        {field: "id", header: `${t('t.id')}`},
        {field: "titol", header: `${t('t.title')}`},
        {field: "any", header: `${t('t.year')}`},
        {field: "import", header: `${t('t.amount')}`},
        {field: "actual", header: `${t('t.actual')}`, body: actualBodyTemplate},
        {field: "socis", header: `${t('t.members')}`}
    ];


    const accept = () => {
        gestorfutbolService.deleteCampaign(selectedCampaign.id);
        setDeleteFlag(true);
    };

    const reject = () => {

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
        disabled: selectedCampaign === null,
        onClick: confirm
    };

    const newButton = {
        icon: "pi pi-plus",
        className: "circular-btn",
        onClick: () => {
            setSelectedCampaign(emptyCampaign);
            setCaptureDialog(true);
        }
    };

/*    const editButton = {
        icon: "pi pi-pencil",
        className: "circular-btn",
        disabled: selectedCampaign === null,
        onClick: () => {
            navigate(`/trip/${selectedProduct.id}`)
        }
    }*/

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
            let results = data.data.results;
            setCampaigns(results);
        });
    };


    const tableProps = {
        data: campaigns,
        selectedData: selectedCampaign,
        onChangeSelectedDataEvent: (e) => {
            if(e.value != null) {
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
        sortField: lazyState.sortField
    };


    const saveCampaign = () => {
        gestorfutbolService.newCampaign(selectedCampaign);
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
            titol: selectedCampaign.titol,
            any: selectedCampaign.any,
            import: selectedCampaign.import,
            actual: selectedCampaign.actual
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
            if (!data.import) {
                errors.import = t('t.empty.field');
            }
            if (!data.actual) {
                errors.actual = t('t.empty.field');
            }
            return errors;
        },
        onSubmit: (data) => {
            saveCampaign();
        }
    });



    return (
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


export default CampaignPage;