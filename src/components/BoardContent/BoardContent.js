import React, { useState, useEffect, useRef } from "react";
import "./BoardContent.scss";
import Column from "../Column/Column";
import { initData } from "../../actions/initData";
import _, { isFunction } from "lodash";
import { mapOrder } from "../../utilities/Sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utilities/dragDrop";
import { v4 as uuidv4 } from "uuid";
import {
  createColumns,
  deleteColumnApi,
  getColumns,
  updateCardColumnId,
  updateColumnApi,
} from "../services/api";

function BoardContent(props) {

  const {deleteCard, updateCard, cards} = props

  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});

  const [isShowAddList, setIsShowAddList] = useState(false);
  const inputRef = useRef(null);
  const [valueInput, setValueInput] = useState("");

  useEffect(() => {
    if (isShowAddList === true && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowAddList]);

  async function getAllNotes() {
    const responseColumns = await getColumns();
    
    
    
    
    // console.log(response);
    const boardInitData = initData.boards.find((item) => item.id === "board-1");
    boardInitData.columns = responseColumns.data;
    
   
    
    setBoard(boardInitData);
    setColumns(
       boardInitData.columns, boardInitData.columnOrder, "id"
     )
    
     
     
     
  }
  useEffect(() => {
    getAllNotes();
  }, []);



  async function updateColumn(column) {
    await updateColumnApi(column.id,{
      name:column.name
    });
    getAllNotes();
  }
  async function updateColumnIdCard(card, columnsId){
    await updateCardColumnId(card.id,{
      columns: columnsId
    })
  }

  async function createColumn(column) {
    await createColumns(column);
    getAllNotes();
  }

  async function deleteColumn(columnId) {
    await deleteColumnApi(columnId);

    getAllNotes();
  }
  const onColumnDrop = (dropResult) => {
    console.log(dropResult);

    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    
  };

  const onCardDrop = (dropResult, columnId) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      console.log(
        ">>> inside onCardDrop: ",
        dropResult,
        "with columnId=",
        columnId
      );

      let newColumns = [...columns];
      let currentColumn = newColumns.find((column) => column.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardsOrder = currentColumn.cards.map((card) => card);
      if (dropResult.payload.columns !== columnId) {
        updateColumnIdCard({ ...dropResult.payload.columns, columnId });
      }

      setColumns(newColumns);
    }
  };

  if (_.isEmpty(board)) {
    return (
      <>
        <div className="not-found">Board not found</div>
      </>
    );
  }

  async function handleAddList(){

    

    if (!valueInput) {
      if (inputRef && inputRef.current) inputRef.current.focus();
    }

    const column = {

      id: columns.id,
      boardId: board.id,
      name: valueInput,
      cards: [{}],
    };
    console.log(column)
    
    inputRef.current.focus();
    createColumn(column);
    setColumns(column);
    setValueInput("");
    setIsShowAddList(false)
    getAllNotes()
    
  };

  const onUpdateColumn = (newColumn) => {
    const columnIdUpdate = newColumn.id;
    let ncols = [...columns];
    let index = ncols.findIndex((item) => item.id === columnIdUpdate);
    if (newColumn._destroy) {
      ncols.splice(index, 1);
    } else {
      ncols[index] = newColumn;
    }
    setColumns(ncols);
  };
  return (
    <>
      <div className="board-columns">
        <Container
          orientation="horizontal"
          onDrop={onColumnDrop}
          getChildPayload={(index) => columns[index]}
          dragHandleSelector=".column-drag-handle"
          dragClass="column-ghost"
          dropClass="column-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "column-drop-preview",
          }}
        >
          {columns &&
            columns.length > 0 &&
            columns.map((column, index) => {
              return (
                <Draggable key={column.id}>
                  <Column
                    id={column.id}
                    column={column}
                    onCardDrop={onCardDrop}
                    onUpdateColumn={onUpdateColumn}
                    deleteCard={deleteCard}
                    updateCard={updateCard}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                  />
                </Draggable>
              );
            })}
          {isShowAddList === false ? (
            <div
              className="add-new-column"
              onClick={() => setIsShowAddList(true)}
            >
              <i className="fa fa-plus icon"></i>Novo Grupo
            </div>
          ) : (
            <div className="content-add-column">
              <input
                type="text"
                className="form-control"
                ref={inputRef}
                value={valueInput}
                onChange={(event) => setValueInput(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleAddList();
                    
                  }
                }}
                placeholder="Insira o t??tulo do grupo..."
              />
              <div className="group-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddList()}
                >
                  Adicionar Grupo
                </button>
                <i
                  className="fa fa-times icon"
                  onClick={() => setIsShowAddList(false)}
                ></i>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default BoardContent;
