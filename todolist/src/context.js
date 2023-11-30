//On commence par créer context.js
import { createContext, useReducer } from "react"; //on importe createContext

const Context = createContext(); //on le récupère
const { Provider, Consumer } = Context; //Context donne accès à Provider et Consumer
//Provider fournit les informations (valeurs globales) à tous les composants descendant du Provider

//on définit un état initial
const initialState = {
  items: [
    { id: 1, content: "pay bills", done: true },
    { id: 2, content: "learn React", done: false },
  ], //pour les résultats filtrés
  all: [
    { id: 1, content: "pay bills", done: true },
    { id: 2, content: "learn React", done: false },
  ], //pour la liste complête
  input: null,
};

//on définit une fonction Reducer. 2 params retournés : state et action(suite à l'action de distribuer)
//on y met toute la logique pour s'occuper de la gestion d'état de façon isolée et séparée.
function reducer(state, action) {
  //switch pour faire du contrôle de flux
  switch (action.type) {
    case "submit": //dans le cas de l'action submit
      return {
        ...state, //on copie l'état
        items: [...state.items, action.payload.item], //puis on màj items, pour cela on copie leur état, puis on rajoute un élément transmis en tant que payload
        all: [...state.items, action.payload.item],
        input: null,
      };
    case "change": //dans le cas de l'action change
      return {
        ...state,
        input: action.payload.value, //input correspond à value = e.target.value
      };
    case "check": //dans le cas de l'action check
      const updated = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, done: action.payload.bool }
          : item
      );
      //Pour chaque élément on retourne un tableau avec les éléments transformés.
      //On compare l'id de l'item avec l'id transmit en paramètre, si oui la valeur booléenne est mise à jour, sinon on renvoi l'item
      return {
        ...state,
        items: updated, //remplace setItems dans handleOnCheck
        all: updated, //remplace setAll dans handleOnCheck
      };
    case "select": //dans le cas de l'action select
      const filtered = state.items.filter((item) => !!item.done); //renvoie les item qui ont le statut done
      return {
        ...state,
        items: action.payload.option === "Completed" ? filtered : state.all, //remplace setItems dans handleOnSelect
      };
    default:
      throw new Error();
  }
}

//Nouveau composant
//Il va transmettre les éléments descendants, qui seront enveloppés par le provider
const AppProvider = ({ children }) => {
  //useReducer renvoie des valeurs sous forme de tableau
  //le tableau retourne l'état et un dispatch qui distribue les actions
  const [state, dispatch] = useReducer(reducer, initialState); //2 args: reducer = fonction qui fait les calculs des nouveaux states, initialState = valeur initalle
  //le useReducer est également déplacé
  //il retourne sous forme de tableau le state et le dispatch et on le transmet comme value au Provider
  return <Provider value={{ state, dispatch }}>{children}</Provider>; //Tout composant encapsulé par Provider est un enfant et aura accès aux valeurs globales
  //unique prop -> value
};

//prend en paramètre Component, on permet aussi la transmission de props
export const withContext = (Component) => (props) => {
  //Consumer est un composant récupéré à partir de l'objet Context
  //il retourne dans la value (valeur de l'objet Context) dans sa fonction de rappel
  //on transmet ensuite les infos de value au Component
  return <Consumer>{(value) => <Component {...value} {...props} />}</Consumer>; //on transmet les données de value et -s'il y en a- de props, que l'on déstructure
};

export default AppProvider; //permet d'envelopper le composant principal de l'appli
