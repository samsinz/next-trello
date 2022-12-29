import { useEffect, useRef, useState } from "react";
import "./CardInfo.css";

// CardInfo component, renders a modal with details abotu a single card
const CardInfo = ({ closeCardInfo, cardContent, setCardContent, cardParentList, lists, setLists }) => {
  // card state, holds value of current card details
  const [card, setCard] = useState(cardContent);

  // change state, keeps track of changes to rerender
  const [change, setChange] = useState(false);

  // listIndex and cardIndex states, hold value of current card location in data
  const [listIndex, setListIndex] = useState(null);
  const [cardIndex, setCardIndex] = useState(null);

  // showForm state, controls the display of add card form
  const [showForm, setShowForm] = useState(false);

  // holds ref to form, to deal with clicks outside of form and reset showForm state
  const ref = useRef(null);
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowForm(false);
      closeCardInfo();
    }
  };

  // shows form when user clicks on button to show form
  const handleShowForm = (e) => {
    e.preventDefault();
    setShowForm(true);
  };

  // updates a card's description whenever the user submits the form
  const updateDescription = (e) => {
    e.preventDefault();
    setCardContent((currentCard) => {
      const newCard = currentCard;
      newCard.description = e.target.description.value;
      return newCard;
    });

    setLists((currentList) => {
      const newList = [...currentList];
      newList[listIndex].content[cardIndex] = cardContent;
      return newList;
    });

    setChange((current) => !current);
    setShowForm(false);
  };

  // updates a card's following state whenever the user clicks on button
  const handleFollow = (e) => {
    e.preventDefault();
    setCardContent((currentCard) => {
      const newCard = currentCard;
      newCard.followed = !newCard.followed;
      return newCard;
    });

    setLists((currentList) => {
      const newList = [...currentList];
      newList[listIndex].content[cardIndex] = cardContent;
      return newList;
    });

    setChange((current) => !current);
  };

  // handles card removal whenever the user clicks on button
  const deleteCard = (e) => {
    e.preventDefault();
    if (confirm(`Vous allez supprimer la carte nommée ${card.name}.\nAppuyer sur "OK" pour continuer.\nOu sur "Annuler" pour fermer.`)) {
      setLists((currentList) => {
        const newList = [...currentList];
        newList[listIndex].content.splice(cardIndex, 1);
        return newList;
      });
      closeCardInfo();
    }
  };

  // set card state when changes in cardContent or change state occur
  useEffect(() => {
    setCard(cardContent);
  }, [cardContent, change]);

  // hide form and initialize index states when changes in cardContent occur (when not null)
  useEffect(() => {
    setShowForm(false);
    if (cardParentList) {
      setListIndex(lists.indexOf(cardParentList));
      setCardIndex(lists[lists.indexOf(cardParentList)].content.indexOf(cardContent));
    }
  }, [cardContent]);

  // add an envent listener when loading, handle clicks outside of ref
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return card ? (
    <div className="CardInfo" ref={ref}>
      <div className="content">
        <span className="close" onClick={closeCardInfo}></span>
        <div className="top">
          <h3>{card.name}</h3>
          <div className="list-name">
            <span>
              Dans la liste <u>{cardParentList.name}</u>
            </span>
            {card.followed ? <span className="eye"></span> : true}
          </div>
        </div>
        <div className="bottom">
          <div className="description">
            <p className="title">Description</p>
            {!showForm ? (
              <div>
                {card.description.length ? (
                  <p onClick={handleShowForm}>{card.description}</p>
                ) : (
                  <div className="no-description" onClick={handleShowForm}>
                    <p>Ajouter une description plus détaillée...</p>
                  </div>
                )}
              </div>
            ) : (
              <form className="description-form" onSubmit={updateDescription}>
                <textarea
                  autoFocus
                  name="description"
                  defaultValue={card.description}
                  id="description"
                  placeholder={card.description ? card.description : "Ajouter une description plus détaillée..."}
                ></textarea>
                <div>
                  <button className="green-button">
                    <span>Enregistrer</span>
                  </button>
                  <span
                    className="cross"
                    onClick={() => {
                      setShowForm(!showForm);
                    }}
                  ></span>
                </div>
              </form>
            )}
          </div>
          <div className="actions">
            <p className="title">Actions</p>
            <form onClick={handleFollow}>
              <button>
                <span className="eye"></span>Suivre{card.followed && <span className="check"></span>}
              </button>
            </form>
            <form onClick={deleteCard}>
              <button>
                <span className="dash"></span>Supprimer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default CardInfo;
