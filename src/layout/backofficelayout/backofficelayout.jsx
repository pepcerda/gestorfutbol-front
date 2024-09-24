import './backofficelayout.css';
import HeaderBar from "../headerbar/headerbar";
import Navbar from "../navbar/navbar";
import ContentLayout from "../contentlayout/contentlayout";

const BackofficeLayout = ({props})=> {
   return (
      <div>
          <HeaderBar></HeaderBar>
          <div className="main-layout">
              <Navbar></Navbar>
              <ContentLayout></ContentLayout>
          </div>
      </div>);
}


export default BackofficeLayout;