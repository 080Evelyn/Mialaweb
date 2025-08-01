// components/CustomFilter.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "@/redux/filterSlice";

const CustomFilter = ({ page, filterConfig }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters?.filters[page] || {});

  const handleChange = (key, value) => {
    dispatch(setFilter({ page, filterKey: key, value }));
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {filterConfig.includes("date") && (
        <select
          onChange={(e) => handleChange("date", e.target.value)}
          value={filters.date || ""}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7">Last 7 Days</option>
          <option value="last30">Last 30 Days</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
      )}
      {filterConfig.includes("agent") && (
        <input
          placeholder="Agent Name"
          value={filters.agent || ""}
          onChange={(e) => handleChange("agent", e.target.value)}
        />
      )}
      {filterConfig.includes("state") && (
        <input
          placeholder="State"
          value={filters.state || ""}
          onChange={(e) => handleChange("state", e.target.value)}
        />
      )}
      {filterConfig.includes("status") && (
        <select
          onChange={(e) => handleChange("status", e.target.value)}
          value={filters.status || ""}>
          <option value="">All</option>
          <option value="DELIVERED">Delivered</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="NOT_REACHABLE">Not Reachable</option>
        </select>
      )}
    </div>
  );
};

export default CustomFilter;
