import { useState, useEffect } from 'react';
import { tablesApi, RestaurantTable } from '../lib/api';

export const useTables = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const data = await tablesApi.getAll();
      setTables(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tables');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTable = async (tableData: { table_number: string; capacity: number }) => {
    try {
      setIsLoading(true);
      await tablesApi.create({ ...tableData, status: 'available' });
      await fetchTables();
      setError(null);
    } catch (err) {
      setError('Failed to create table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      setIsLoading(true);
      await tablesApi.delete(id);
      await fetchTables();
      setError(null);
    } catch (err) {
      setError('Failed to delete table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    isLoading,
    error,
    fetchTables,
    createTable,
    deleteTable
  };
};