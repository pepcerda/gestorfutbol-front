import './headerbar.css';
import logoRes from '../../resources/file.png';
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../../App";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useTranslation} from "react-i18next";
import BasicButton from "../../components/basicbutton/basicbutton";


const Logo = () => {
    const {logo} = useContext(ConfigContext);

    return (
        <>
        {logo ? <img src={logo} alt="Logo aplicación" className="img-fluid logo-header"/> : <img src={logoRes} alt="Logo aplicación" className="img-fluid logo-header"/> }
        </>
    )
}

const Title = () => {
    return (
        <h2 className="fw-bold">GESTOR FUTBOL</h2>
    )
}

const UserProfile = () => {
    const {viewWidth, setViewWidth} = useContext(ConfigContext);
    const {user, login, register, isAuthenticated, isLoading, logout, getIdToken, getUser} = useKindeAuth();
    const {t, i18n} = useTranslation("common");


    const signUp = {
        label: `${t('t.signup')}`,
        className: "rounded-border-btn header-btn",
        onClick: () => {register()}
    };

    const signIn = {
        label: `${t('t.signin')}`,
        className: "rounded-border-btn header-btn",
        onClick: () => {login()}
    };

    const logOutButtonLarge = {
        label: `${t('t.logout')}`,
        className: "rounded-border-btn header-btn",
        onClick: () => {logout()}
    };

    const logOutButtonSmall = {
        icon: 'pi pi-sign-out',
        className: "rounded-border-btn header-btn",
        onClick: () => {logout()}
    };

    if (!isLoading && !isAuthenticated) {
        return (
            <>
                <BasicButton props={signUp}></BasicButton>
                <BasicButton props={signIn}></BasicButton>
            </>

        )
    }

    if (!isLoading && isAuthenticated) {
        return (
            <>
                
                {viewWidth <= 992 ? (
                    <BasicButton props={logOutButtonSmall}></BasicButton>
                ) : (
                    <BasicButton props={logOutButtonLarge}></BasicButton>
                )}
            </>
        )
    }


}


const HeaderLayout = () => {

    return (
        <div className="row m-0">
            <div className="col-4 col-md-2">
                <Logo></Logo>
            </div>
            <div className="col-4 col-md-8 my-auto text-center">
                <Title></Title>
            </div>
            <div className="col-4 col-md-2 d-flex justify-content-center align-items-center gap-2">
                <UserProfile></UserProfile>
            </div>
        </div>
    )
}

const HeaderBar = () => {
    return (
        <div className="headerbar">
            <HeaderLayout></HeaderLayout>
        </div>);
}


export default HeaderBar;