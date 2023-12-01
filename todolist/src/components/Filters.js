//Select() est déplacée dans son fichier propre

//On réimporte les dépendances

//import { withContext } from "./../context"; //on importe withContext
import { useAppContext } from "./../context"; //remplace le HOC

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
export default Filters; //on exporte
