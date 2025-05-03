import './directivapage.css';
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {ViewWidthContext} from "../../App";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {useTranslation} from "react-i18next";
import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import {Dialog} from "primereact/dialog";
import {useFormik} from "formik";
import FormInputText from "../../components/forminputtext/forminputtext";
import FormCalendar from "../../components/formcalendar/formcalendar";
import {Calendar} from "primereact/calendar";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {useMountEffect} from "primereact/hooks";
import {Messages} from "primereact/messages";
import {create} from "axios";
import TabMenuComponent from "../../components/tabmenucomponent/tabmenucomponent";

const DirectivaContext = createContext();
const BaixaContext = createContext();

const HistoricDirectiva = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const [directivas, setDirectivas] = useState(null);
    const [tabMenuItems, setTabMenuItems] = useState();
    const [activeIndex, setActiveIndex] = useState(0)
    const [directius, setDirectius] = useState();
    const {rolsDirectiu} = useContext(DirectivaContext);


    useEffect(() => {
        gestorfutbolService.listHistoricDirectiva()
            .then((data) => {
                data.data.forEach(dir => {
                    dir.directius.forEach(d => {
                        let rol = rolsDirectiu.find(r => r.id === d.rol);
                        d.rol = rol.rol;
                    })
                })
                setDirectivas(data.data);
            })
    }, [])

    useEffect(() => {
        if (directivas) {
            setTabMenuItems(directivas.map(d => {
                let tab = "Directiva: ";
                let data = new Date(d.dataAlta);
                return {label: tab += data.toLocaleDateString('es-ES')};
            }));
            setDirectius(directivas[activeIndex].directius);
        }
    }, [directivas])

    const tabMenu = {
        model: tabMenuItems,
        activeIndex: activeIndex,
        onTabChange: (e) => {
            setActiveIndex(e.index);
            setDirectius(directivas[e.index].directius);
        }
    }

    const tableColumns = [
        {
            field: 'rol',
            header: `${t("t.role")}`
        },
        {
            field: 'nom',
            header: `${t("t.name")}`
        },
        {
            field: 'llinatge1',
            header: `${t("t.surname1")}`
        },
        {
            field: 'llinatge2',
            header: `${t("t.surname2")}`
        },
        {
            field: 'nif',
            header: `${t("t.nif")}`
        },
    ]

    const tableProps = {
        data: directius,
        columns: tableColumns,
        breakpoint: "900px",
        stripedRows: true
    };


    return (
        <>
            <TabMenuComponent props={tabMenu}></TabMenuComponent>
            <DataTable value={directius} breakpoint="900px" stripedRows={true} className="table-component">
                {tableColumns.map(({field, header}) => {
                    return <Column key={field} field={field} header={header}></Column>
                })}
            </DataTable>
        </>
    )

}

const BaixaDirectivaForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {formikBaixa} = useContext(BaixaContext);

    const isFormFieldInvalid = (name) =>
        !!(formikBaixa.touched[name] && formikBaixa.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikBaixa.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const dataBaixaProps = {
        id: "dataBaixa",
        label: `${t('t.termination.date')}`,
        value: formikBaixa.values.dataBaixa,
        view: "date",
        dateFormat: "dd/mm/yy",
        onChange: (e) => {
            formikBaixa.setFieldValue(`dataBaixa`, e.target.value);
        },
        classNameError: `${isFormFieldInvalid('dataBaixa') ? 'formcalendar-invalid' : ''}`,
        labelClassName: `${isFormFieldInvalid('dataBaixa') ? 'form-text-invalid' : ''}`
    };

    return (
        <>
            <p>{t('t.select.termination.date')}</p>
            <div className="row">
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormCalendar props={dataBaixaProps}/>
                    <br/>
                    {getFormErrorMessage('dataBaixa')}
                    {getFormErrorMessage('dataAnterior')}
                </div>
            </div>
        </>
    );


}

const DirectiuDataForm = ({props}) => {
    const {t, i18n} = useTranslation("common");
    const {formikDirectiva, rolsDirectiu} = useContext(DirectivaContext);
    const [data, setData] = useState(formikDirectiva.values.directiva.directius);


    const getNestedObject = (nestedObj, pathArr) => {
        return pathArr.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, nestedObj);
    };


    const isFormFieldInvalid = (name) => {
        const path = name.split('.');
        const touched = getNestedObject(formikDirectiva.touched, path);
        const error = getNestedObject(formikDirectiva.errors, path);
        return !!(touched && error);
    };


    const getFormErrorMessage = (name) => {
        const path = name.split('.');
        const error = getNestedObject(formikDirectiva.errors, path);

        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{error}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const dataAltaProps = {
        id: "dataAlta",
        label: `${t('t.start.date')}`,
        value: formikDirectiva.values.directiva.dataAlta,
        view: "date",
        dateFormat: "dd/mm/yy",
        onChange: (e) => {
            formikDirectiva.setFieldValue(`directiva.dataAlta`, e.target.value);
        },

    };

    let rolsProps = data.map((directiu, index) => {
        return {
            id: `rol-${index}`,
            /*label: `${t('t.role')}`,*/
            value: directiu.rol.rol,
            className: "directiva-form-inputs",
            disabled: true
        }
    })

    let nomProps = data.map((directiu, index) => {
        return {
            id: `nom-${index}`,
            /*label: `${t("t.name")}`,*/
            value: formikDirectiva.values.directiva.directius[index].nom,
            className: "directiva-form-inputs",
            onChange: (e) => {
                formikDirectiva.setFieldValue(`directiva.directius.${index}.nom`, e.target.value);
            },
            classNameError: `${
                isFormFieldInvalid(`directiva.directius.${index}.nom`) ? "invalid-inputtext" : ""
            }`,
            labelClassName: `${
                isFormFieldInvalid(`directiva.directius.${index}.nom`) ? "form-text-invalid" : ""
            }`
        }
    });

    let llinatge1Props = data.map((directiu, index) => {
        return {
            id: `llinatge1-${index}`,
            /*label: `${t("t.surname1")}`,*/
            value: formikDirectiva.values.directiva.directius[index].llinatge1,
            className: "directiva-form-inputs",
            onChange: (e) => {
                formikDirectiva.setFieldValue(`directiva.directius.${index}.llinatge1`, e.target.value);
            },
            classNameError: `${
                isFormFieldInvalid(`directiva.directius.${index}.llinatge1`) ? "invalid-inputtext" : ""
            }`,
            labelClassName: `${
                isFormFieldInvalid(`directiva.directius.${index}.llinatge1`) ? "form-text-invalid" : ""
            }`
        }
    });

    let llinatge2Props = data.map((directiu, index) => {
        return {
            id: `llinatge2-${index}`,
            /*label: `${t("t.surname2")}`,*/
            className: "directiva-form-inputs",
            value: formikDirectiva.values.directiva.directius[index].llinatge2,
            onChange: (e) => {
                formikDirectiva.setFieldValue(`directiva.directius.${index}.llinatge2`, e.target.value);
            }
        }
    });

    let nifProps = data.map((directiu, index) => {
        return {
            id: `nif-${index}`,
            /*label: `${t("t.nif")}`,*/
            value: formikDirectiva.values.directiva.directius[index].nif,
            className: "directiva-form-inputs",
            onChange: (e) => {
                formikDirectiva.setFieldValue(`directiva.directius.${index}.nif`, e.target.value);
            },
            classNameError: `${
                isFormFieldInvalid(`directiva.directius.${index}.nif`) ? "invalid-inputtext" : ""
            }`,
            labelClassName: `${
                isFormFieldInvalid(`directiva.directius.${index}.nif`) ? "form-text-invalid" : ""
            }`
        }
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

    const onCellEditComplete = (e) => {
        let {rowData, newValue, field, rowIndex, originalEvent: event} = e;
        formikDirectiva.setFieldValue(`directiva.directius.${rowIndex}.${field}`, newValue);


    }

    const tableColumns = [
        {field: 'rol.rol', header: `${t("t.role")}`, style: {width: '20%'}},
        {
            field: 'nom',
            header: `${t("t.name")}`,
            editor: (options) => textEditor(options),
            onCellEditComplete: onCellEditComplete,
            style: {width: '20%'}
        },
        {
            field: 'llinatge1',
            header: `${t("t.surname1")}`,
            editor: (options) => textEditor(options),
            onCellEditComplete: onCellEditComplete,
            style: {width: '20%'}
        },
        {
            field: 'llinatge2',
            header: `${t("t.surname2")}`,
            editor: (options) => textEditor(options),
            onCellEditComplete: onCellEditComplete,
            style: {width: '20%'}
        },
        {
            field: 'nif',
            header: `${t("t.nif")}`,
            editor: (options) => textEditor(options),
            onCellEditComplete: onCellEditComplete,
            style: {width: '20%'}
        },
    ]


    const tableProps = {
        data: formikDirectiva.values.directiva.directius,
        columns: tableColumns,
        breakpoint: "900px",
        editMode: 'cell',
        className: "directiva-form-table"
    };


    const addRow = () => {
        const newRow = {
            id: null,
            nom: "",
            llinatge1: "",
            llinatge2: "",
            nif: "",
            rol: rolsDirectiu.find((r) => {
                return r.rol === 'Vocal'
            })
        };
        setData([...data, newRow]);
        formikDirectiva.values.directiva.directius.push(newRow);
    };

    const addButton = {
        icon: "pi pi-plus",
        onClick: addRow,
        type: "button"
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
                    <FormCalendar props={dataAltaProps}/>
                    <br/>
                    {getFormErrorMessage('dataAlta')}
                </div>
            </div>
            {data.map((d, idx) => {
                return (
                    <>
                        {idx === 0 &&
                            <div className="row">
                                <div className="col-2"><span className="fw-bold">{t('t.role')}</span></div>
                                <div className="col-2"><span className="fw-bold">{t('t.name')}</span></div>
                                <div className="col-2"><span className="fw-bold">{t('t.surname1')}</span></div>
                                <div className="col-2"><span className="fw-bold">{t('t.surname2')}</span></div>
                                <div className="col-2"><span className="fw-bold">{t('t.nif')}</span></div>
                            </div>}
                        <div className="row ">
                            <div className="col-2"><FormInputText props={rolsProps[idx]}></FormInputText></div>
                            <div className="col-2"><FormInputText
                                props={nomProps[idx]}></FormInputText>{getFormErrorMessage(`directiva.directius.${idx}.nom`)}
                            </div>
                            <div className="col-2"><FormInputText
                                props={llinatge1Props[idx]}></FormInputText>{getFormErrorMessage(`directiva.directius.${idx}.llinatge1`)}
                            </div>
                            <div className="col-2"><FormInputText props={llinatge2Props[idx]}></FormInputText></div>
                            <div className="col-2"><FormInputText
                                props={nifProps[idx]}></FormInputText>{getFormErrorMessage(`directiva.directius.${idx}.nif`)}
                            </div>
                        </div>
                    </>)
            })}
            <BasicButton props={addButton}/>
        </>
    );
};


const DirectivaPage = ({props}) => {

    /********   OBJECTES, PROPIETATS I ESTATS  ***********************/

    const {viewWidth, setViewWidth} = useContext(ViewWidthContext);
    const [directius, setDirectius] = useState(null);
    const [rolsDirectiu, setRolsDirectiu] = useState(null);
    const {t, i18n} = useTranslation("common");
    const [captureDialog, setCaptureDialog] = useState(false);
    const [captureDialogBaixa, setCaptureDialogBaixa] = useState(false);
    const [consultaDialog, setConsultaDialog] = useState(false);
    let emptyDirectiu = {
        id: null,
        nom: "",
        llinatge1: "",
        llinatge2: "",
        nif: "",
        rol: null
    };
    let emptyDirectiva = {
        dataAlta: new Date(),
        dataBaixa: null,
        directius: []
    }
    const [directiva, setDirectiva] = useState(emptyDirectiva);


    /********   HOOKS  ***********************/

    const createEmptyDirectiva = (rols) => {
        rols.forEach(r => emptyDirectiva.directius.push({
            id: null,
            nom: "",
            llinatge1: "",
            llinatge2: "",
            nif: "",
            rol: r
        }))
        setDirectiva(emptyDirectiva)
    }

    useEffect(() => {
        gestorfutbolService.listRolsDirectiu().then((data) => {
            setRolsDirectiu(data.data);
        })
    }, []);

    useEffect(() => {
        gestorfutbolService.checkDirectiva()
            .then((data) => {
                if (data.data) {
                    gestorfutbolService.listDirectiva()
                        .then((data) => {
                            setDirectiva(data.data);
                            if (rolsDirectiu != null) {
                                data.data.directius.forEach(d => {
                                        let rol = rolsDirectiu.find(r => r.id === d.rol);
                                        d.rol = rol.rol;
                                    }
                                )
                            }
                            setDirectius(data.data.directius);
                        })
                } else if (rolsDirectiu != null) {
                    createEmptyDirectiva(rolsDirectiu);
                }
            })
    }, [rolsDirectiu])

    const loadData = () => {
        gestorfutbolService.listDirectiva()
            .then((data) => {
                if (rolsDirectiu != null) {
                    data.data.directius.forEach(d => {
                            let rol = rolsDirectiu.find(r => r.id === d.rol);
                            d.rol = rol.rol;
                        }
                    )
                }
                setDirectius(data.data.directius);
            });
    };

    /********   FUNCIONS D'INTERACCIÓ DEL FRONTAL  ***********************/

    const hideDialog = () => {
        setCaptureDialog(false);
    };

    const hideDialogBaixa = () => {
        setCaptureDialogBaixa(false);
    }

    const hideDialogConsulta = () => {
        setConsultaDialog(false);
    }

    const saveDirectiva = (data) => {
        data.directiva.directius.forEach((d) => d.rol = d.rol.id);
        gestorfutbolService.saveDirectiva(data.directiva)
            .then(() => {
                    setCaptureDialog(false);
                    loadData();
                }
            );
    };

    const baixaDirectiva = (dataBaixa) => {
        gestorfutbolService.baixaDirectiva(dataBaixa)
            .then(() => {
                createEmptyDirectiva(rolsDirectiu);
                formikDirectiva.resetForm();
                setCaptureDialog(true);
                setCaptureDialogBaixa(false);
            })
    }

    const accept = () => {
        setCaptureDialogBaixa(true);
    };

    const reject = () => {
        setCaptureDialogBaixa(false);
    };

    const confirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: `${t("t.confirm.directive.modif")}`,
            icon: "pi pi-info-circle",
            acceptClassName: "rounded-border-btn basicbutton",
            rejectClassName: "confirm-popup-reject",
            acceptLabel: "Sí",
            rejectLabel: "No",
            accept,
            reject,
        });
    };

    /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/

    const newButton = {
        label: `${t('t.create.directive')}`,
        className: "rounded-border-btn",
        onClick: () => {
            formikDirectiva.resetForm();
            setCaptureDialog(true);
        },
        type: "button"
    };

    const modifyButton = {
        label: `${t('t.modify.directive')}`,
        className: "rounded-border-btn w-40 w-xl-20",
        onClick: confirm
    };

    const viewRecordsButton = {
        label: `${t('t.view.records')}`,
        className: "rounded-border-btn w-40 w-xl-20",
        onClick: () => {
            setConsultaDialog(true);
        }
    };

    const tableColumns = [
        {
            field: 'rol',
            header: `${t("t.role")}`
        },
        {
            field: 'nom',
            header: `${t("t.name")}`
        },
        {
            field: 'llinatge1',
            header: `${t("t.surname1")}`
        },
        {
            field: 'llinatge2',
            header: `${t("t.surname2")}`
        },
        {
            field: 'nif',
            header: `${t("t.nif")}`
        },
    ]

    const tableProps = {
        data: directius,
        columns: tableColumns,
        breakpoint: "900px",
        stripedRows: true

    };

    const cancelFormButton = {
        icon: "pi pi-times",
        className: "basicbutton-outlined me-2 rounded-border-btnz",
        label: `${t("t.cancel")}`,
        type: "button",
        onClick: hideDialog,
    };

    const cancelFormBaixaButton = {
        icon: "pi pi-times",
        className: "basicbutton-outlined me-2 rounded-border-btn",
        label: `${t("t.cancel")}`,
        type: "button",
        onClick: hideDialogBaixa,
    };

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t("t.save")}`,
        type: "submit",
        className: "rounded-border-btn"
    };

    const dataAltaDirectivaInput = {
        disabled: true,
        value: new Date(directiva.dataAlta).toLocaleDateString('es-ES'),
        label: `${t('t.start.date')}`
    }

    /********   CONFIGURACIÓ DE VARIABLES DE FORMULARI  ***********************/

    const formikDirectiva = useFormik({
            initialValues: {
                directiva: directiva
            },
            validate: (data) => {
                let errors = {
                    directiva: {
                        directius: []
                    }
                };
                if (!data.directiva.dataAlta) {
                    errors.dataAlta = t("t.empty.field");
                }

                data.directiva.directius.forEach((d, idx) => {
                    errors.directiva.directius[idx] = errors.directiva.directius[idx] || {};

                    if (!d.nom) {
                        errors.directiva.directius[idx].nom = t("t.empty.field");
                    }
                    if (!d.llinatge1) {
                        errors.directiva.directius[idx].llinatge1 = t("t.empty.field");
                    }
                    if (!d.nif) {
                        errors.directiva.directius[idx].nif = t("t.empty.field");
                    }

                })

                let buid = true;

                errors.directiva.directius.forEach((d, idx) => {
                    if (!(d.nom === undefined && d.llinatge1 === undefined && d.nif === undefined)) {
                        buid = false;
                    }
                })

                if (buid) {
                    errors = {};
                    return errors;
                } else {
                    return errors;
                }

            },
            enableReinitialize: true,
            onSubmit: (data) => {
                saveDirectiva(data);
            },
        }
    )

    const formikBaixa = useFormik({
            initialValues: {
                dataBaixa: new Date()
            },
            validate: (data) => {
                let errors = {};
                if (!data.dataBaixa) {
                    errors.dataBaixa = t('t.empty.field');
                }
                const dataBaixa = new Date(data.dataBaixa);
                const dataAlta = new Date(directiva.dataAlta);
                if (dataBaixa < dataAlta) {
                    errors.dataBaixa = t('t.previous.date');
                }
                return errors;
            },
            onSubmit: (data) => {
                baixaDirectiva(data);
            },
        }
    )


    /********   CODI HTML - REACT  ***********************/

    return (
        <div className="container p-2 p-xl-4">
            <ConfirmPopup/>
            <PageTitle props={{title: `${t("t.directive")}`}}></PageTitle>
            {directius === null ?
                <>
                    <div className="d-flex justify-content-center gap-2 align-items-center py-4 mt-4">
                        <span>{t('t.suscribe.directive')}</span>
                        <BasicButton props={newButton}></BasicButton>
                    </div>
                </>
                :
                <>
                    <div className="row justify-content-center justify-content-xl-end gap-2">
                        <BasicButton props={modifyButton}></BasicButton>
                        <BasicButton props={viewRecordsButton}></BasicButton>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <FormInputText props={dataAltaDirectivaInput}></FormInputText>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <DataTable value={directius} breakpoint="900px" stripedRows={true} className="table-component">
                            {tableColumns.map(({field, header}) => {
                                return <Column key={field} field={field} header={header}></Column>
                            })}
                        </DataTable>
                        {/*<TableComponent props={tableProps}></TableComponent>*/}
                    </div>
                </>
            }

            <Dialog
                visible={captureDialog}
                header={t("t.new.directive").toUpperCase()}
                onHide={hideDialog}

            >
                <form onSubmit={formikDirectiva.handleSubmit}>
                    <DirectivaContext.Provider value={{formikDirectiva, rolsDirectiu}}>
                        <DirectiuDataForm/>
                    </DirectivaContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

            <Dialog
                visible={captureDialogBaixa}
                header={t("t.withdraw.directive").toUpperCase()}
                onHide={hideDialogBaixa}
            >
                <form onSubmit={formikBaixa.handleSubmit}>
                    <BaixaContext.Provider
                        value={{formikBaixa}}
                    >
                        <BaixaDirectivaForm/>
                    </BaixaContext.Provider>
                    <div className="p-dialog-footer pb-0 mt-5">
                        <BasicButton props={cancelFormBaixaButton}/>
                        <BasicButton props={saveFormButton}/>
                    </div>
                </form>
            </Dialog>

            <Dialog
                visible={consultaDialog}
                header={t("t.view.records").toUpperCase()}
                onHide={hideDialogConsulta}
            >
                <DirectivaContext.Provider value={{rolsDirectiu}}>
                    <HistoricDirectiva></HistoricDirectiva>
                </DirectivaContext.Provider>

            </Dialog>


        </div>
    );
}


export default DirectivaPage;