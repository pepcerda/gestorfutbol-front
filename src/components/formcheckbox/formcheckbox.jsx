import './formcheckbox.css';
import {Checkbox} from "primereact/checkbox";

const FormCheckbox = ({props}) => {
    return (<>
        {props.label != undefined ?
            <label htmlFor={props.id} className={`checkbox-label mb-2 ${props.labelClassName}`}>{props.label}</label>
            : <></>}
        <Checkbox id={props.id} checked={props.checked} disabled={props.disabled}
                  className={`form-checkbox ${props.className} ${props.classNameError}`}
                  placeholder={props.placeholder} value={props.value} onChange={props.onChange}
                  keyfilter={props.keyfilter} onInput={props.onInput} validateOnly={props.validateOnly}/>
    </>);
}


export default FormCheckbox;