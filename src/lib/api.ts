// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://quantodeu-862319110846.southamerica-east1.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tipos baseados na documentação da API
export interface People {
  id: number;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Unspecified";
}

export interface EventCutItensDTO {
  id: number;
  name: string;
  date: string;
  address: string;
}

export interface ItemCutIdDTO {
  eventId: number;
  name: string;
  isRequired: boolean;
}

export interface PeopleAddEventsDTO {
  id: number;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Unspecified";
  events: EventCutItensDTO[];
}

export interface ItemAddParticipantsCutEventIdDTO {
  id: number;
  totalCost: number;
  name: string;
  isRequired: boolean;
  participants: PeopleCutPhoneNumberDateOfBirthGenderDTO[];
}

export interface PeopleCutPhoneNumberDateOfBirthGenderDTO {
  id: number;
  name: string;
}

export interface EventAddPeopleItemsParticipantsCutEventIdDTO {
  id: number;
  name: string;
  date: string;
  address: string;
  hashInvite: string;
  itens: ItemAddParticipantsCutEventIdDTO[];
  actualUser: PeopleAddAdminDTO;
}

export interface PeopleAddAdminDTO {
  id: number;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Unspecified";
  admin: boolean;
}

export interface EventAddItemsCutEventIdTotalCostDTO {
  id: number;
  name: string;
  date: string;
  address: string;
  hashInvite: string;
  items: ItemCutEventIdTotalCostDTO[];
}

export interface ItemCutEventIdTotalCostDTO {
  id: number;
  name: string;
  isRequired: boolean;
}

export interface CreateEventRequest {
  name: string;
  date: string;
  address: string;
  eventOwnerId: number;
  itens: ItemCutIdEventIdTotalCostDTO[];
}

export interface ItemCutIdEventIdTotalCostDTO {
  name: string;
  isRequired: boolean;
  ownerWantsThisItem: boolean;
}

export interface CreatePeopleRequest {
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Unspecified";
}

export interface AddParticipantRequest {
  peopleId: number;
  selectedOptionalItemsId: number[];
}

export interface ItemSimpleResponseDTO {
  id: number;
  eventId: number;
  name: string;
  isRequired: boolean;
}

export interface AddItemToParticipantDTO {
  eventId: number;
  peopleId: number;
}

// Serviços da API
export const apiService = {
  // Pessoas
  async getPeopleEventsByPhone(
    phoneNumber: string
  ): Promise<PeopleAddEventsDTO> {
    const response = await api.get(`/Peoples/${phoneNumber}/Events`);
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
    participantData: AddParticipantRequest
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
        debugger;
    const response = await api.post(
      `/Itens/${itemId}/addItemToParticipant`,
      participantData
    );
    return response.data;
  },

  async deleteItem(itemId: number): Promise<void> {
    await api.delete(`/Itens/${itemId}`);
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
