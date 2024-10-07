import './backofficepage.css';
import HeaderBar from "../../layout/headerbar/headerbar";
import ContentLayout from "../../layout/contentlayout/contentlayout";
import Navbar from "../../layout/navbar/navbar";

const BackofficePage = ({props})=> {
   return (
       <>
           <HeaderBar></HeaderBar>
           <div className="main-layout">
               <Navbar></Navbar>
               <ContentLayout></ContentLayout>
           </div>
       </>);
}


export default BackofficePage;