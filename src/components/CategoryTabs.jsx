"use client";

import { motion } from "framer-motion";

export default function CategoryTabs({ groups, active, onSelect }) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {groups.map((group) => {
        const isActive = active === group;
        return (
          <button
            key={group}
            type="button"
            onClick={() => onSelect(group)}
            className={`relative flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
              isActive
                ? "text-cream"
                : "bg-cream/40 text-plum/70 ring-1 ring-plum/10 hover:text-plum"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="tab-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-plum"
              />
            )}
            <span className="relative">{group}</span>
          </button>
        );
      })}
    </div>
  );
}
