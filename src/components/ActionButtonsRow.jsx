import { useState, useRef, useEffect } from 'react';
import { FaCalendarCheck, FaEllipsisV, FaHistory, FaPlusCircle, FaSearch } from 'react-icons/fa';

const ActionButtonsRow = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [overflowedItems, setOverflowedItems] = useState([]);
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);

  const allButtons = [
    {
      label: "Add Custom Item",
      icon: <FaPlusCircle className="text-orange-500 text-xl flex-shrink-0" />,
     // onClick: () => setIsAddCustomProductShow(true),
    },
    {
      label: "Item Lookup",
      icon: <FaSearch className="text-indigo-600 text-xl flex-shrink-0" />,
      onClick: () => document.querySelector('[data-item-lookup]')?.focus(),
    },
    {
      label: "Sales History",
      icon: <FaHistory className="text-teal-600 text-xl flex-shrink-0" />,
     // onClick: () => setIsSalesHistoryPopupVisible(true),
    },
    {
      label: "Day End",
      icon: <FaCalendarCheck className="text-rose-600 text-xl flex-shrink-0" />,
     // onClick: () => setIsDayEndPopupVisible(true),
    },
    // Add more buttons here in the future if needed
  ];

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const buttons = buttonRefs.current;
      const containerWidth = container.offsetWidth;
      let totalWidth = 0;
      const visible = [];
      const hidden = [];

      buttons.forEach((btn, index) => {
        if (!btn) return;
        totalWidth += btn.offsetWidth + 20; // + gap

        if (totalWidth < containerWidth - 80) { // leave space for More button
          visible.push(index);
        } else {
          hidden.push(index);
        }
      });

      setOverflowedItems(hidden);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [allButtons]);

  return (
    <div className="relative mt-8">
      <div
        ref={containerRef}
        className="flex items-center justify-start gap-5 flex-wrap"
      >
        {/* Visible Buttons */}
        {allButtons.map((btn, index) => (
          <button
            key={index}
            ref={el => buttonRefs.current[index] = el}
            style={{ display: overflowedItems.includes(index) ? 'none' : 'flex' }}
            onClick={btn.onClick}
            className="flex items-center gap-3 px-7 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 hover:shadow-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5 whitespace-nowrap"
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}

        {/* More Menu Button - Only shows if there are overflowed items */}
        {overflowedItems.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(prev => !prev)}
              className="flex items-center gap-3 px-7 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 hover:shadow-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5"
            >
              <FaEllipsisV className="text-gray-600 text-xl" />
              <span>More</span>
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                {/* Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {overflowedItems.map(index => {
                    const btn = allButtons[index];
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          btn.onClick();
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {btn.icon}
                        <span className="font-medium text-gray-700">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};