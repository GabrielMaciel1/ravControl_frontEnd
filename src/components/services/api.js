import axios from "axios";
import { functionsIn } from "lodash";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export function getColumns() {
  return api.get("/columns");
}
export function getCards(){
  return api.get("/card")
}
export function getCard(id){
  return api.get (`/card/${id}`)
}

export function createCards(card) {
  return api.post("/card", card);
}
export function createColumns(column) {
  return api.post("/columns", column);
}

export function updateCardApi(id, card) {
  return api.put(`/card/${id}`, card);
}

export function updateCardColumnId(id, card){
  return api.put(`/card/${id}`, card);
}

export function updateColumnApi(id,column) {
  return api.put(`/columns/${id}`, column);
}

export function deleteCardApi(id) {
  return api.delete(`/card/${id}`);
}

export function deleteColumnApi(id) {
  return api.delete(`/columns/${id}`);
}
export default api;
