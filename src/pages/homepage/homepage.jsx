import "./homepage.css";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gestorfutbolService } from "../../services/real/gestorfutbolService";
import { explotacioDadesService } from "../../services/real/explotacioDadesService";
import { useFormik } from "formik";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import PageTitle from "../../components/pagetitle/pagetitle";
import DataCard from "../../components/datacard/datacard";
import ffiblogo from "../../resources/utilitats/utilitatffib.png";
import drivelogo from "../../resources/utilitats/utilitatsdrive.png";
import intranet from "../../resources/utilitats/utilitatintranet.png";
import { NavLink } from "react-router-dom";
import { CampaignContext } from "../../App";
import { useActiveCampaign } from "../../hooks/campaignHook";


const UtilitatsModul = ({ props }) => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="row">
      <div className="col-6 col-sm-4 col-lg-2">
        <a
          href="https://www.ffib.es/Fed/NPcd/NFG_VisCalendario_Vis?cod_primaria=1000110&codtemporada=21&codcompeticion=22536411&codgrupo=22536412"
          target="_blank"
          className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1"
        >
          <img src={ffiblogo} className="utilitats-img" />
          <p className="m-0 text-center">FFIB - {t("t.calendari")}</p>
        </a>
      </div>
      <div className="col-6 col-sm-4 col-lg-2">
        <a
          href="https://www.ffib.es/Fed/NPcd/NFG_VisClasificacion?cod_primaria=1000110&codjornada=1&codcompeticion=22536411&codgrupo=22536412"
          target="_blank"
          className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1"
        >
          <img src={ffiblogo} className="utilitats-img" />
          <p className="m-0 text-center">FFIB - {t("t.classificacio")}</p>
        </a>
      </div>
      <div className="col-6 col-sm-4 col-lg-2">
        <a
          href="https://drive.google.com/drive/home"
          target="_blank"
          className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1"
        >
          <img src={drivelogo} className="utilitats-img" />
          <p className="m-0 text-center">Drive</p>
        </a>
      </div>
      <div className="col-6 col-sm-4 col-lg-2">
        <a
          href="https://intranet.ffib.es/nfg/"
          target="_blank"
          className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1"
        >
          <img src={intranet} className="utilitats-img" />
          <p className="m-0 text-center">Intranet FFIB</p>
        </a>
      </div>
    </div>
  );
};

const IngressosModul = ({ props }) => {
  const emptyDadesPatrocinis = {
    previsioRecaptacio: 0,
    totalRecaptat: 0,
    totalPatrocinadors: 0,
  };

  const emptyDadesSocis = {
    previsioRecaptacio: 0,
    totalRecaptat: 0,
    totalSocis: 0,
  };

  const { t, i18n } = useTranslation("common");
  const { activeCampaignId } = useActiveCampaign();
  const [dadesPatrocinis, setDadesPatrocinis] = useState(emptyDadesPatrocinis);
  const [dadesSocis, setDadesSocis] = useState(emptyDadesSocis);

  useEffect(() => {
    if (activeCampaignId) {
      explotacioDadesService
        .getDadesExplotacioPatrocinis(activeCampaignId)
        .then((data) => {
          setDadesPatrocinis(data.data);
        });
      explotacioDadesService
        .getDadesExplotacioSocis(activeCampaignId)
        .then((data) => {
          setDadesSocis(data.data);
        });
    }
  }, [activeCampaignId]);

  const patrocinadorsContent = () => {
    return (
      <>
        <p>
          {t("t.previsio.recaptacio")}: {dadesPatrocinis.previsioRecaptacio} €
        </p>
        <p>
          {t("t.total.recaptacio")}: {dadesPatrocinis.totalRecaptat} €
        </p>
        <p>
          {t("t.total.patrocinadors")}: {dadesPatrocinis.totalPatrocinadors}
        </p>
        <br />

        <NavLink
          to={"/patrocinadors"}
          state={{ filtre: { estatPagament: "D" } }}
          className="basicbutton rounded-border-btn text-light"
        >
          {t("t.consulta.pendents")}
        </NavLink>
      </>
    );
  };

  const patrocinadorsCard = {
    title: `${t("t.sponsors")}`,
    className: "green-text-card",
    content: patrocinadorsContent(),
  };

  const socisContent = () => {
    return (
      <>
        <>
          <p>
            {t("t.previsio.recaptacio")}: {dadesSocis.previsioRecaptacio} €
          </p>
          <p>
            {t("t.total.recaptacio")}: {dadesSocis.totalRecaptat} €
          </p>
          <p>
            {t("t.total.socis")}: {dadesSocis.totalSocis}
          </p>
          <br />

          <NavLink
            to={"/socis"}
            state={{ filtre: { estatPagament: "D" } }}
            className="basicbutton rounded-border-btn text-light"
          >
            {t("t.consulta.pendents")}
          </NavLink>
        </>
      </>
    );
  };

  const socisCard = {
    title: `${t("t.members")}`,
    className: "green-text-card",
    content: socisContent(),
  };
  return (
    <div className="row gap-2 gap-md-0">
      <div className="col-12 col-md-6">
        <DataCard props={patrocinadorsCard}></DataCard>
      </div>
      <div className="col-12 col-md-6">
        <DataCard props={socisCard}></DataCard>
      </div>
    </div>
  );
};

const DespesesModul = ({ props }) => {
  const emptyDadesFactures = {
    totalPagat: 0,
    pendentPagar: 0,
  };

  const emptyDadesNomines = {
    totalNominesPagades: 0,
    totalNominesPendents: 0,
  };

  const { t, i18n } = useTranslation("common");
  const [dadesCaixaFixa, setDadesCaixaFixa] = useState(emptyDadesFactures);
  const [dadesFactures, setDadesFactures] = useState(emptyDadesFactures);
  const [dadesNomines, setDadesNomines] = useState(emptyDadesNomines);
  const { activeCampaignId } = useActiveCampaign();

  useEffect(() => {
    if (activeCampaignId) {
      explotacioDadesService
        .getDadesExplotacioCaixaFixa(activeCampaignId)
        .then((data) => {
          setDadesCaixaFixa(data.data);
        });

      explotacioDadesService
        .getDadesExplotacioFactures(activeCampaignId)
        .then((data) => {
          setDadesFactures(data.data);
        });

      explotacioDadesService
        .getDadesExplotacioNomines(activeCampaignId)
        .then((data) => {
          setDadesNomines(data.data);
        });
    }
  }, [activeCampaignId]);

  const caixaFixaContent = () => {
    return (
      <>
        <p>
          {t("t.pendent.pagar")}: {dadesCaixaFixa.pendentPagar} €
        </p>
        <p>
          {t("t.total.pagat")}: {dadesCaixaFixa.totalPagat} €
        </p>
        <br />
        <NavLink
          to={"/tiquets"}
          state={{ filtre: { estat: "D" } }}
          className="basicbutton rounded-border-btn text-light"
        >
          {t("t.consulta.pendents")}
        </NavLink>
      </>
    );
  };

  const caixaFixaCard = {
    title: `${t("t.caixa.fixa")}`,
    className: "red-text-card",
    content: caixaFixaContent(),
  };

  const facturesContent = () => {
    return (
      <>
        <p>
          {t("t.pendent.pagar")}: {dadesFactures.pendentPagar} €
        </p>
        <p>
          {t("t.total.pagat")}: {dadesFactures.totalPagat} €
        </p>
        <br />
        <NavLink
          to={"/factures"}
          state={{ filtre: { estatPagament: "PENDENT" } }}
          className="basicbutton rounded-border-btn text-light"
        >
          {t("t.consulta.pendents")}
        </NavLink>
      </>
    );
  };

  const facturesCard = {
    title: `${t("t.factures")}`,
    className: "red-text-card",
    content: facturesContent(),
  };

  const nominesContent = () => {
    return (
      <>
        <p>
          {t("t.pendent.pagar")}: {dadesNomines.totalNominesPendents} €
        </p>
        <p>
          {t("t.total.pagat")}: {dadesNomines.totalNominesPagades} €
        </p>
        <br />
        <NavLink
          to={"/mensualitats"}
          className="basicbutton rounded-border-btn text-light"
        >
          {t("t.consulta.pendents")}
        </NavLink>
      </>
    );
  };

  const nominesCard = {
    title: `${t("t.nomines")}`,
    className: "red-text-card",
    content: nominesContent(),
  };

  return (
    <div className="row gap-2 gap-md-0">
      <div className="col-12 col-md-6">
        <DataCard props={caixaFixaCard}></DataCard>
      </div>
      <div className="col-12 col-md-6">
        <DataCard props={facturesCard}></DataCard>
      </div>
      <div className="col-12 col-md-6 mt-md-3">
        <DataCard props={nominesCard}></DataCard>
      </div>
    </div>
  );
};

const HomePage = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const {
    campaigns,
    tabMenuItems,
    activeIndex,
    setActiveByIndex,
    activeCampaign,
    activeCampaignId,
    seasonLabel
  } = useActiveCampaign();


  const formikMenu = useFormik({
    initialValues: {
      campanya: activeCampaignId,
    },
    onSubmit: (data) => {
      setActiveByIndex(data.campanya);
    },
  });

  const campanyaProps = {
    id: "campanya",
    label: `${t("t.campaign")}`,
    value: activeCampaignId,
    onChange: (e) => {
      console.log("Canvi campanya:", e.value);
      formikMenu.setFieldValue("campanya", campaigns.findIndex(c => c.id === e.value));
      formikMenu.handleSubmit();
    },
    options: campaigns,
    optionLabel: "titol",
    optionValue: "id",
  };

  const ingressosCard = {
    title: `${t("t.ingressos")}`,
    className: "green-card",
    content: <IngressosModul />,
  };

  const despesesCard = {
    title: `${t("t.despeses")}`,
    className: "red-card",
    content: <DespesesModul />,
  };

  const utilitatsCard = {
    title: `${t("t.utilitats")}`,
    content: <UtilitatsModul />,
  };

  return (
    <>
      <PageTitle props={{ title: `${t("t.inici")}` }}></PageTitle>
      <div className="row mt-3">
        <div className="col-12">
          <DataCard props={utilitatsCard}></DataCard>
        </div>
      </div>
      <div className="row mt-5">
        <form onSubmit={formikMenu.handleSubmit}>
          <div className="col-12 col-md-5 form-group text-center text-md-start mt-3 mt-md-0">
            <SelectOneMenu props={campanyaProps}></SelectOneMenu>
          </div>
        </form>
      </div>
        <div className="row mt-5 gap-2 gap-md-0">
          <div className="col-12 col-md-6">
            <DataCard props={ingressosCard}></DataCard>
          </div>
          <div className="col-12 col-md-6">
            <DataCard props={despesesCard}></DataCard>
          </div>
        </div>
    </>
  );
};

export default HomePage;
