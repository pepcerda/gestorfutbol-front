import './protectedpage.css';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import EntryPage from "../entrypage/entrypage";
import BackofficePage from "../backofficepage/backofficepage";

const ProtectedPage = ({props}) => {

    const {isLoading, isAuthenticated, login} = useKindeAuth();
    const {t, i18n} = useTranslation("common");

    if (isLoading) {
        return <div>{t('t.loading')}</div>;
    }

    if (!isLoading && !isAuthenticated) {
        console.log(isAuthenticated, isLoading);
        return (
            <EntryPage/>
        )
    }
    if (!isLoading && isAuthenticated) {
        return (
            <Outlet/>
        );
    }

}


export default ProtectedPage;