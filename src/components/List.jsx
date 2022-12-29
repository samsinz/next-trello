import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import "./List.css";

// List component, renders a single list
const List = ({ list, setLists, showCardInfo, setCardContent, setCardParentList }) => {
  // showForm state, controls the display of add card form
  const [showForm, setShowForm] = useState(false);

  // holds ref to form, to deal with clicks outside of form and reset showForm state
  const ref = useRef(null);
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowForm(false);
    }
  };

  // shows form when user clicks on button to show form
  const handleAdd = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  // adds a card to current list in lists state when user enters a new name
  const addCard = (e) => {
    e.preventDefault();
    if (e.target.name.value.length) {
      setShowForm(!showForm);
      setLists((currentValue) => {
        [...currentValue][currentValue.indexOf(list)].content.push({ name: e.target.name.value, followed: false, description: "" });
        return currentValue;
      });
    }
  };

  // handle list removal
  const deleteList = (e) => {
    e.preventDefault();
    if (confirm(`Vous allez supprimer la liste nommée ${list.name}.\nAppuyer sur "OK" pour continuer.\nOu sur "Annuler" pour fermer.`)) {
      setLists((currentValue) => [...currentValue].filter((entry) => entry.name !== list.name));
    }
  };

  // add an envent listener when loading, handle clicks outside of ref
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="List">
      <div className="list-title">
        <div className="list-name">{list.name}</div>
        <form onClick={deleteList}>
          <button title="Supprimer cette liste">
            <div></div>
            <div></div>
            <div></div>
          </button>
        </form>
      </div>
      <div className="card-container">
        {list.content.map((card) => {
          return (
            <div key={card.name} className="Card">
              <Card card={card} showCardInfo={showCardInfo} setCardContent={setCardContent} setCardParentList={setCardParentList} parentList={list} />
            </div>
          );
        })}
      </div>
      {!showForm ? (
        <form className="add" onClick={handleAdd}>
          <div className="add-selector">
            <span className="plus">+</span>
            <button>
              <span>Ajouter une autre carte</span>
            </button>
          </div>
        </form>
      ) : (
        showForm && (
          <form className="add-form" onSubmit={addCard} ref={ref}>
            <textarea autoFocus name="name" id="name" cols="30" rows="10" placeholder="Saisissez un titre pour cette carte..."></textarea>
            <div>
              <button className="green-button">
                <span>Ajouter une carte</span>
              </button>
              <span
                className="cross"
                onClick={() => {
                  setShowForm(!showForm);
                }}
              ></span>
            </div>
          </form>
        )
      )}
    </div>
  );
};

export default List;
