import { useState } from 'react';
import { Plus, Trash2, Unlock, RefreshCw } from 'lucide-react';
import { useTables } from '../../hooks/useTables';
import { useBookings } from '../../hooks/useBookings';
import { getTableBookings } from '../../utils/bookingUtils';
import { BookingTimeline } from './BookingTimeline';

interface TablesManagementProps {
  selectedDate: string;
}

export const TablesManagement = ({ selectedDate }: TablesManagementProps) => {
  const { tables, createTable, deleteTable, fetchTables } = useTables();
  const { filteredBookings, releaseBooking } = useBookings(selectedDate);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({ table_number: '', capacity: 2 });
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTable(newTable);
      setNewTable({ table_number: '', capacity: 2 });
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to add table. Please try again.');
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await deleteTable(id);
    } catch (error) {
      alert('Failed to delete table. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-xl sm:text-xl font-bold text-gray-800">Manage Tables</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchTables}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            <RefreshCw size={16} className="sm:size-18" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <Plus size={16} className="sm:size-18" />
            Add Table
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTable} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Number *
              </label>
              <input
                type="text"
                value={newTable.table_number}
                onChange={(e) => setNewTable({ ...newTable, table_number: e.target.value })}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="e.g., T1, A-01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                value={newTable.capacity}
                onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })}
                required
                min="1"
                max="20"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Add Table
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Table</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Capacity</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Active Bookings</th>
              <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => {
              const tableBookings = getTableBookings(filteredBookings, table.id);
              const isExpanded = expandedTable === table.id;

              return (
                <>
                  <tr key={table.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-sm sm:text-base">{table.table_number}</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{table.capacity} seats</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{tableBookings.length}</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        {tableBookings.length > 0 && (
                          <button
                            onClick={() => setExpandedTable(isExpanded ? null : table.id)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title={isExpanded ? "Collapse" : "View Bookings"}
                          >
                            <Unlock size={16} className="sm:size-18" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTable(table.id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Table"
                        >
                          <Trash2 size={16} className="sm:size-18" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 bg-gray-50">
                        <BookingTimeline
                          tableId={table.id}
                          bookings={filteredBookings}
                          onReleaseBooking={releaseBooking}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {tables.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No tables found. Add your first table to get started.
          </div>
        )}
      </div>
    </div>
  );
};