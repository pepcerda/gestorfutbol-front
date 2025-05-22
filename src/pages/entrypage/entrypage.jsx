import "./entrypage.css";
import {useTranslation} from "react-i18next";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import BasicButton from "../../components/basicbutton/basicbutton";
import {useContext, useEffect} from "react";
import {ConfigContext} from "../../App";
import logoRes from "../../resources/file.png";

const Logo = () => {
    const {logo} = useContext(ConfigContext);

    return (
        <>
            {logo ? <img src={logo} alt="Logo aplicación" className="img-fluid logo"/> :
                <img src={logoRes} alt="Logo aplicación" className="img-fluid logo"/>}
        </>
    )
};

const Title = () => {
    const {nom} = useContext(ConfigContext);

    return <h2 className="fw-bold">{nom}</h2>;
};

const EntryPage = ({props}) => {
    const {isLoading, isAuthenticated, login} = useKindeAuth();
    const {t, i18n} = useTranslation("common");
    const {viewWidth} = useContext(ConfigContext);

    const authButton = {
        label: `${t("t.autenticat")}`,
        onClick: () => {
            login();
        },
    };
    return (
        <div className="row gap-2 justify-content-center align-items-center align-content-center entrypage">
            <div
                className="entrypage-square d-flex flex-column flex-sm-row justify-content-center align-content-center gap-5">
                <div className="d-flex justify-content-center align-items-center pl-5">
                    <Logo></Logo>
                </div>
                <div className="d-flex justify-content-center flex-column gap-3">
                    {viewWidth <= 576 ? <></> : <Title></Title>}
                    <BasicButton props={authButton}></BasicButton>
                </div>
            </div>
        </div>
    );
};

export default EntryPage;
