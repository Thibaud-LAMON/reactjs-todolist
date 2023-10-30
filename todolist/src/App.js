import { useState } from "react";
import "./App.css";

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

function Form() {
  //Le formulaire est maintenant un composant
  return (
    <form className="input-group mb-3">
      {/* le formulaire contient un input et un bouton "Ajouter" */}
      <input
        type="text"
        className="form-control form-control-lg mx-0"
        placeholder="Add new..."
        style={{ height: "max-content" }}
      />
      <button type="button" className="btn btn-info">
        Ajouter
      </button>
    </form>
  );
}

function Filters() {
  //Ce composant permet d'afficher les différents filtres
  return (
    <div className="d-flex justify-content-end align-items-center my-3 ">
      <select className="select form-select form-control form-control-sm">
        {/* liste de filtres */}
        <option value="1">All</option>
        <option value="2">Completed</option>
        <option value="3">Active</option>
        <option value="4">Has due date</option>
      </select>
    </div>
  );
}

//on récupère les propriétés de chaque item dans items
function Item({ id, content, done }) {
  //Ce composant affiche un item dans la liste
  return (
    <li className="list-group-item">
      <input
        className="form-check-input"
        type="checkbox"
        aria-label="..."
        checked={done}
      />
      {/* on vérifie si la tâche est faite avec checked={done} */}
      <span className="mx-3">{content}</span>
      {/* ici on a le contenu */}
    </li>
  );
}

function List({ items }) {
  //La liste des objets est un composant affichant une liste de compostants "Item"
  return (
    <ul className="list-group">
      {/* liste non-ordonnée */}
      {items.map((item) => (
        //on fait correspondre le prop items...
        <Item {...item} /> //... et on le destructure
      ))}
    </ul>
  );
}

function App() {
  const [items] = useState([
    { id: 1, content: "pay bills", done: false },
    { id: 2, content: "learn React", done: false },
  ]);
  return (
    <Container title="Gestionnaire de tâches">
      <Form />
      <Filters />
      <List items={items} />
    </Container>
  );
}

export default App;
//l'application ne peut pas encore fonctionner correctement du fait de l'absence de key chez les différentes entrées de la liste
