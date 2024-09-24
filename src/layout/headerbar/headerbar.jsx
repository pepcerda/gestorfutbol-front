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
        <h2 className="text-light fw-bold">GESTOR FUTBOL</h2>
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
                <div className="profile d-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 32 33" fill="none"
                         className="img-fluid">
                        <path
                            d="M15.6444 16.8918C14.1472 16.8918 12.6836 16.3964 11.4388 15.4684C10.1939 14.5404 9.22364 13.2213 8.65069 11.678C8.07774 10.1347 7.92783 8.43653 8.21992 6.79818C8.51201 5.15984 9.23297 3.65493 10.2916 2.47375C11.3503 1.29257 12.6991 0.488176 14.1676 0.162289C15.636 -0.163597 17.158 0.00365949 18.5413 0.642909C19.9245 1.28216 21.1068 2.36469 21.9385 3.75361C22.7703 5.14253 23.2143 6.77546 23.2143 8.4459C23.2143 10.6859 22.4168 12.8341 20.9971 14.418C19.5775 16.002 17.6521 16.8918 15.6444 16.8918ZM15.6444 3.37836C14.7461 3.37836 13.8679 3.67557 13.121 4.23239C12.3741 4.78922 11.7919 5.58066 11.4482 6.50663C11.1044 7.4326 11.0145 8.45152 11.1897 9.43452C11.365 10.4175 11.7975 11.3205 12.4327 12.0292C13.0679 12.7379 13.8772 13.2205 14.7583 13.4161C15.6393 13.6116 16.5526 13.5112 17.3825 13.1277C18.2124 12.7441 18.9218 12.0946 19.4209 11.2613C19.92 10.4279 20.1863 9.44816 20.1863 8.4459C20.1863 7.1019 19.7078 5.81295 18.856 4.86261C18.0042 3.91226 16.849 3.37836 15.6444 3.37836Z"
                            fill="#729AC6"/>
                        <path
                            d="M29.775 32.6576C29.3751 32.6517 28.993 32.4719 28.7102 32.1564C28.4274 31.8408 28.2663 31.4146 28.261 30.9684C28.261 26.5765 26.1213 23.6486 15.6445 23.6486C5.16773 23.6486 3.02797 26.5765 3.02797 30.9684C3.02797 31.4164 2.86846 31.846 2.58453 32.1628C2.3006 32.4796 1.91552 32.6576 1.51398 32.6576C1.11245 32.6576 0.727362 32.4796 0.443435 32.1628C0.159508 31.846 0 31.4164 0 30.9684C0 20.2703 10.9612 20.2703 15.6445 20.2703C20.3278 20.2703 31.289 20.2703 31.289 30.9684C31.2838 31.4146 31.1226 31.8408 30.8398 32.1564C30.557 32.4719 30.1749 32.6517 29.775 32.6576Z"
                            fill="#729AC6"/>
                    </svg>
                </div>
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