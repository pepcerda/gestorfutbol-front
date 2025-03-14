import "./entrypage.css";
import logo from "../../resources/file.png";
import { useTranslation } from "react-i18next";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import BasicButton from "../../components/basicbutton/basicbutton";
import { useContext } from "react";
import { ViewWidthContext } from "../../App";

const Logo = () => {
  return <img src={logo} alt="Logo aplicación" className="logo p-0" />;
};

const Title = () => {
  return <h2 className="fw-bold">ATHLETIC CLUB MONTUIRI</h2>;
};

const EntryPage = ({ props }) => {
  const { isLoading, isAuthenticated, login } = useKindeAuth();
  const { t, i18n } = useTranslation("common");
  const { viewWidth } = useContext(ViewWidthContext);

  const authButton = {
    label: `${t("t.autenticat")}`,
    onClick: () => {
      login();
    },
  };
  return (
    <div className="row gap-2 justify-content-center align-items-center align-content-center entrypage">
      <div className="entrypage-square d-flex flex-column flex-sm-row justify-content-center align-content-center gap-5">
        <div className="d-flex justify-content-center align-items-center pl-5">
          <Logo></Logo>
        </div>
        <div className="d-flex justify-content-center flex-column gap-3">
          {viewWidth <= 576 ? <></> : <Title></Title>}
          <BasicButton props={authButton}></BasicButton>
          {process.env.NODE_ENV} + {process.env.REACT_APP_KINDE_REDIRECT_URL}
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
