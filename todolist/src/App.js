import "bootstrap/dist/css/bootstrap.css";
//npm install bootstrap
import { useState, useRef, useMemo, forwardRef, useReducer } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";
//on a installé uuid qui génère une suite de chiffres et lettres pour créer un id unique

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
const Form = forwardRef(({ onSubmit, onChange }, ref) => {
  //les fonctions de changement d'état sont passée en prop
  //forwardRef permet de transmettre à un composant enfant cette référence
  return (
    <form className="input-group mb-3" onSubmit={onSubmit}>
      {/* le formulaire contient un input et un bouton "Ajouter", onSubmit se gère dans le form */}
      <input
        ref={ref}
        type="text"
        className="form-control form-control-lg mx-0"
        placeholder="Add new..."
        style={{ height: "max-content" }}
        onChange={onChange} // onChange se gère dans l'input
      />
      <button type="submit" className="btn btn-info">
        Ajouter
      </button>
    </form>
  );
});

//Ce composant permet d'afficher les différents filtres
function Filters({ onSelect }) {
  const options = ["All", "Completed"]; //liste des filtres
  const select = (e) => onSelect(e.target.value); //on récupère la valeur de l'option
  return (
    <div className="d-flex justify-content-end align-items-center my-3 ">
      <select
        onChange={select}
        className="select form-select form-control form-control-sm"
      >
        {options.map(
          (
            option //afficher la liste des filtres
          ) => (
            <option value={option}>{option}</option>
          )
        )}
      </select>
    </div>
  );
}

//Ce composant affiche un item dans la liste
function Item({ id, content, done, onCheck }) {
  const isDone = done ? "mx-3 item-done" : "mx-3"; //si done = true, isDone sera égal aux classes "mx-3 item-done" sinon seulement à "mx-3"
  //on récupère les propriétés de chaque item dans items
  const toggleCheck = (e) => onCheck(id, e.target.checked); //on récupère la valeur de l'élément coché à partir de e.target.checked
  return (
    <li className="list-group-item">
      <input
        className="form-check-input"
        type="checkbox"
        aria-label="..."
        checked={done}
        onChange={toggleCheck}
      />
      {/* on vérifie si la tâche est faite avec checked={done} */}
      <span className={isDone}>{content}</span>
      {/* ici on a le contenu */}
    </li>
  );
}

//La liste des objets est un composant affichant une liste de compostants "Item"
function List({ items, onCheck }) {
  //les fonctions de changement d'état sont passée en prop
  //on transmet d'abord onCheck au composant le plus élevé, puis aux composants qui en découlent (Item)
  return (
    <ul className="list-group">
      {/* liste non-ordonnée */}
      {items.map((item) => (
        //on fait correspondre le prop items...
        <Item key={item.id} {...item} onCheck={onCheck} /> //... et on le destructure
      ))}
    </ul>
  );
}

function App() {
  //on déplace aussi le useReducer
  const ref = useRef(); //on créer une ref pour accéder au noeud du DOM

  //Fonctions de changement d'état
  const handleOnChange = (e) =>
    dispatch({ type: "change", payload: { value: e.target.value } });
  const handleOnSubmit = (e) => {
    //quand le formulaire est éxécuté ...
    e.preventDefault(); //On ne réactualise pas l'appli
    /*if (!input) {
      //Si l'input est vide, le formulaire ne retourne rien
      return false;
    }*/
    //s'il y a une valeur pour l'input
    if (isValid) {
      dispatch({
        type: "submit",
        payload: { item: { id: uuid(), content: state.input, done: false } },
      });
      /*
      setItems([{ id: uuid(), content: input, done: false }, ...items]); // le nouvel objet sera en haut de la liste, son id est généré par uuid, son contenu est celui de l'input et done est false par défaut
      setAll([{ id: uuid(), content: input, done: false }, ...items]); 
      setInput(null); //le formulaire est vidé après envoi
      */
      ref.current.value = null; //supprime la valeur après l'envoi du formulaire
    }
  };
  const handleOnCheck = (id, bool) => {
    //n'aura lieu qu'en cas de case cochée
    dispatch({
      type: "check",
      payload: { id, bool },
    });
  };
  const handleOnSelect = (option) => {
    dispatch({
      type: "select",
      payload: { option },
    });
  };

  const isValid = useMemo(() => {
    //y'a-t-il une valeur pour input ?
    return !!state.input;
  }, [state.input]); //les actions étant distribuées par useReducer, il faut référencer le state.input
  return (
    <Container title="Gestionnaire de tâches">
      <Form ref={ref} onChange={handleOnChange} onSubmit={handleOnSubmit} />
      <Filters onSelect={handleOnSelect} />
      <List items={state.items} onCheck={handleOnCheck} />
    </Container>
  );
}

export default App;
//l'application ne peut pas encore fonctionner correctement du fait de l'absence de key chez les différentes entrées de la liste
