import './basicbutton.css';
import {Button} from "primereact/button";
import {useEffect} from "react";

const BasicButton = ({props}) => {

    return (
        <Button icon={props.icon} label={props.label} className={`basicbutton ${props.className}`} visible={props.visible}
                onClick={props.onClick} disabled={props.disabled} outlined={props.outlined} type={props.type} tooltip={props.tooltip} tooltipOptions={props.tooltipOptions}></Button>
    );
}


export default BasicButton;