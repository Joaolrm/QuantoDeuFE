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

// Nova interface para eventos com informação de admin
export interface EventWithAdminDTO {
  id: number;
  name: string;
  date: string;
  address: string;
  isAdmin: boolean;
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
  events: EventWithAdminDTO[];
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

export interface PeopleAddPeopleIdSelectedOptionalItemsIdCutIdNamePhoneNumberDateOfBirthGenderDTO {
  peopleId: number;
  selectedOptionalItemsId?: number[];
}

export interface ItemShoppingStatisticsDTO {
  itemId: number;
  itemName: string;
  isRequired: boolean;
  totalCost: number;
  totalChosenBy: number;
  maleCount: number;
  femaleCount: number;
  unspecifiedCount: number;
}

export interface EventShoppingStatisticsDTO {
  eventId: number;
  eventName: string;
  totalParticipants: number;
  items: ItemShoppingStatisticsDTO[];
}

export interface EventCompleteReportDTO {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventAddress: string;
  hashInvite: string;
  totalParticipants: number;
  totalEventCost: number;
  items: ItemCompleteReportDTO[];
  participants: ParticipantSummaryDTO[];
}

export interface ItemCompleteReportDTO {
  itemId: number;
  itemName: string;
  isRequired: boolean;
  totalCost: number;
  totalChosenBy: number;
  costPerPerson: number;
  participantIds: number[];
}

export interface ParticipantSummaryDTO {
  peopleId: number;
  name: string;
  phoneNumber: string;
  isAdmin: boolean;
  totalItems: number;
  totalCost: number;
  itemsResponsible: ParticipantItemDetailDTO[];
}

export interface ParticipantItemDetailDTO {
  itemId: number;
  itemName: string;
  individualCost: number;
}

// Novas interfaces baseadas na documentação atualizada
export interface EventSpreadsheetReportDTO {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventAddress: string;
  totalEventCost: number;
  items: SpreadsheetItemDTO[];
  participants: SpreadsheetParticipantDTO[];
  totals: SpreadsheetTotalsDTO;
}

export interface SpreadsheetItemDTO {
  itemId: number;
  itemName: string;
  isRequired: boolean;
  totalCost: number;
  costPerPerson: number;
}

export interface SpreadsheetParticipantDTO {
  peopleId: number;
  name: string;
  phoneNumber: string;
  isAdmin: boolean;
  totalCost: number;
  itemCosts: Record<string, number>;
}

export interface SpreadsheetTotalsDTO {
  totalEventCost: number;
  itemTotals: Record<string, number>;
  participantTotals: Record<string, number>;
}
