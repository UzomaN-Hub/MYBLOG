"use client";

import { Search, BadgeQuestionMark, Menu, X, Lock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavDropdown from "../layout/nav-dropdown";
import MobileDropdown from "../layout/mobiledropdown";

export default function Navbar() {
  const [MenuOpen, setMenuOpen] = useState(false);

  // Dropdown menu items
  const healthConditionsItems = [
    { label: "Heart Disease", href: "/health-conditions/heart-disease", description: "Cardiovascular health information" },
    { label: "Diabetes", href: "/health-conditions/diabetes", description: "Managing blood sugar levels" },
    { label: "Mental Health", href: "/health-conditions/mental-health", description: "Anxiety, depression & more" },
    { label: "Cancer", href: "/health-conditions/cancer", description: "Prevention and treatment" },
    { label: "View All", href: "/health-conditions" },
  ];

  const wellnessItems = [
    { label: "Nutrition", href: "/wellness/nutrition", description: "Healthy eating & diet plans" },
    { label: "Fitness", href: "/wellness/fitness", description: "Exercise & workout tips" },
    { label: "Sleep", href: "/wellness/sleep", description: "Better sleep habits" },
    { label: "Stress Management", href: "/wellness/stress", description: "Relaxation techniques" },
    { label: "View All", href: "/wellness" },
  ];

  const researchItems = [
    { label: "Latest Studies", href: "/research/latest", description: "Recent medical findings" },
    { label: "Clinical Trials", href: "/research/trials", description: "Ongoing research" },
    { label: "Medical News", href: "/research/news", description: "Healthcare updates" },
    { label: "View All", href: "/research" },
  ];

  const connectItems = [
    { label: "About Us", href: "/about", description: "Our mission & team" },
    { label: "Contact", href: "/contact", description: "Get in touch" },
    { label: "Community", href: "/community", description: "Join discussions" },
    { label: "Careers", href: "/careers", description: "Work with us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            Prime<span className="text-green-700">Health</span>Care
          </Link>

          {/* For Desktop View */}
          <div className="hidden lg:flex">
            <ul className="flex items-center gap-8">
              <li>
                <NavDropdown label="Health Conditions" items={healthConditionsItems} />
              </li>
              <li>
                <NavDropdown label="Wellness" items={wellnessItems} />
              </li>
              <li>
                <NavDropdown label="Medical Research" items={researchItems} />
              </li>
              <li>
                <NavDropdown label="Connect" items={connectItems} />
              </li>
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="w-auto border border-gray-300 rounded-md py-1 pl-10"
              />
            </div>
            {/* <Link href="/faq" className="flex items-center justify-center gap-1 hover:text-green-600 transition-colors">
              <BadgeQuestionMark size={20} className="text-green-500" />
              <h2 className="text-sm">FAQS</h2>
            </Link> */}

            <Link href="/login" className="flex items-center justify-center">
              
              <Button className="bg-green-700 hover:bg-green-800 transition-colors cursor-pointer">
                <Lock size={20} />
                Admin
                </Button>
            </Link>
          </div>

          {/* Mobile Menu icon */}
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!MenuOpen)}
          >
            {MenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {MenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 pb-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10"
                        />
                    </div>
                    <Link href="/faq" className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <BadgeQuestionMark size={20} className="text-green-500" />
                        <span className="text-sm whitespace-nowrap">FAQS</span>
                    </Link>
                    </div>

                    {/* Mobile Accordion Menus */}
                    <div className="space-y-2">
                    <MobileDropdown label="Health Conditions" items={healthConditionsItems} />
                    <MobileDropdown label="Wellness" items={wellnessItems} />
                    <MobileDropdown label="Medical Research" items={researchItems} />
                    <MobileDropdown label="Connect" items={connectItems} />
                    </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}


