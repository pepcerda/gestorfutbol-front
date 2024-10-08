import './entrypage.css';
import logo from '../../resources/file.png'
import {useTranslation} from "react-i18next";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import BasicButton from "../../components/basicbutton/basicbutton";


const Logo = () => {
    return (
        <img src={logo} alt="Logo aplicación" className="logo"/>
    )
}

const Title = () => {
    return (
        <h2 className="fw-bold">ATHLETIC CLUB MONTUIRI</h2>
    )
}

const EntryPage = ({props}) => {
    const {isLoading, isAuthenticated, login} = useKindeAuth();
    const {t, i18n} = useTranslation("common");

    const authButton = {
        label: `${t('t.autenticat')}`,
        onClick: () => {login()}
    }
    return (
        <div className="row gap-2 justify-content-center align-items-center align-content-center entrypage">
            <div className="entrypage-square d-flex justify-content-center gap-5">
                <div className="d-flex justify-content-center align-items-center pl-5">
                    <Logo></Logo>
                </div>
                <div className="d-flex justify-content-center flex-column gap-3">
                    <Title></Title>
                    <BasicButton props={authButton}></BasicButton>
                </div>
            </div>




        </div>);
}


export default EntryPage;