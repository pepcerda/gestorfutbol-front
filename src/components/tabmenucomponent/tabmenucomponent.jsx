import './tabmenucomponent.css';
import {TabMenu} from "primereact/tabmenu";

const TabMenuComponent = ({props})=> {

   return (
       <TabMenu model={props.model} onTabChange={props.onTabChange} activeIndex={props.activeIndex} className="tabmenucomponent"></TabMenu>
   );
}


export default TabMenuComponent;