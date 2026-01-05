export interface Guest {
  id: string;
  field1: string; // ID
  field2: string; // Name
  field3: string; // Region/Zone
  other: string;  // Role/Note
  checkedIn: boolean;
  checkinTime: string;
}

export interface CheckinStats {
  total: number;
  checkedIn: number;
}
