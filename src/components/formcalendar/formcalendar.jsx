import './formcalendar.css';
import {Calendar} from "primereact/calendar";
import {useTranslation} from "react-i18next";

const FormCalendar = ({props})=> {

    return (
      <>
          {props.label != undefined ?
                <label htmlFor={props.id} className={`calendar-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
          <Calendar id={props.id} value={props.value} onChange={props.onChange} dateFormat={props.dateFormat} view={props.view}
                    placeholder={props.placeholder} className={`formcalendar  ${props.className} ${props.classNameError}`} showIcon
                    disabled={props.disabled}/>
      </>);
}


export default FormCalendar;