import "./memberspage.css";
import { useTranslation } from "react-i18next";
import { createContext, useContext, useEffect, useState } from "react";
import FormCheckbox from "../../components/formcheckbox/formcheckbox";
import { gestorfutbolService } from "../../services/mock/gestorfutbolService";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import PageTitle from "../../components/pagetitle/pagetitle";
import BasicButton from "../../components/basicbutton/basicbutton";
import TableComponent from "../../components/tablecomponent/tablecomponent";
import { Dialog } from "primereact/dialog";
import SelectOneMenu from "../../components/selectonemenu/selectonemenu";
import FormInputText from "../../components/forminputtext/forminputtext";

const MemberContext = createContext();

const MemberDataForm = ({ props }) => {
  const { t, i18n } = useTranslation("common");
  const { selectedMember, setSelectedMember, formikMember } =
    useContext(MemberContext);

  const [selectCheck, setSelectedCheck] = useState(null);
  const opcionsPagament = [
    { nom: `${t("t.pending.payment")}`, valor: 'D' },
    { nom: `${t("t.payed")}`, valor: 'P' },
  ];

  const isFormFieldInvalid = (name) =>
    !!(formikMember.touched[name] && formikMember.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="form-text-invalid">{formikMember.errors[name]}</small>
    ) : (
      <small className="form-text-invalid">&nbsp;</small>
    );
  };

  const nomProps = {
    id: "nom",
    label: `${t("t.nom")}`,
    value: formikMember.values.nom,
    onChange: (e) => {
      formikMember.setFieldValue("nom", e.target.value);
    },
    classNameError: `${isFormFieldInvalid("nom") ? "invalid-inputtext" : ""}`,
    labelClassName: `${isFormFieldInvalid("nom") ? "form-text-invalid" : ""}`,
  };

  const llinatge1Props = {
    id: "llinatge1",
    label: `${t("t.llinatge1")}`,
    value: formikMember.values.llinatge1,
    onChange: (e) => {
      formikMember.setFieldValue("llinatge1", e.target.value);
    },
    classNameError: `${
      isFormFieldInvalid("llinatge1") ? "invalid-inputtext" : ""
    }`,
    labelClassName: `${
      isFormFieldInvalid("llinatge1") ? "form-text-invalid" : ""
    }`,
  };

  const llinatge2Props = {
    id: "llinatge2",
    label: `${t("t.llinatge2")}`,
    value: formikMember.values.llinatge2,
    onChange: (e) => {
      formikMember.setFieldValue("llinatge2", e.target.value);
    },
  };

  const patrocinadorProps = {
    id: "patrocinador",
    label: `${t("t.sponsor")}`,
    value: formikMember.values.patrocinador,
    checked: formikMember.values.patrocinador,
    onChange: (e) => {
      formikMember.setFieldValue("patrocinador", e.checked);
    },
  };

  const estatPagamentProps = {
    id: "estat_pagament",
    label: `${t("t.payment.state")}`,
    value: formikMember.values.estat_pagament,
    onChange: (e) => {
        formikMember.setFieldValue("estat_pagament", e.value);
    },
    options: opcionsPagament,
    optionLabel: 'nom',
    optionValue: "valor"
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={nomProps}></FormInputText>
          {getFormErrorMessage("nom")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={llinatge1Props}></FormInputText>
          {getFormErrorMessage("llinatge1")}
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <FormInputText props={llinatge2Props}></FormInputText>
        </div>
        <div className="col-12 col-md-6 form-group text-center text-md-start mt-3 mt-md-0">
          <SelectOneMenu props={estatPagamentProps}></SelectOneMenu>
          {getFormErrorMessage("estat_pagament")}
        </div>
        <div className="col-12 col-md-6 form-group d-flex align-items-center align-items-md-start flex-column mt-3">
          <FormCheckbox props={patrocinadorProps}></FormCheckbox>
        </div>
        
      </div>
    </>
  );
};

const MembersPage = ({ props }) => {
  let emptyMember = {
    nom: "",
    llinatge1: "",
    llinatge2: "",
    patrocinador: false,
    estat_pagament: null,
  };

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(emptyMember);
  const { t, i18n } = useTranslation("common");
  const [totalRecords, setTotalRecords] = useState(0);
  const [captureDialog, setCaptureDialog] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortOrder: null,
    sortField: null,
  });

  const patrocinadorBodyTemplate = (member) => {
    const checkBoxTaula = {
      checked: member.patrocinador,
      disabled: true,
    };

    return <FormCheckbox props={checkBoxTaula}></FormCheckbox>;
  };

  const tableColumns = [
    { field: "id", header: `${t("t.id")}` },
    { field: "nom", header: `${t("t.nom")}` },
    { field: "llinatge1", header: `${t("t.llinatge1")}` },
    { field: "llinatge2", header: `${t("t.llinatge2")}` },
    {
      field: "patrocinador",
      header: `${t("t.sponsor")}`,
      body: patrocinadorBodyTemplate,
    },
    { field: "estat_pagament", header: `${t("t.payment.state")}` },
  ];

  const accept = () => {
    gestorfutbolService.deleteCampaign(selectedMember.id);
    setDeleteFlag(true);
  };

  const reject = () => {
    setDeleteFlag(false);
  };

  const confirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: `${t("t.confirm.delete")}`,
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const deleteButton = {
    icon: "pi pi-trash",
    className: "circular-btn",
    disabled: selectedMember === null,
    onClick: confirm,
  };

  const newButton = {
    icon: "pi pi-plus",
    className: "circular-btn",
    onClick: () => {
      formikMember.resetForm();
      setCaptureDialog(true);
    },
  };

  useEffect(() => {
    loadLazyData();
    setDeleteFlag(false);
  }, [lazyState, deleteFlag]);

  const loadLazyData = () => {
    var apiFilter = {
      pageNum: lazyState.page,
      pageSize: lazyState.rows,
    };
    gestorfutbolService.getMembers(apiFilter).then((data) => {
      setTotalRecords(data.data.total);
      let results = data.data.results;
      setMembers(results);
    });
  };

  const tableProps = {
    data: members,
    selectedData: selectedMember,
    onChangeSelectedDataEvent: (e) => {
      if (e.value != null) {
        setSelectedMember(e.value);
      }
    },
    onRowUnselect: () => {
      setSelectedMember(emptyMember);
    },
    columns: tableColumns,
    rows: lazyState.rows,
    rowsPerPageOptions: [5, 10, 25, 50],
    breakpoint: "900px",
    lazy: true,
    onPage: (e) => setlazyState(e),
    totalRecords: totalRecords,
    first: lazyState.first,
    onSort: (e) => setlazyState(e),
    sortOrder: lazyState.sortOrder,
    sortField: lazyState.sortField,
  };

  const saveMember = (data) => {
    gestorfutbolService.newMember(data);
    setCaptureDialog(false);
  };

  const hideDialog = () => {
    setCaptureDialog(false);
    console.log(selectedMember)
  };

  const cancelFormButton = {
    icon: "pi pi-times",
    className: "basicbutton-outlined me-2",
    label: `${t("t.cancel")}`,
    type: 'button',
    onClick: hideDialog,
  };

  const saveFormButton = {
    icon: "pi pi-check",
    label: `${t("t.save")}`,
    type: "submit",
  };

  const formikMember = useFormik({
    initialValues: {
      nom: selectedMember.nom,
      llinatge1: selectedMember.llinatge1,
      llinatge2: selectedMember.llinatge2,
      patrocinador: selectedMember.patrocinador,
      estat_pagament: selectedMember.estat_pagament,
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.nom) {
        errors.nom = t("t.empty.field");
      }
      if (!data.llinatge1) {
        errors.llinatge1 = t("t.empty.field");
      }
      if(!data.llinatge2) {
      }
      if(!data.patrocinador) {

      }
      if (!data.estat_pagament) {
        errors.estat_pagament = t("t.empty.field");
      }
      return errors;
    },
    onSubmit: (data) => {
      saveMember(data);
    },
  });

  return (
    <div className="container p-2 p-xl-4">
      <ConfirmPopup />
      <PageTitle props={{ title: `${t("t.members")}` }}></PageTitle>
      <div className="row gap-3 justify-content-center justify-content-xl-end">
        <BasicButton props={newButton}></BasicButton>
        {/*           <BasicButton props={editButton}></BasicButton>*/}
        <BasicButton props={deleteButton}></BasicButton>
      </div>
      <div className="row mt-3">
        <TableComponent props={tableProps}></TableComponent>
      </div>
      <Dialog
        visible={captureDialog}
        header={t("t.new.member").toUpperCase()}
        onHide={hideDialog}
      >
        <form onSubmit={formikMember.handleSubmit}>
          <MemberContext.Provider
            value={{ selectedMember, setSelectedMember, formikMember }}
          >
            <MemberDataForm />
          </MemberContext.Provider>
          <div className="p-dialog-footer pb-0 mt-5">
            <BasicButton props={cancelFormButton} />
            <BasicButton props={saveFormButton} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default MembersPage;
