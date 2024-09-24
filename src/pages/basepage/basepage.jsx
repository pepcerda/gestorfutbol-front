import './basepage.css';
import {Route, Routes, Switch} from "react-router-dom";
/*Página base de contenidos. En esta página se añadirán las rutas a diferentes páginas de contenido.
* Es el componente base que se añade a ContentLayout
* */


const BasePage = (props) => {


    return (
        <div className="basepage">
            <div className="content">
                <Routes>
                    {/*Ejemplo de rutas*/}
                    {/*<Route path={"/"} element={<HomePage/>}></Route>
                    <Route path={"/home"} element={<HomePage/>}></Route>
                    <Route path={"/"} element={<ProtectedPage/>}>
                        <Route path={"calendar"} element={<CalendarPage/>}></Route>
                        <Route path={"trips"} element={<TripsPage/>}></Route>
                        <Route path={"trip"}>
                            <Route path={":id"} element={<TripDetailPage/>}></Route>
                            <Route path={"new"} element={<TripDetailPage/>}></Route>
                        </Route>
                        <Route path={"species"} element={<SpeciesPage/>}></Route>
                        <Route path={"configuration"} element={<ConfigurationPage/>}></Route>
                    </Route>*/}
                </Routes>
            </div>
        </div>);
}


export default BasePage;