import React from "react";
import { motion } from "framer-motion";

export default function customLi({ text, description, key }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <details className="open:bg-[#ECE6CC] open:ring-1 open:ring-black/5 open:shadow-sm rounded-lg my-10">
        <summary className="">
          <li className="mx-2 text-lg cursor-pointer hover:font-bold">
            {text}
          </li>
        </summary>
        <div className="px-3 py-3 mx-2">
          <p tabIndex="0">{description}</p>
        </div>
      </details>
    </motion.div>
  );
}
