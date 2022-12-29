import { useEffect, useState } from "react";
import "./Card.css";

// Card component, renders a single card
const Card = ({ card, showCardInfo, setCardContent, setCardParentList, parentList }) => {
  // handle clicks on a specific card, shows modal and sets states (lifting)
  const handleCardClick = (e) => {
    e.preventDefault();
    setCardContent(card);
    setCardParentList(parentList);
    showCardInfo();
  };
  return (
    <div className="Card">
      <form onClick={handleCardClick}>
        <button>
          <h2>{card.name}</h2>
          <div className="details">
            {card.followed ? <span className="eye"></span> : true}
            {card.description.length ? <span className="text"></span> : true}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Card;
