import './basepage.css';
import {Outlet} from "react-router-dom";
/*Página base de contenidos. En esta página se añadirán las rutas a diferentes páginas de contenido.
* Es el componente base que se añade a ContentLayout
* */


const BasePage = (props) => {


    return (
        <div className="basepage">
            <Outlet/>
        </div>);
}


export default BasePage;