import './colorpickerinput.css';
import {ColorPicker} from "primereact/colorpicker";

const ColorPickerInput = ({props}) => {
    return (
        <>
            {props.label != undefined ?
                <label htmlFor={props.id}
                       className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
            <ColorPicker inputId={props.id} format={props.format} value={props.value}
                         onChange={props.onChange} className={`colorpickerinput mb-3 ${props.labelClassName}`} inline={props.inline}/>
        </>

    );
}


export default ColorPickerInput;