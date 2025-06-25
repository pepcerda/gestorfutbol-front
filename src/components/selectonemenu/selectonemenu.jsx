import './selectonemenu.css';
import {Dropdown} from "primereact/dropdown";


const SelectOneMenu = ({props}) => {
    return (<>

        {props.label != undefined ?
            <label htmlFor={props.id}
                   className={`selectonemenu-label mb-2 ${props.labelClassName}`}>{props.label}</label>
            : <></>}
        <Dropdown id={props.id} aria-describedby={props.ariadescribedby}
                  className={`selectonemenu form-control mx-auto mx-md-0 ${props.className} ${props.classNameError}`}
                  panelClassName="selectonemenu-panel"
                  value={props.value} options={props.options} optionLabel={props.optionLabel}
                  optionValue={props.optionValue} onChange={props.onChange} keyfilter={props.keyfilter}
                  placeholder={props.placeholder} disabled={props.disabled}/>
    </>);
}


export default SelectOneMenu;