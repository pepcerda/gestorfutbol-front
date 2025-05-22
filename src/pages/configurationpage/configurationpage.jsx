import './configurationpage.css';
import BasicButton from "../../components/basicbutton/basicbutton";
import {useFormik} from "formik";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import FormInputText from "../../components/forminputtext/forminputtext";
import PageTitle from "../../components/pagetitle/pagetitle";
import {Toast} from "primereact/toast";
import {ConfigContext} from "../../App";
import ColorPickerInput from "../../components/colorpickerinput/colorpickerinput";
import FileUploader from "../../components/fileuploader/fileuploader";
import {setFavicon} from "../../hooks/faviconHook";

const ConfigurationPage = ({props}) => {

    /********   OBJECTES, PROPIETATS I ESTATS  ***********************/
    let emptyConfiguration = {
        id: 0,
        nom: "",
        cif: "",
        colorPrincipal: "#000000",
        logo: "",
        colorFons1: "#ee4f4f",
        colorFons2: "#e8d1d1"
    }

    const {t, i18n} = useTranslation("common");
    const [configuration, setConfiguration] = useState(emptyConfiguration);
    const toast = useRef(null);
    const {color, setColor, logo, setLogo, nom, setNom, color1, setColor1, color2, setColor2} = useContext(ConfigContext);

    /********   HOOKS  ***********************/

    useEffect(() => {
        gestorfutbolService.getConfiguration()
            .then(data => {
                setConfiguration(data.data);
                setColor(data.data.colorPrincipal);
                setColor1(data.data.colorFons1);
                setColor2(data.data.colorFons2);

                if(data.data.logo) {
                    setLogo(process.env.REACT_APP_URI_BACK+ data.data.logo);
                    setFavicon(process.env.REACT_APP_URI_BACK+ data.data.logo)
                }

                if(data.data.nom) {
                    setNom(data.data.nom);
                    document.title = data.data.nom;
                }
            })
    }, []);

    function isImageBase64(str) {
        return /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/.test(str);
    }


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
                setColor1(data.data.colorFons1);
                setColor2(data.data.colorFons2);

                if(data.data.logo) {
                    setLogo(process.env.REACT_APP_URI_BACK + data.data.logo);
                    setFavicon(process.env.REACT_APP_URI_BACK + data.data.logo);
                };


                if(data.data.nom) {
                    setNom(data.data.nom);
                    document.title = data.data.nom;
                };


            })
    }

    const saveConfig = (data) => {

        console.log(isImageBase64(data.logo));

        if(!isImageBase64(data.logo)) {
            data.logo = null;
        }

        let config = {
            id: configuration.id,
                ...data
        };

        gestorfutbolService.saveConfiguration(config)
            .then(data => {
                loadConfig();
            }).then(() => show());
    };

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            formikConfig.setFieldValue("logo", base64data);
        };
    };

    /********   CONFIGURACIÓ DE VARIABLES DE FORMULARI  ***********************/

    const formikConfig = useFormik({
            initialValues: {
                nom: configuration.nom,
                cif: configuration.cif,
                colorPrincipal: configuration.colorPrincipal,
                logo: configuration.logo,
                colorFons1: configuration.colorFons1,
                colorFons2: configuration.colorFons2
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

    const logoUploader = {
        id: "logo-up",
        mode: "basic",
        label: `${t(`t.logo`)}`,
        customUpload: true,
        uploadHandler: customBase64Uploader
    }

    const colorFons1Props = {
        id: "color-1",
        label: `${t("t.color.fons.1")}`,
        format: "hex",
        value: formikConfig.values.colorFons1,
        onChange: (e) => {
            formikConfig.setFieldValue("colorFons1", `#${e.value}`);
        }
    }

    const colorFons2Props = {
        id: "color-2",
        label: `${t("t.color.fons.2")}`,
        format: "hex",
        value: formikConfig.values.colorFons2,
        onChange: (e) => {
            formikConfig.setFieldValue("colorFons2", `#${e.value}`);
        }
    }

    const saveFormButton = {
        icon: "pi pi-check",
        label: `${t("t.save")}`,
        type: "submit",
        className: "basicbutton rounded-border-btn"
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
                    <div className="row">
                        <div className="col-2 form-group">
                            <FileUploader props={logoUploader}/>
                        </div>
                        <div className="col-8">
                            <span>Logo actual: </span>
                            {logo && <img src={logo} alt="Logo aplicación" className="img-fluid logo"/>}
                        </div>
                    </div>
                    <div className="col-12 form-group mt-3">
                        <ColorPickerInput props={colorFons1Props}></ColorPickerInput>
                    </div>
                    <div className="col-12 form-group ">
                        <ColorPickerInput props={colorFons2Props}></ColorPickerInput>
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