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

export interface ItemUpdateDTO {
  name: string;
  isRequired: boolean;
  totalCost: number;
}
