import "./editorplantilles.css";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { ConfirmPopup } from "primereact/confirmpopup";
import { ConfigContext } from "../../../App";
import { plantillesService } from "../../../services/real/plantillesService";
import PlantillaEditor from "../../../components/plantillaeditor/plantillaeditor";
import { useFormik } from "formik";
import BasicButton from "../../../components/basicbutton/basicbutton";

const EditorPlantilles = ({ props }) => {
  const { viewWidth, setViewWidth } = useContext(ConfigContext);
  const { t, i18n } = useTranslation("common");
  const emptyPlantilla = {
    id: null,
    codi: "",
    nom: "",
    idioma: "",
    contingutHtml: "",
    contingutCss: "",
  };

  const [plantilla, setPlantilla] = useState(emptyPlantilla);

  useEffect(() => {
    plantillesService.getPlantilla("REBUT_PATROCINI").then((response) => {
      setPlantilla(response.data);
    });
  }, []);

  const editorProps = {
    contingutHtml: plantilla.contingutHtml,
    contingutCss: plantilla.contingutCss,
    onEditorChange: (newContent) => {
      setPlantilla({ ...plantilla, contingutHtml: newContent });
    },
  };

  const savePlantilla = (data) => {
    if (plantilla.id) {
      data.id = plantilla.id;
    }

    plantillesService.savePlantilla(data).then(() => {
      
    });
  };

  const saveFormButton = {
    icon: "pi pi-check",
    label: `${t("t.save")}`,
    className: "p-2 rounded-2",
    onClick: () => {
      savePlantilla(plantilla);
    },
  };

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <PlantillaEditor props={editorProps} />
      <BasicButton props={saveFormButton}></BasicButton>
    </div>
  );
};

export default EditorPlantilles;
