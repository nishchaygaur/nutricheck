import React, { useState, useMemo } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { ShoppingCart, X, Plus, Check, Copy, Trash2, CheckCircle2 } from 'lucide-react';

export function GroceryListModal({ isOpen, onClose }) {
  const { currentDayData } = useNutrition();

  // Combine items from today's meals
  const initialItems = useMemo(() => {
    const meals = currentDayData.meals || {};
    const all = [
      ...(meals.breakfast || []),
      ...(meals.lunch || []),
      ...(meals.dinner || []),
      ...(meals.snacks || []),
    ];

    // Deduplicate by name
    const map = new Map();
    all.forEach((item) => {
      if (!map.has(item.name)) {
        map.set(item.name, {
          id: 'g_' + item.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          name: item.name,
          portion: item.servingUnit || '1 serving',
          checked: false,
          icon: item.icon || '🛒',
        });
      }
    });

    return Array.from(map.values());
  }, [currentDayData]);

  const [groceryItems, setGroceryItems] = useState(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync if initialItems changes and list is empty
  React.useEffect(() => {
    if (initialItems.length > 0 && groceryItems.length === 0) {
      setGroceryItems(initialItems);
    }
  }, [initialItems]);

  if (!isOpen) return null;

  const handleToggleCheck = (id) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setGroceryItems((prev) => [
      ...prev,
      {
        id: 'custom_g_' + Date.now(),
        name: newItemName.trim(),
        portion: '1 item',
        checked: false,
        icon: '🛒',
      },
    ]);
    setNewItemName('');
  };

  const handleRemoveItem = (id) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyClipboard = () => {
    const text = groceryItems
      .map((item) => `${item.checked ? '[x]' : '[ ]'} ${item.name} (${item.portion})`)
      .join('\n');

    navigator.clipboard.writeText(`NutriTrack Smart Grocery List:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkedCount = groceryItems.filter((i) => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Nutritional Grocery Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregated from your planned meals and dietary requirements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Custom Item Form */}
        <form onSubmit={handleAddItem} className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Add extra item (e.g. Almond milk, Lemons, Olive oil)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {groceryItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Your grocery list is empty. Log some meals or add items above!
            </div>
          ) : (
            groceryItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  item.checked
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 line-through'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => handleToggleCheck(item.id)}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      item.checked
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-base select-none">{item.icon}</span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.portion}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {checkedCount} of {groceryItems.length} purchased
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
