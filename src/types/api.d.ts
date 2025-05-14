export interface Event {
  id: number;
  name: string;
  date: string;
  address: string;
}

export interface UserResponse {
  id: number;
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  events: Event[];
}
