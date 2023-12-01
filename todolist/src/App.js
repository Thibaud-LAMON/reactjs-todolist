import "bootstrap/dist/css/bootstrap.css"; //npm install bootstrap
import "./App.css";
import Filters from "./components/Filters";
import Form from "./components/Form";
import List from "./components/List";

//On déplace le reducer et l'initial state dans contexte

const Container = ({ children, title }) => {
  return (
    <div className="container py-3">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col">
          <div className="card" id="list1" style={{ borderRadius: ".15rem" }}>
            <div className="card-body py-4 px-4 px-md-5">
              <h1 className="text-info mb-3">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//plus besoin d'invoquer le contexte des composants
function App() {
  //on déplace aussi le useReducer
  //plus besoin d'invoquer le contexte des composants
  return (
    <Container title="Gestionnaire de tâches">
      <Form />
      <Filters />
      <List />
    </Container>
  );
}

export default App; //plus besoin d'envelopper App avec le HOC maintenant qu'on a useAppContext()
