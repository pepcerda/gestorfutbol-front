import './configurationpage.css';
import {ConfirmPopup} from "primereact/confirmpopup";
import BasicButton from "../../components/basicbutton/basicbutton";
import {useFormik} from "formik";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import FormInputText from "../../components/forminputtext/forminputtext";
import PageTitle from "../../components/pagetitle/pagetitle";
import data from "bootstrap/js/src/dom/data";
import {Toast} from "primereact/toast";
import {ColorPicker} from "primereact/colorpicker";
import {ViewWidthContext} from "../../App";
import ColorPickerInput from "../../components/colorpickerinput/colorpickerinput";
import { FileUpload } from 'primereact/fileupload';

const ConfigurationPage = ({props}) => {

    /********   OBJECTES, PROPIETATS I ESTATS  ***********************/
    let emptyConfiguration = {
        id: 0,
        nom: "",
        cif: "",
        colorPrincipal: "#000000",
        logoBase64: ""
    }

    const {t, i18n} = useTranslation("common");
    const [configuration, setConfiguration] = useState(emptyConfiguration);
    const toast = useRef(null);
    const {color, setColor} = useContext(ViewWidthContext);

    /********   HOOKS  ***********************/

    useEffect(() => {
        gestorfutbolService.getConfiguration()
            .then(data => {
                setConfiguration(data.data);
                setColor(data.data.colorPrincipal);
            })
    }, []);


    /********   FUNCIONS D'INTERACCIÓ DEL FRONTAL  ***********************/

    const isFormFieldInvalid = (name) =>
        !!(formikConfig.touched[name] && formikConfig.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? (
            <small className="form-text-invalid">{formikConfig.errors[name]}</small>
        ) : (
            <small className="form-text-invalid">&nbsp;</small>
        );
    };

    const loadConfig = () => {
        gestorfutbolService.getConfiguration()
            .then(data => {
                setConfiguration(data.data);
                setColor(data.data.colorPrincipal);
            })
    }

    const saveConfig = (data) => {
        let config = {
            id: configuration.id,
                ...data
        };

        console.log(data);

        gestorfutbolService.saveConfiguration(config)
            .then(data => {
                loadConfig();
            }).then(() => show());
    };

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        console.log(event)
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            formikConfig.setFieldValue("logoBase64", base64data); 
        };
    };

    /********   CONFIGURACIÓ DE VARIABLES DE FORMULARI  ***********************/

    const formikConfig = useFormik({
            initialValues: {
                nom: configuration.nom,
                cif: configuration.cif,
                colorPrincipal: configuration.colorPrincipal,
                logo: configuration.logo
            },
            validate: (data) => {

            },
            enableReinitialize: true,
            onSubmit: (data) => {
                saveConfig(data);
            },
        }
    )

    /********   PROPIETATS D'ELEMENTS DEL FRONTAL  ***********************/

    const cifProps = {
        id: "cif",
        label: `${t("t.cif")}`,
        value: formikConfig.values.cif,
        onChange: (e) => {
            formikConfig.setFieldValue("cif", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
    };

    const nomProps = {
        id: "nom",
        label: `${t("t.name")}`,
        value: formikConfig.values.nom,
        onChange: (e) => {
            formikConfig.setFieldValue("nom", e.target.value);
        },
        classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
        labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
    };

    const colorPrincipalProps = {
        id: "color-p",
        label: `${t("t.color.principal")}`,
        format: "hex",
        value: formikConfig.values.colorPrincipal,
        onChange: (e) => {
            formikConfig.setFieldValue("colorPrincipal", `#${e.value}`);
        }

    }

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t("t.save")}`,
        type: "submit",
    };

    const show = () => {
        toast.current.show({severity: 'success', detail: `${t('t.config.saved')}`});
    };

    return (
        <div className="container p-2 p-xl-4">
            <Toast ref={toast}/>
            <PageTitle props={{title: `${t("t.settings")}`}}></PageTitle>
            <form onSubmit={formikConfig.handleSubmit}>
                <div className="row mt-4">
                    <div className="col-12 form-group ">
                        <FormInputText props={nomProps}></FormInputText>
                        {getFormErrorMessage("nom")}
                    </div>
                    <div className="col-12 form-group ">
                        <FormInputText props={cifProps}></FormInputText>
                        {getFormErrorMessage("cif")}
                    </div>
                    <div className="col-12 form-group ">
                        <ColorPickerInput props={colorPrincipalProps}></ColorPickerInput>
                    </div>
                    <div className="col-12 form-group">
                        <FileUpload mode="advanced" accept="image/*" customUpload uploadHandler={customBase64Uploader} />
                    </div>
                </div>
                <div className="p-dialog-footer pb-0 mt-5">
                    <BasicButton props={saveFormButton}/>
                </div>
            </form>
        </div>
    );
}


export default ConfigurationPage;