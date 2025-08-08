import './datacard.css';
import {Card} from "primereact/card";

const DataCard = ({props}) => {


    return (
        <Card className={props.className} unstyled={props.unstyled} title={props.title} results={props.results}
              onClick={props.onClick} header={props.header} id={props.id} footer={props.footer}>
            {props.content}
        </Card>
    );
}


export default DataCard;