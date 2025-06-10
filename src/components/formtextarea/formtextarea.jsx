import './formtextarea.css';
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";

const FormTextArea = ({props})=> {
    return (

        <>
            {props.label != undefined ?
                <label htmlFor={props.id} className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
            <InputTextarea id={props.id} aria-describedby={props.ariadescribedby}
                       className={`form-control form-inputtext mx-auto mx-md-0 ${props.className} ${props.classNameError}`}
                       placeholder={props.placeholder} value={props.value} onChange={props.onChange}
                       keyfilter={props.keyfilter} onInput={props.onInput} validateOnly={props.validateOnly} disabled={props.disabled}/>
        </>);
}


export default FormTextArea;