import React, { useEffect, useState, useRef, use } from "react";
import { createCards,deleteCardApi , getCards, updateCardApi, deleteCard } from "../../components/services/api";
import "./Column.scss";
import { initData } from "../../actions/initData";
import _, { isFunction } from "lodash";
import Card from "../Card/Card";
import { Container, Draggable } from "react-smooth-dnd";
import ConfirmModel from "../common/ConfirmModel";
import Form from "react-bootstrap/Form";
import {
  MODAL_ACTION_CLOSE,
  MODAL_ACTION_CONFIRM,
} from "../../utilities/constant";
import { v4 as uuidv4 } from "uuid";



function Column(props) {
  const {
    id,
    column,
    getAllNotes,
    onCardDrop,
    onUpdateColumn,
    // deleteCard,
    updateCard,
    deleteColumn,
    updateColumn,
    
  } = props;
  

  
  const [cards, setCards] = useState({});
  
  const [isShowModalDelete, setShowModalDelete] = useState(false);
  const [titleColumn, setTitleColumn] = useState("");

  const [isFirstClick, setIsFirstClick] = useState(true);
  const inputRef = useRef(null);

  const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
  const [valueTextArea, setValueTextArea] = useState("");
  const textAreaRef = useRef(null);



  async function getAllNotesCards() {
    
    const responseCard = await getCards()
    
    // console.log(response);
    const boardInitData = initData.boards.find((item) => item.id === "board-1");
    boardInitData.columns.cards = responseCard.data
    
    
   
    setCards(boardInitData.columns.cards);

    
   
  }
    
    
  useEffect(() => {
     getAllNotesCards()
  }, [setCards]);

  async function deleteCard(cardId) {
    await deleteCardApi(cardId);
     getAllNotesCards();
  }

  async function createCard(cardId) {
    await createCards(cardId);
     getAllNotesCards();
  }
  
  
  useEffect(() => {
    if (isShowAddNewCard === true && textAreaRef && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isShowAddNewCard]);

  useEffect(() => {
    if (column && column.name) {
      setTitleColumn(column.name);
    }
  }, [column]);

  useEffect(() => {
    if (cards && cards.name) {
      setValueTextArea(cards.name);
    }
  }, [cards]);

 
  

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
      deleteColumn(column.id);
    }
    
    ToggleModal();
    getAllNotesCards()
  };

  const selectAllText = (event) => {
    setIsFirstClick(false);

    if (isFirstClick) {
      event.target.select();
    } else {
      inputRef.current.setSelectionRange(
        titleColumn.length,
        titleColumn.length
      );
    }
  };

  const handleClickOutside = () => {
    //faça alguma coisa
    setIsFirstClick(true);
    const newColumn = {
      ...column,
      name: titleColumn,
    };

    updateColumn(newColumn);
    getAllNotes()
  };

  const handleAddNewCard = () => {

    

    if (!valueTextArea) {
      
      if (textAreaRef && textAreaRef.current)
      textAreaRef.current.focus();
      return;
    }
    const card = {
      id: cards.id,
      columnsId: column.id,
      name: valueTextArea,

      
    };
    
    console.log(card)

    // const _newCards = _.cloneDeep(card);
    //  _newCards.push(card);
    createCard(card);
    setCards(card)
    setValueTextArea("");
    
    setIsShowAddNewCard(false);
    //  onUpdateColumn(newColumn);
    

    
    
   
    //let newColumn = { ...column };
    // newColumn.cards = [...newColumn.cards, newCard];
    // newColumn.cardsOrder = newColumn.cards.map((card) => card.id);

    getAllNotesCards()
  };
  

  return (
    <>
      <div className="column">
        <header className="column-drag-handle">
          <div className="column-title">
            <Form.Control
              size={"sm"}
              type="text"
              value={titleColumn}
              className="customize-input-column"
              onClick={selectAllText}
              onChange={(event) => setTitleColumn(event.target.value)}
              spellCheck="false"
              onBlur={handleClickOutside}
              onMouseDown={(e) => e.preventDefault()}
              ref={inputRef}
            />
          </div>
          <div></div>
          <div className="column-dropdown">
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={ToggleModal}
            ></i>
          </div>
        </header>
        <div className="card-list">
          <Container
            groupName="col"
            onDrop={(dropResult) => onCardDrop(dropResult, column.id)}
            getChildPayload={(index) => cards[index]}
            dragClass="card-ghost"
            dropClass="card-ghost-drop"
            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: "card-drop-preview",
            }}
            dropPlaceholderAnimationDuration={200}
          >
              {cards &&
              cards.length > 0 &&
              cards.map((card, index) => {
                return (
                  card.columns.id === id &&
                  <Draggable key={card.id}>
                    <Card
                      card={card}
                      deleteCard={deleteCard}
                      updateCard={updateCard}
                    />
                  </Draggable>
                );
              })}
          </Container>
          {isShowAddNewCard === true && (
            <div className="add-new-card">
              <textarea
                rows="2"
                className="form-control"
                placeholder="Insira a descrição do card..."
                
                ref={textAreaRef}
                value={valueTextArea}
                onChange={(e) => setValueTextArea(e.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleAddNewCard();
                  }
                }}
              ></textarea>
              <div className="group-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddNewCard()}
                >
                  Adicionar Card
                </button>
                <i
                  className="fa fa-times icon"
                  onClick={() => setIsShowAddNewCard(false)}
                ></i>
              </div>
            </div>
          )}
        </div>
        {isShowAddNewCard === false && (
          <footer>
            <div
              className="footer-action"
              onClick={() => setIsShowAddNewCard(true)}
            >
              <i className="fa fa-plus icon"></i>
              Novo card
            </div>
          </footer>
        )}
      </div>
      <ConfirmModel
        show={isShowModalDelete}
        title={"Remover o Grupo"}
        content={`Você tem certeza que deseja remover o grupo: "${column.name}"`}
        onAction={onModalAction}
      />
    </>
  );
}

export default Column;
