import './fileuploader.css';
import {FileUpload} from "primereact/fileupload";

const FileUploader = ({props}) => {
    return (
        <>
            {props.label != undefined ?
                <label htmlFor={props.id}
                       className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
            <FileUpload mode={props.mode} accept="image/*" customUpload={props.customUpload}
                        uploadHandler={props.uploadHandler} className={`fileuploader ${props.className}`}/>
        </>
    );
}


export default FileUploader;