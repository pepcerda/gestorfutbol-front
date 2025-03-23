import './homepage.css';

const HomePage = ({props})=> {
   return (
      <div>
         HomePage - ${process.env.REACT_APP_URL_BACK}
      </div>);
}


export default HomePage;