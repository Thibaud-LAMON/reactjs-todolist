//On réimporte les dépendances
import { useRef, useMemo } from "react";
import { v4 as uuid } from "uuid"; //on a installé uuid qui génère une suite de chiffres et lettres pour créer un id unique
//import { withContext } from "./../context"; //on importe withContext
import { useAppContext } from "./../context"; //remplace le HOC

//Le formulaire est maintenant un composant
// on passe à une fonction fléchée
const Form = () => {
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
    <form className="input-group mb-3" onSubmit={handleOnSubmit}>
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
};

export default Form;
