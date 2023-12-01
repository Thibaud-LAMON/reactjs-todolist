// ici on importe List() et Item()

//On réimporte les dépendances
//import { withContext } from "./../context"; //on importe withContext
import { useAppContext } from "./../context"; //remplace le HOC

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

export default List; //Item n'étant utilisé que dans le contexte de List, on exporte seulement List
