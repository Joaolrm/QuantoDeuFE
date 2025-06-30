// lib/api.ts
import axios from "axios";
import {
  People,
  EventCutItensDTO,
  ItemCutIdDTO,
  PeopleAddEventsDTO,
  ItemAddParticipantsCutEventIdDTO,
  PeopleCutPhoneNumberDateOfBirthGenderDTO,
  EventAddPeopleItemsParticipantsCutEventIdDTO,
  PeopleAddAdminDTO,
  EventAddItemsCutEventIdTotalCostDTO,
  ItemCutEventIdTotalCostDTO,
  CreateEventRequest,
  ItemCutIdEventIdTotalCostDTO,
  CreatePeopleRequest,
  AddParticipantRequest,
  ItemSimpleResponseDTO,
  AddItemToParticipantDTO,
  ItemUpdateDTO,
  PeopleAddPeopleIdSelectedOptionalItemsIdCutIdNamePhoneNumberDateOfBirthGenderDTO,
  EventShoppingStatisticsDTO,
  EventCompleteReportDTO,
  EventSpreadsheetReportDTO,
} from "../types/api";

const api = axios.create({
  baseURL: "https://quantodeu-862319110846.southamerica-east1.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Serviços da API
export const apiService = {
  // Pessoas
  async getPeopleEventsByPhone(
    phoneNumber: string,
    isAdmin?: boolean
  ): Promise<PeopleAddEventsDTO> {
    const params = isAdmin !== undefined ? { isAdmin } : {};
    const response = await api.get(`/Peoples/${phoneNumber}/Events`, { params });
    return response.data;
  },

  async createPeople(peopleData: CreatePeopleRequest): Promise<People> {
    const response = await api.post("/Peoples", peopleData);
    return response.data;
  },

  async getAllPeople(): Promise<People[]> {
    const response = await api.get("/Peoples");
    return response.data;
  },

  // Eventos
  async getAllEvents(): Promise<EventCutItensDTO[]> {
    const response = await api.get("/Events");
    return response.data;
  },

  async createEvent(eventData: CreateEventRequest): Promise<any> {
    const response = await api.post("/Events", eventData);
    return response.data;
  },

  async getEventByHashInvite(
    hashInvite: string
  ): Promise<EventAddItemsCutEventIdTotalCostDTO> {
    const response = await api.get(`/Events/ByHashInvite/${hashInvite}`);
    return response.data;
  },

  async getEventDetails(
    eventId: number,
    peopleId: number
  ): Promise<EventAddPeopleItemsParticipantsCutEventIdDTO> {
    const response = await api.get(`/Events/${eventId}/People/${peopleId}`);
    return response.data;
  },

  async addParticipantToEvent(
    eventId: number,
    participantData: PeopleAddPeopleIdSelectedOptionalItemsIdCutIdNamePhoneNumberDateOfBirthGenderDTO
  ): Promise<any> {
    const response = await api.post(
      `/Events/${eventId}/AddParticipant`,
      participantData
    );
    return response.data;
  },

  async deleteEvent(eventId: number): Promise<void> {
    await api.delete(`/Events/${eventId}`);
  },

  // Itens
  async getAllItems(): Promise<any[]> {
    const response = await api.get("/Itens");
    return response.data;
  },

  async createItem(itemData: ItemCutIdDTO): Promise<ItemSimpleResponseDTO> {
    const response = await api.post("/Itens", itemData);
    return response.data;
  },

  async addItemToParticipant(
    itemId: number,
    participantData: AddItemToParticipantDTO
  ): Promise<ItemAddParticipantsCutEventIdDTO> {
    const response = await api.post(
      `/Itens/${itemId}/AddItemToParticipant`,
      participantData
    );
    return response.data;
  },

  async removeItemFromParticipant(
    itemId: number,
    peopleId: number,
    eventId: number
  ): Promise<void> {
    await api.delete(
      `/Itens/${itemId}/Participant/${peopleId}/Event/${eventId}`
    );
  },

  async deleteItem(itemId: number): Promise<void> {
    await api.delete(`/Itens/${itemId}`);
  },

  async updateItem(
    itemId: number,
    itemData: ItemUpdateDTO
  ): Promise<ItemSimpleResponseDTO> {
    const response = await api.put(`/Itens/${itemId}`, itemData);
    return response.data;
  },

  async getEventShoppingStatistics(eventId: number): Promise<EventShoppingStatisticsDTO> {
    const response = await api.get(`/Events/${eventId}/ShoppingStatistics`);
    return response.data;
  },

  // Complete Report
  async getEventCompleteReport(eventId: number): Promise<EventCompleteReportDTO> {
    const response = await api.get(`/Events/${eventId}/CompleteReport`);
    return response.data;
  },

  // Spreadsheet Report
  async getEventSpreadsheetReport(eventId: number): Promise<EventSpreadsheetReportDTO> {
    const response = await api.get(`/Events/${eventId}/SpreadsheetReport`);
    return response.data;
  },
};

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
