import './homepage.css';
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {gestorfutbolService} from "../../services/real/gestorfutbolService";
import {explotacioDadesService} from "../../services/real/explotacioDadesService";
import {useFormik} from "formik";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import PageTitle from "../../components/pagetitle/pagetitle";
import DataCard from "../../components/datacard/datacard";
import ffiblogo from "../../resources/utilitats/utilitatffib.png";
import drivelogo from "../../resources/utilitats/utilitatsdrive.png";
import intranet from "../../resources/utilitats/utilitatintranet.png"

const UtilitatsModul = ({props}) => {
    const {t, i18n} = useTranslation("common");


    return (
        <div className="row">
            <div className="col-6 col-sm-4 col-lg-2">
                <a href="https://www.ffib.es/Fed/NPcd/NFG_VisCalendario_Vis?cod_primaria=1000110&codtemporada=21&codcompeticion=22536411&codgrupo=22536412"
                   target="_blank"
                   className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1">
                    <img src={ffiblogo} className="utilitats-img"/>
                    <p className="m-0 text-center">FFIB - {t('t.calendari')}</p>
                </a>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
                <a href="https://www.ffib.es/Fed/NPcd/NFG_VisClasificacion?cod_primaria=1000110&codjornada=1&codcompeticion=22536411&codgrupo=22536412"
                   target="_blank"
                   className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1">
                    <img src={ffiblogo} className="utilitats-img"/>
                    <p className="m-0 text-center">FFIB - {t('t.classificacio')}</p>
                </a>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
                <a href="https://drive.google.com/drive/home"
                   target="_blank"
                   className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1">
                    <img src={drivelogo} className="utilitats-img"/>
                    <p className="m-0 text-center">Drive</p>
                </a>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
                <a href="https://intranet.ffib.es/nfg/"
                   target="_blank"
                   className="d-flex flex-column align-content-center justify-content-center align-items-center utilitats-card gap-1">
                    <img src={intranet} className="utilitats-img"/>
                    <p className="m-0 text-center">Intranet FFIB</p>
                </a>
            </div>


        </div>
    )

}

const IngressosModul = ({props}) => {
    const {t, i18n} = useTranslation("common");

    const patrocinadorsContent = () => {
        return (
            <>
                <p>Total a recaptar: 30.000 €</p>
                <p>Consulta pendents</p>
                <br/>
                <p>Total recaptat: 15.000 €</p>
            </>
        )
    }

    const patrocinadorsCard = {
        title: `${t('t.sponsors')}`,
        className: "green-text-card",
        content: patrocinadorsContent()
    }

    const socisContent = () => {
        return (
            <>
                <p>Total a recaptar: 30.000 €</p>
                <p>Consulta pendents</p>
                <br/>
                <p>Total recaptat: 15.000 €</p>
            </>
        )
    }

    const socisCard = {
        title: `${t('t.members')}`,
        className: "green-text-card",
        content: socisContent()
    }
    return (
        <div className="row gap-2 gap-md-0">
            <div className="col-12 col-md-6">
                <DataCard props={patrocinadorsCard}></DataCard>
            </div>
            <div className="col-12 col-md-6">
                <DataCard props={socisCard}></DataCard>
            </div>
        </div>
    )
};

const DespesesModul = ({props}) => {
    const {t, i18n} = useTranslation("common");

    const facturesContent = () => {
        return (
            <>
                <p>Total a recaptar: 30.000 €</p>
                <p>Consulta pendents</p>
                <br/>
                <p>Total recaptat: 15.000 €</p>
            </>
        )
    }

    const facturesCard = {
        title: `${t('t.factures')}`,
        className: "red-text-card",
        content: facturesContent()
    }

    return (
        <div className="row gap-1">
            <div className="col-12 col-md-6">
                <DataCard props={facturesCard}></DataCard>
            </div>
        </div>
    )
};

const HomePage = ({props}) => {

    const {t, i18n} = useTranslation("common");
    const [campaigns, setCampaigns] = useState(null);
    const [activeCampaign, setActiveCampaign] = useState(null);

    useEffect(() => {
        let results;
        gestorfutbolService.getAllCampaigns().then((data) => {
            results = data.data;
            setCampaigns(results);
        });
    }, [])

    useEffect(() => {
        if (campaigns !== null) {
            let year = new Date().getFullYear();
            let campaign = campaigns.find(c =>
                new Date(c.any).getFullYear() === year
            )
            if (campaign) {
                let index = campaigns.findIndex(c => c.id === campaign.id);
                setActiveCampaign(campaign.id);
            } else {
                setActiveCampaign(campaigns[0].id);
            }
        }

    }, [campaigns]);

    const formikMenu = useFormik({
        initialValues: {
            campanya: activeCampaign
        },
        onSubmit: (data) => {
            console.log(data)
        }
    });

    const campanyaProps = {
        id: "campanya",
        label: `${t("t.campaign")}`,
        value: activeCampaign,
        onChange: (e) => {
            formikMenu.setFieldValue("campanya", e.value);
        },
        options: campaigns,
        optionLabel: "titol",
        optionValue: "id"
    };


    const ingressosCard = {
        title: `${t('t.ingressos')}`,
        className: "green-card",
        content: <IngressosModul/>
    }

    const despesesCard = {
        title: `${t('t.despeses')}`,
        className: "red-card",
        content: <DespesesModul/>
    }

    const utilitatsCard = {
        title: `${t('t.utilitats')}`,
        content: <UtilitatsModul/>
    }

    return (
        <>
            <PageTitle props={{title: `${t('t.inici')}`}}></PageTitle>
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

        </>);
}

export default HomePage;