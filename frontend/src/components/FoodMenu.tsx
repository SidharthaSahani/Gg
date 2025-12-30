import { useState, useEffect } from 'react';
import { menuApi, FoodMenuItem } from '../lib/api';
import { ChefHat } from 'lucide-react';

export default function FoodMenu() {
  const [foodItems, setFoodItems] = useState<FoodMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
    // For our API, we'll poll for changes every 30 seconds
    const interval = setInterval(fetchFoodItems, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchFoodItems = async () => {
    try {
      const allItems = await menuApi.getAll();
      const data = allItems.filter((item: FoodMenuItem) => item.available);
      setFoodItems(data);
    } catch (error) {

    }
    setLoading(false);
  };

  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    if (category === 'all') return 'All Items';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const CATEGORIES = ['all', 'appetizer', 'main', 'dessert', 'beverage'];

  return (
    <div className="mt-8 sm:mt-12 space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <ChefHat className="text-orange-600" size={24} />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Our Menu</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            No items available in this category.
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition flex-shrink-0 w-64">
                <div className="w-full aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&h=300';
                    }}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl sm:text-2xl font-bold text-orange-600">
                      Rs.{item.price.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
