import type { Guest } from '../types';

// Mock Data
const MOCK_DATA: Guest[] = [
  { id: '1', field1: '00124', field2: 'Nguyễn Văn An', field3: 'Hà Nội', other: 'Khách mời VIP', checkedIn: true, checkinTime: '14:20:05' },
  { id: '2', field1: '00125', field2: 'Trần Thị Bình', field3: 'TP.HCM', other: 'Nhân viên', checkedIn: false, checkinTime: '--:--:--' },
  { id: '3', field1: '00126', field2: 'Lê Văn Cường', field3: 'Đà Nẵng', other: 'Đối tác', checkedIn: true, checkinTime: '15:10:32' },
  { id: '4', field1: '00127', field2: 'Phạm Minh Đức', field3: 'Cần Thơ', other: 'Khách mời', checkedIn: false, checkinTime: '--:--:--' },
  { id: '5', field1: '00128', field2: 'Hoàng Anh Em', field3: 'Hải Phòng', other: 'Khách mời', checkedIn: false, checkinTime: '--:--:--' },
  { id: '6', field1: '00129', field2: 'Đỗ Văn Giang', field3: 'Hà Nội', other: 'Nhân viên', checkedIn: false, checkinTime: '--:--:--' },
  { id: '7', field1: '00130', field2: 'Bùi Thị Hạnh', field3: 'Huế', other: 'Khách mời VIP', checkedIn: false, checkinTime: '--:--:--' },
  { id: '8', field1: '00131', field2: 'Ngô Văn Hùng', field3: 'Bình Dương', other: 'Đối tác', checkedIn: false, checkinTime: '--:--:--' },
];

export const checkinService = {
  getGuests: async (): Promise<Guest[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_DATA]), 500);
    });
  },

  checkin: async (_id: string): Promise<{ success: boolean; time: string }> => {
    return new Promise((resolve) => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-GB', { hour12: false });
        setTimeout(() => resolve({ success: true, time }), 200);
    });
  }
};
