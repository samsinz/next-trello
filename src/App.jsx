import { useEffect, useRef, useState } from "react";
import trelloLogo from "./assets/trello.png";
import "./App.css";
import List from "./components/List";
import CardInfo from "./components/CardInfo";

// App component, renders main page
function App() {
  // declare original data for testing purposes
  const originalContent = [
    {
      name: "My first list",
      content: [
        {
          name: "My first card",
          followed: false,
          description: "",
        },
        {
          name: "My second card",
          followed: false,
          description: "",
        },
        {
          name: "Followed card",
          followed: true,
          description: "",
        },
      ],
    },
    {
      name: "My second list",
      content: [
        {
          name: "Followed card with description",
          followed: true,
          description: "My first description",
        },
      ],
    },
  ];

  // lists state, contains original and modified data
  const [lists, setLists] = useState(originalContent);

  // showForm state, controls the display of add list form
  const [showForm, setShowForm] = useState(false);

  // cardContent state, holds information regarding a selected card
  const [cardContent, setCardContent] = useState(null);

  // cardParentList state, holds information regarding a selected card's parent list
  const [cardParentList, setCardParentList] = useState(null);

  // holds ref to form, to deal with clicks outside of form and reset showForm state
  const ref = useRef(null);
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowForm(false);
    }
  };

  // reset data button handler
  const resetData = (e) => {
    e.preventDefault();
    setLists(originalContent);
  };

  // shows form when user clicks on button to show form
  const handleAdd = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  // adds a list to lists state when user enters a new name
  const addList = (e) => {
    e.preventDefault();
    if (e.target.name.value.length) {
      setShowForm(!showForm);
      setLists((currentValue) => [...currentValue, { name: e.target.name.value, content: [] }]);
    }
  };

  // declare card details modal and functions to open/close
  const cardInfo = useRef();

  const showCardInfo = () => {
    cardInfo.current.showModal();
  };

  const closeCardInfo = () => {
    cardInfo.current.close();
  };

  // add an envent listener when loading, handle clicks outside of ref
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="App">
      <div className="top-bar">
        <img src={trelloLogo} alt="logo" />
      </div>
      <div className="body">
        <div className="title">
          <h1>Tableau principal</h1>
          <form onClick={resetData}>
            <button className="green-button">Initialiser le jeu de données</button>
          </form>
        </div>
        <div className="list-container">
          {lists.map((list) => {
            return (
              <div key={list.name}>
                <List list={list} setLists={setLists} showCardInfo={showCardInfo} setCardContent={setCardContent} setCardParentList={setCardParentList} />
              </div>
            );
          })}
          {!showForm ? (
            <form className="add-list" onClick={handleAdd}>
              <span className="plus">+</span>
              <button>
                <span>Ajouter une autre liste</span>
              </button>
            </form>
          ) : (
            showForm && (
              <form className="add-list-form" onSubmit={addList} ref={ref}>
                <input autoFocus type="text" placeholder="Saisissez le titre de la liste..." name="name" />
                <div>
                  <button className="green-button">
                    <span>Ajouter une liste</span>
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
      </div>

      <dialog ref={cardInfo}>
        <CardInfo
          closeCardInfo={closeCardInfo}
          cardContent={cardContent}
          setCardContent={setCardContent}
          cardParentList={cardParentList}
          setLists={setLists}
          lists={lists}
        />
      </dialog>
    </div>
  );
}

export default App;
