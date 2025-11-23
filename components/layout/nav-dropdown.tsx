"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface DropdownItem {
    label: string;
    href: string;
    description?: string;
}

export interface NavDropdownProps {
    label: string;
    items: DropdownItem[];

}

export default function NavDropdown({label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} 
        onMouseLeave={() => setIsOpen(false)}>
            <button className="flex items-center gap-1 text-gray-700 hover:text-green-600 hover:cursor-pointer transition-colors font-medium">
                {label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ?"rotate-180":""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                    initial={{ opacity: 0, y: -10}}
                    animate={{ opacity: 1, y: 0}}
                    exit={{ opacity: 0, y: -10}}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border-gray-200 py-2 z-50">

                        {items.map((item) => (
                            <Link key={item.href} href={item.href} className="block px-4 py-3 hover:bg-green-50 transition-colors group">
                                <p className="font-medium text-gray-900 group-hover:text-green-600">
                                    {item.label}
                                </p>
                                {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </Link>
                                
                        ))}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );  
}



