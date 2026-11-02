"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { GuideResourceCard } from "./_components/guide-resource-card";
import { WebinarResourceCard } from "./_components/webinar-resource-card";
import { tabs, resources } from "../_lib/resources";
import { DynamicFooter } from "../_components/footer/dynamic-footer";

/** Resources directory page showcasing guides, webinars, and learning materials. */
const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState("guides");
  const [searchQuery, setSearchQuery] = useState("");
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [showTabsFade, setShowTabsFade] = useState(false);

  const updateTabsFade = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    // Show the fade only while there are more tabs hidden to the right.
    setShowTabsFade(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateTabsFade();
    const observer = new ResizeObserver(updateTabsFade);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [updateTabsFade]);

  const filteredResources = resources.filter((resource) => {
    const matchesTab = resource.tab === activeTab;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <section className="relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:gap-8 lg:px-12">
        <div className="absolute inset-0 size-full max-h-screen -z-10 bg-blue-50/2" />
        <div className="flex flex-col gap-3 items-center">
          <h1 className=" text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
            Resources for <span className="text-primary-500">Modern</span>{" "}
            Learning Teams
          </h1>
          <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
            Explore guides, insights, and tools to help universities, schools,
            and bootcamps run better learning communities.
          </p>
        </div>
        <div className="w-full max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>
        <div className="relative w-full max-w-6xl">
          <div
            ref={tabsScrollRef}
            onScroll={updateTabsFade}
            className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex md:justify-center md:overflow-visible"
          >
            <div className="inline-flex w-max items-center gap-2 rounded-full bg-purple-100 p-2 md:gap-3">
              <div
                role="tablist"
                aria-label="Resource tabs"
                className="inline-flex items-center gap-2 md:gap-3"
              >
                {tabs
                  .filter((tab) => tab.id !== "templates")
                  .map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-medium transition-colors md:px-6 ${
                        activeTab === tab.id
                          ? "bg-white text-primary-500 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
              </div>
              <Link
                href="/templates"
                className="min-h-11 shrink-0 inline-flex items-center rounded-full px-5 text-sm font-medium transition-colors md:px-6 text-neutral-600 hover:text-neutral-900"
              >
                Templates
              </Link>
            </div>
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 md:hidden ${
              showTabsFade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* resources section */}
        {filteredResources.length > 0 ? (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {filteredResources.map((resource, index) => {
              if (resource.tab === "guides") {
                return (
                  <GuideResourceCard
                    key={`guide-${resource.id}-${index}`}
                    id={resource.id}
                    title={resource.title}
                    description={resource?.description ?? " "}
                    image={resource.image}
                    link={resource.link}
                  />
                );
              }

              if (resource.tab === "webinars") {
                return (
                  <WebinarResourceCard
                    key={`webinar-${resource.id}-${index}`}
                    id={resource.id}
                    title={resource.title}
                    image={resource.image}
                    link={resource.link}
                    duration={resource.duration ?? "45 min"}
                  />
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-4 py-16 mt-8">
            <div className="text-neutral-300 mb-2">
              <Search size={48} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No resources found
              </h3>
              <p className="text-sm text-neutral-600">
                {searchQuery
                  ? `We couldn't find any resources matching "${searchQuery}". Try a different search term.`
                  : "There are no resources available for this category yet. Check back soon!"}
              </p>
            </div>
          </div>
        )}
      </section>
      <DynamicFooter
        text="Need Help Getting Started?"
        description="Find answers, tutorials, and support resources in our comprehensive help center designed for educators and administrators."
      />
    </>
  );
};

export default ResourcesPage;
