import './forminputtext.css';
import {InputText} from "primereact/inputtext";

const FormInputText = ({props}) => {
    return (

        <>
            {props.label != undefined ?
                <label htmlFor={props.id} className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
            <InputText id={props.id} aria-describedby={props.ariadescribedby}
                       className={`form-control form-inputtext mx-auto mx-md-0 ${props.className} ${props.classNameError}`}
                       placeholder={props.placeholder} value={props.value} onChange={props.onChange}
                       keyfilter={props.keyfilter} onInput={props.onInput} validateOnly={props.validateOnly} disabled={props.disabled}/>
        </>);
}


export default FormInputText;