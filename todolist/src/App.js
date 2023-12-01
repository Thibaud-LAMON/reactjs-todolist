import "bootstrap/dist/css/bootstrap.css"; //npm install bootstrap
import { useRef, useMemo, forwardRef } from "react";
//import { withContext } from "./context"; //on importe withContext
import { useAppContext } from "./context"; //remplace le HOC
import "./App.css";
import { v4 as uuid } from "uuid"; //on a installé uuid qui génère une suite de chiffres et lettres pour créer un id unique

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

//Le formulaire est maintenant un composant
// on passe à une fonction fléchée
const Form = forwardRef(() => {
  //les fonctions de changement d'état sont passée en prop
  //forwardRef permet de transmettre à un composant enfant cette référence

  //permet d'accéder à un noeud du DOM pour le mettre à jour
  const ref = useRef();

  //on doit importer le hook personnalisé
  const { state, dispatch } = useAppContext(); //plus besoin de props

  //handleOnChange peut être refactoré pour être géré à partir du formulaire
  //Fonctions de changement d'état
  const handleOnChange = (e) =>
    dispatch({ type: "change", payload: { value: e.target.value } });

  //handleOnSubmit peut être refactoré pour être géré à partir du formulaire
  //Quand le formulaire est éxécuté ...
  const handleOnSubmit = (e) => {
    e.preventDefault(); //On ne réactualise pas l'appli
    //s'il y a une valeur pour l'input
    if (isValid) {
      dispatch({
        type: "submit",
        payload: { item: { id: uuid(), content: state.input, done: false } },
      });
      ref.current.value = null;
    }
  };

  //handleOnSubmit et isValid doivent être au même niveau d'arborescence
  const isValid = useMemo(() => {
    //y'a-t-il une valeur pour input ?
    return !!state.input;
  }, [state.input]); //les actions étant distribuées par useReducer, il faut référencer le state.input
  return (
    <form className="input-group mb-3" onSubmit={onSubmit}>
      {/* le formulaire contient un input et un bouton "Ajouter", onSubmit se gère dans le form */}
      <input
        ref={ref}
        type="text"
        className="form-control form-control-lg mx-0"
        placeholder="Add new..."
        style={{ height: "max-content" }}
        //onChange={onChange} // onChange se gère dans l'input
        onChange={handleOnChange} //on change la référence
      />
      <button type="submit" className="btn btn-info">
        Ajouter
      </button>
    </form>
  );
});

//Ce composant permet d'afficher les différents filtres
function Filters() {
  const { dispatch } = useAppContext();
  const handleOnSelect = (e) => {
    dispatch({ type: "select", payload: { option: e.target.value } }); //le payload prend la valeur qu'avait onSelect (la valeur de l'option)
  };
  const options = ["All", "Completed"]; //liste des filtres
  return (
    <div className="d-flex justify-content-end align-items-center my-3 ">
      <select
        onChange={handleOnSelect}
        className="select form-select form-control form-control-sm"
      >
        {/*afficher la liste des filtres*/}
        {options.map((option) => (
          <option key={option} value={option}>
            {/*attribut key nécessaire*/}
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

//Ce composant affiche un item dans la liste
function Item({ id, content, done }) {
  const { dispatch } = useAppContext();
  //on récupère les propriétés de chaque item dans items
  const handleOnCheck = (e) => {
    //n'aura lieu qu'en cas de case cochée
    dispatch({ type: "check", payload: { id, bool: e.target.checked } }); //l'id étant déjà récupéré comme prop, on ne tramsmet que l'info du booléen originellement retournée par toggleCheck (la valeur de l'élément coché à partir de e.target.checked)
  };
  const isDone = done ? "mx-3 item-done" : "mx-3"; //si done = true, isDone sera égal aux classes "mx-3 item-done" sinon seulement à "mx-3"
  return (
    <li className="list-group-item">
      <input
        className="form-check-input"
        type="checkbox"
        aria-label="..."
        checked={done}
        onChange={handleOnCheck}
      />
      {/* on vérifie si la tâche est faite avec checked={done} */}
      <span className={isDone}>{content}</span>
      {/* ici on a le contenu */}
    </li>
  );
}

//La liste des objets est un composant affichant une liste de compostants "Item"
function List() {
  //les fonctions de changement d'état sont passée en prop

  const { state } = useAppContext(); //on récupère state
  //on transmet d'abord onCheck au composant le plus élevé, puis aux composants qui en découlent (Item)
  return (
    <ul className="list-group">
      {/* liste non-ordonnée */}
      {state.items.map((item) => (
        //on fait correspondre le prop items...
        <Item key={item.id} {...item} /> //... et on le destructure //on retire le onCheck, c'est du code mort
      ))}
    </ul>
  );
}

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

export default withContext(App); //on enveloppe App avec le HOC
//l'application ne peut pas encore fonctionner correctement du fait de l'absence de key chez les différentes entrées de la liste
