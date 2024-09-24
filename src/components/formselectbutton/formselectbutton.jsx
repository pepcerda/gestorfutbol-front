import './formselectbutton.css';
import {SelectButton} from "primereact/selectbutton";

const FormSelectButton = ({props}) => {
    return (
        <>
            <SelectButton value={props.value} onChange={props.onChange} optionLabel={props.optionLabel}
                          options={props.options} className={`formselectbutton ${props.className} ${props.classNameError}`}
                          optionValue={props.optionValue}
                          allowEmpty={props.allowEmpty}/>
        </>
    );
}


export default FormSelectButton;