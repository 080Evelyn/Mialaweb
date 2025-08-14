import { AlignJustify, Search, XCircle } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "../ui/input";
import Filter from "../../assets/icons/Filter.svg";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setFilters, clearFilters } from "@/redux/searchSlice";
import { useEffect } from "react";
import { fetchRiders } from "@/redux/riderSlice";
import { NIGERIAN_STATES } from "@/config/stateData";

function AdminHeader({ setOpen, rightSidebar }) {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);
  const token = useSelector((state) => state.auth.token);
  const riders = useSelector((state) => state.riders.riders);
  const loading = useSelector((state) => state.riders.loading);
  const error = useSelector((state) => state.riders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const location = useLocation();
  const path = location.pathname;
  const showFilter =
    path === "/delivery" ||
    path === "/proposedFee" ||
    path === "/products" ||
    path === "/Fees" ||
    path === "/performance" ||
    path === "/payout-summary";

  const approved = riders?.filter((rider) => {
    return rider?.approvalStatus === "APPROVED";
  });
  const sorted = riders && [...approved].sort((a, b) => b.pinned - a.pinned);

  const breadcrumbMap = {
    "/": "Home",
    "/overview": "Home",
    "/agents": "Agents",
    "/fees": "Revenue",
    "/delivery": "Delivery",
    "/products": "Products",
    "/settings": "Settings",
    "/admin/agents": "Agents & Admins",
    "/admin/sub-admins": "Agents & Admins",
    "/payout-summary": "Payout-Summary",
  };

  const breadcrumbLabel = breadcrumbMap[path] || "Page";

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ ...filters, [field]: value }));
  };

  const handleResetFilters = () => {
    dispatch(clearFilters());
  };

  useEffect(() => {
    dispatch(fetchRiders({ token, userRole }));
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-background border-b px-5 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="lg:hidden sm:block cursor-pointer">
            <AlignJustify />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/overview">Dashboards</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {path && (
                <>
                  <BreadcrumbSeparator>
                    <span>/</span>
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col gap-2 sm:flex-1 sm:items-end">
          {/* Search Bar */}
          <div
            className={`relative w-full sm:w-auto ${
              rightSidebar ? "me-0" : "me-45"
            }`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <img
              src={Filter}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-6 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className={`pl-9 pr-9 w-full border-0 bg-black/4 transition-all duration-300 ${
                rightSidebar ? "lg:w-[280px]" : "lg:w-[407px]"
              }`}
            />
          </div>

          {/* Filter Controls */}
          {showFilter && (
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {path !== "/products" && path !== "/payout-summary" && (
                <>
                  {path === "/performance" || path === "/Fees" ? (
                    <select
                      value={filters.states || ""}
                      id="state-select"
                      onChange={(e) =>
                        handleFilterChange("states", e.target.value)
                      }
                      className="w-[200px] py-1 text-sm border rounded px-2 bg-white">
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map((state) => (
                        <option className="bg-white" key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="px-2 py-1 border rounded text-sm">
                      <option value="">Status</option>
                      <option value="PENDING">PENDING</option>
                      {/* <option value="PACKAGE_DELIVERED">
                          PACKAGE_DELIVERED
                        </option> */}
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="PROCESSING">PICKEDUP</option>
                      <option value="FEE_PROPOSED">NOT_REACHABLE</option>
                      <option value="FEE_REJECTED">NOT_PICKING</option>
                      <option value="FEE_REJECTED">DELIVERED</option>
                    </select>
                  )}
                  <select
                    value={filters.agent || ""}
                    onChange={(e) =>
                      handleFilterChange("agent", e.target.value)
                    }
                    className="px-2 py-1 border rounded text-sm">
                    <option value="">Agent</option>
                    {sorted?.map((rider) => (
                      <option
                        key={rider.riderId}
                        value={`${rider.first_name} ${rider.last_name}`}>
                        {`${rider.first_name} ${rider.last_name}`}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {path !== "/performance" && (
                <>
                  <select
                    onChange={(e) => {
                      const today = new Date();
                      let startDate = "";
                      let endDate = today.toISOString().split("T")[0]; // default end date = today

                      switch (e.target.value) {
                        case "yesterday":
                          const yesterday = new Date(today);
                          yesterday.setDate(today.getDate() - 1);
                          startDate = yesterday.toISOString().split("T")[0];
                          endDate = yesterday.toISOString().split("T")[0];
                          break;
                        case "last7":
                          const last7 = new Date(today);
                          last7.setDate(today.getDate() - 7);
                          startDate = last7.toISOString().split("T")[0];
                          break;
                        case "last30":
                          const last30 = new Date(today);
                          last30.setDate(today.getDate() - 30);
                          startDate = last30.toISOString().split("T")[0];
                          break;
                        case "thisWeek":
                          const firstDayOfWeek = new Date(today);
                          firstDayOfWeek.setDate(
                            today.getDate() - today.getDay()
                          );
                          startDate = firstDayOfWeek
                            .toISOString()
                            .split("T")[0];
                          break;
                        case "thisMonth":
                          const firstDayOfMonth = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            1
                          );
                          startDate = firstDayOfMonth
                            .toISOString()
                            .split("T")[0];
                          break;
                        default:
                          startDate = "";
                          endDate = "";
                      }

                      dispatch(setFilters({ startDate, endDate }));
                    }}
                    className="px-2 py-1 border rounded text-sm">
                    <option value="">Quick Filter</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                  <>
                    <label className="text-sm"> start date</label>
                    <input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="px-2 py-1 border rounded text-sm"
                    />
                  </>
                  <>
                    <label className="text-sm"> end date</label>
                    <input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="px-2 py-1 border rounded text-sm"
                    />
                  </>
                </>
              )}

              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-red-500 px-2 py-1 hover:text-red-600 flex items-center gap-1 text-sm">
                <XCircle className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
