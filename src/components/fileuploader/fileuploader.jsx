import './fileuploader.css';
import {FileUpload} from "primereact/fileupload";

const FileUploader = ({props}) => {
    return (
        <>
            {props.label != undefined ?
                <label htmlFor={props.id}
                       className={`inputtext-label mb-2 ${props.labelClassName}`}>{props.label}</label>
                : <></>}
            <FileUpload mode={props.mode} accept={props.accept} customUpload={props.customUpload}
                        uploadHandler={props.uploadHandler} className={`fileuploader ${props.className}`}
                        onProgress={props.onProgress} onUpload={props.onUpload}
                        auto={props.auto} uploadLabel={props.uploadLabel} chooseLabel={props.chooseLabel} disabled={props.disabled}/>
        </>
    );
}


export default FileUploader;