import './forminputnumber.css';
import {InputNumber} from "primereact/inputnumber";

const FormInputNumber = ({props}) => {
    return (<>
        {props.label != undefined ?
            <label htmlFor={props.id} className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
            : <></>}
        <InputNumber id={props.id} aria-describedby={props.ariadescribedby}
                     className={`form-inputnumber mx-auto mx-md-0 p-0 ${props.className} ${props.classNameError}`}
                     placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange}
                     keyfilter={props.keyfilter} onInput={props.onInput} validateOnly={props.validateOnly}
                     mode={props.mode} currency={props.currency}/>
    </>);
}


export default FormInputNumber;