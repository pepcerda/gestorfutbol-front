import './headerbar.css';
import logo from '../../resources/file.png';
import {useContext, useEffect, useState} from "react";
import {ViewWidthContext} from "../../App";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useTranslation} from "react-i18next";
import BasicButton from "../../components/basicbutton/basicbutton";


const Logo = () => {
    return (
        <img src={logo} alt="Logo aplicación" className="img-fluid logo"/>
    )
}

const Title = () => {
    return (
        <h2 className="fw-bold">GESTOR FUTBOL</h2>
    )
}

const UserProfile = () => {
    const {viewWidth, setViewWidth} = useContext(ViewWidthContext);
    const {user, login, register, isAuthenticated, isLoading, logout, getIdToken, getUser} = useKindeAuth();
    const {t, i18n} = useTranslation("common");


    const signUp = {
        label: `${t('t.signup')}`,
        className: "rounded-border-btn",
        onClick: () => {register()}
    };

    const signIn = {
        label: `${t('t.signin')}`,
        className: "rounded-border-btn",
        onClick: () => {login()}
    };

    const logOutButton = {
        label: `${t('t.logout')}`,
        className: "rounded-border-btn",
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
                <BasicButton props={logOutButton}></BasicButton>
                {viewWidth <= 576 ? (
                    <></>
                ) : (
                    <h6 className="text-light fw-semibold">{}</h6>
                )}
                <h6 className="fw-bold">Usuari connectat: {user.given_name} {user.family_name}</h6>

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