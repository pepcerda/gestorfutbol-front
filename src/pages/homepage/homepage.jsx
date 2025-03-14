import './homepage.css';

const HomePage = ({props})=> {
   return (
      <div>
         HomePage + {process.env.NODE_ENV} + {process.env.REACT_APP_KINDE_REDIRECT_URL}
      </div>);
}


export default HomePage;