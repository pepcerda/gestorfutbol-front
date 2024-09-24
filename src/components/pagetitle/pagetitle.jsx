import './pagetitle.css';

const PageTitle = ({props})=> {

   return (
       <h3 className="pagetitle">{props.title.toUpperCase()}</h3>
      );
}


export default PageTitle;