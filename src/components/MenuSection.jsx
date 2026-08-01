"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cakes,
  cakeFlavors,
  churroCheesecake,
  cupcakes,
  bananaLoaf,
  pies,
  jellos,
  chocolateStrawberries,
  cheesecakes9in,
  bananaPudding,
  tiramisu,
} from "@/data/menu";
import CategoryTabs from "./CategoryTabs";
import MenuCard from "./MenuCard";

const items = [
  { group: "Cakes", item: { ...cakes, flavors: cakeFlavors } },
  { group: "Cupcakes", item: { ...cupcakes, flavors: cakeFlavors } },
  { group: "Cheesecakes", item: churroCheesecake },
  { group: "Cheesecakes", item: cheesecakes9in },
  { group: "Strawberries", item: chocolateStrawberries },
  { group: "Loaves & Pies", item: bananaLoaf },
  { group: "Loaves & Pies", item: pies },
  { group: "Jellos", item: jellos },
  { group: "Puddings", item: bananaPudding },
  { group: "Puddings", item: tiramisu },
];

const groups = ["All", ...Array.from(new Set(items.map((i) => i.group)))];

export default function MenuSection() {
  const [active, setActive] = useState("All");

  const visible = active === "All" ? items : items.filter((i) => i.group === active);

  return (
    <section id="menu" className="bg-blush px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.35em] text-sage-dark uppercase">Our Menu</p>
          <h2 className="mt-4 font-heading text-5xl text-plum sm:text-6xl">Suly&apos;s Sweets Menu</h2>
        </div>

        <div className="mt-10 flex justify-center">
          <CategoryTabs groups={groups} active={active} onSelect={setActive} />
        </div>

        <motion.div layout className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map(({ item }) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
