// ============================================
// FILE: hooks/useTables.ts
// ============================================
import { useState, useEffect } from 'react';
import { tablesApi, RestaurantTable } from '../lib/api';

export const useTables = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tablesApi.getAll();

      setTables(data);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTable = async (tableData: { table_number: string; capacity: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      await tablesApi.create({ ...tableData, status: 'available' });
      await fetchTables(); // Refresh after creating
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to create table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await tablesApi.delete(id);
      await fetchTables(); // Refresh after deleting
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to delete table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    isLoading,
    error,
    fetchTables, // ✅ Exposed for refresh button
    createTable,
    deleteTable
  };
};
