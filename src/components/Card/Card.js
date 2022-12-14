import React, { useState, useEffect, useRef } from "react";
import { initData } from "../../actions/initData";
import { updateCardApi } from "../../components/services/api";
import ConfirmModel from "../common/ConfirmModel";
import Form from "react-bootstrap/Form";
import {
  MODAL_ACTION_CLOSE,
  MODAL_ACTION_CONFIRM,
} from "../../utilities/constant";

import "./Card.scss";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

function Card(props) {
  const { deleteCard,  card, updateCard} = props;
  const inputRef = useRef(null);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const [isShowModalDelete, setShowModalDelete] = useState(false);
  //  const [cards, setCards] = useState({});
  const [titleCard, setTitleCard] = useState("");



  

  const ToggleModal = () => {
    setShowModalDelete(!isShowModalDelete);
  };

  const onModalAction = (type) => {
    console.log(type);
    if (type === MODAL_ACTION_CLOSE) {
      //nao faz nada
    }
    if (type === MODAL_ACTION_CONFIRM) {
      //remove uma coluna/grupo

      deleteCard(card.id);
      
    }
    
    ToggleModal();
    
  };

 

  // const onUpdateCard = (card) => {
  //   const cardIdUpdate = card.id;
  //   console.log(cardIdUpdate)
  //   let ncols = [...card];
  //   let index = ncols.findIndex((item) => item.id === cardIdUpdate);
  //   if (card._destroy) {
  //     ncols.splice(index, 1);
  //   } else {
  //     ncols[index] = card;
  //   }
  //   onUpdateCard(card);

  //   setCards(ncols);
  // };

  const selectAllText = (event) => {
    setIsFirstClick(false);

    if (isFirstClick) {
      event.target.select();
    } else {
      inputRef.current.setSelectionRange(titleCard.length, titleCard.length);
    }
  };

  useEffect(() => {
    if (card && card.name) {
      setTitleCard(card.name);
    }
  }, [card]);

  
  const handleClickOutside = () => {
    //faça alguma coisa
    setIsFirstClick(true);
    const newCard = {
      ...card,
      name:  titleCard,
      
    };
    
    updateCard(newCard);
    setTitleCard(newCard)
    console.log(newCard);
  };

  return (
    <div>
      <div className="card-item">
        <div className="card-title">
          <Form.Control
            size={"sm"}
            type="text"
            value={titleCard}
            className="customize-input-card"
            onClick={selectAllText}
            onChange={(event) => setTitleCard(event.target.value)}
            spellCheck="false"
            onBlur={handleClickOutside}
            onMouseDown={(e) => e.preventDefault()}
            ref={inputRef}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleClickOutside();
                
              }
            }}
          />
        </div>
        <div className="card-dropdown">
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={ToggleModal}
          ></i>
        </div>
      </div>

      <ConfirmModel
        show={isShowModalDelete}
        title={"Remover o Card"}
        content={`Você tem certeza que deseja remover o Card: "${card.name}"`}
        onAction={onModalAction}
      />
    </div>
  );
}

export default Card;
