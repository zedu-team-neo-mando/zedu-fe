"use client";

import React, { useState } from "react";
import Sorting, { FilterOption } from "../_components/sorting/sorting";
import { FileViewType } from "../_components/file-management/FileExplorer";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterSectionProps {
  viewType?: FileViewType;
  fileType: string[];
  uploader: string[];
  dateRange: string[];
  access: string[];
  sortOrder: string[];
  fileNameSearch: string;
  uploaderOptions?: FilterOption[];
  onFileTypeChange: (values: string[]) => void;
  onUploaderChange: (values: string[]) => void;
  onDateRangeChange: (values: string[]) => void;
  onAccessChange: (values: string[]) => void;
  onSortOrderChange: (values: string[]) => void;
  onFileNameSearchChange: (value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  viewType = "All files",
  fileType,
  uploader,
  dateRange,
  access,
  sortOrder,
  fileNameSearch,
  onFileTypeChange,
  onUploaderChange,
  onDateRangeChange,
  onAccessChange,
  onSortOrderChange,
  onFileNameSearchChange,
  uploaderOptions = [],
}) => {
  const documentOptions: FilterOption[] = [
    { id: "doc-1", label: "Documents", value: "document" },
    { id: "doc-2", label: "Spreadsheets", value: "spreadsheet" },
    { id: "doc-6", label: "Presentations", value: "presentation" },
    { id: "doc-3", label: "Images", value: "image" },
    { id: "doc-4", label: "Videos", value: "videos" },
    { id: "doc-5", label: "Music", value: "musics" },
    { id: "doc-7", label: "Audio", value: "audio" },
    { id: "doc-8", label: "Archives", value: "archive" },
    { id: "doc-9", label: "Code", value: "code" },
  ];

  const dateOptions: FilterOption[] = [
    { id: "date-1", label: "Today", value: "today" },
    { id: "date-2", label: "Last 7 days", value: "last-7-days" },
    { id: "date-3", label: "Last 30 days", value: "last-30-days" },
    { id: "date-4", label: "This year", value: "this-year" },
    { id: "date-5", label: "Last year", value: "last-year" },
  ];

  const sortOptions: FilterOption[] = [
    { id: "sort-1", label: "Newest to Oldest", value: "newest-to-oldest" },
    { id: "sort-2", label: "Oldest to Newest", value: "oldest-to-newest" },
  ];

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchInput = (
    <div className="relative min-w-[200px] max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
      <input
        type="search"
        value={fileNameSearch}
        onChange={(e) => onFileNameSearchChange(e.target.value)}
        placeholder="Search by file name"
        className="w-full rounded-md border border-[#E6EAEF] bg-white py-2 pl-9 pr-3 text-sm text-[#344054] placeholder:text-[#98A2B3] focus:border-[#5F5FE1] focus:outline-none focus:ring-1 focus:ring-[#5F5FE1] dark:bg-[#222529] dark:text-zinc-100"
        aria-label="Search by file name"
      />
    </div>
  );

  const desktopFilters = (
    <>
      {searchInput}
      <Sorting
        title="File Type"
        options={documentOptions}
        selectedValues={fileType}
        onSelectionChange={onFileTypeChange}
        multiSelect={false}
      />
      <Sorting
        title={
          viewType === "Deleted Files"
            ? "Deleted By"
            : viewType === "Shared with me"
              ? "Sender"
              : "Uploaded By"
        }
        options={uploaderOptions}
        selectedValues={uploader}
        onSelectionChange={onUploaderChange}
        multiSelect={false}
        showSearch={true}
      />

      <Sorting
        title={viewType === "Deleted Files" ? "Date Deleted" : "Date Modified"}
        options={dateOptions}
        selectedValues={dateRange}
        onSelectionChange={onDateRangeChange}
        multiSelect={false}
        position="right"
      />
    </>
  );

  const mobileFilters = (
    <>
      {searchInput}
      <Sorting
        title="File Type"
        options={documentOptions}
        selectedValues={fileType}
        onSelectionChange={onFileTypeChange}
        multiSelect={false}
      />
      <Sorting
        title={
          viewType === "Deleted Files"
            ? "Deleted By"
            : viewType === "Shared with me"
              ? "Sender"
              : "Uploaded By"
        }
        options={uploaderOptions}
        selectedValues={uploader}
        onSelectionChange={onUploaderChange}
        multiSelect={false}
        showSearch={true}
      />

      <Sorting
        title={viewType === "Deleted Files" ? "Date Deleted" : "Date Modified"}
        options={dateOptions}
        selectedValues={dateRange}
        onSelectionChange={onDateRangeChange}
        multiSelect={false}
      />
    </>
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="px-3 py-2 border border-[#E6EAEF] rounded-md flex items-center gap-2 text-sm font-medium text-[#344054] hover:bg-[#F6F7F9]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="hidden md:flex flex-wrap gap-2.5 items-center">
        {desktopFilters}
      </div>

      {showMobileFilters && (
        <div className="md:hidden w-full flex flex-col gap-2.5 p-3 bg-[#F9FAFB] rounded-md border border-[#E6EAEF]">
          {mobileFilters}
        </div>
      )}

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <Sorting
          title="Sort"
          options={sortOptions}
          selectedValues={sortOrder}
          onSelectionChange={onSortOrderChange}
          type="sort"
          position="right"
        />
      </div>
    </div>
  );
};

export default FilterSection;
