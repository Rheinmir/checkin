import { useState, useEffect, useMemo } from 'react';
import type { Guest } from '../types';
import { checkinService } from '../services/api';

export const useCheckin = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const data = await checkinService.getGuests();
      setGuests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (id: string) => {
    const guest = guests.find(g => g.id === id);
    if (!guest || guest.checkedIn) return;

    // Optimistic update
    const { time } = await checkinService.checkin(id);
    
    setGuests(prev => prev.map(item => 
      item.id === id ? { ...item, checkedIn: true, checkinTime: time } : item
    ));
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(item => 
      item.field1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.field2.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [guests, searchQuery]);

  const stats = useMemo(() => ({
    total: guests.length,
    checkedIn: guests.filter(g => g.checkedIn).length
  }), [guests]);

  return {
    guests: filteredGuests,
    loading,
    searchQuery,
    setSearchQuery,
    handleCheckin,
    stats,
    setGuests
  };
};
