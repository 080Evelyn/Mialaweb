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

function AdminHeader({ setOpen, rightSidebar }) {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);
  const token = useSelector((state) => state.auth.token);
  const riders = useSelector((state) => state.riders.riders);
  const loading = useSelector((state) => state.riders.loading);
  const error = useSelector((state) => state.riders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  // console.log(riders);
  const location = useLocation();
  const path = location.pathname;
  const showFilter = path === "/delivery" || path === "/proposedFee";

  const breadcrumbMap = {
    "/": "Home",
    "/overview": "Home",
    "/agents": "Agents",
    "/fees": "Fees",
    "/delivery": "Delivery",
    "/products": "Products",
    "/settings": "Settings",
    "/admin/agents": "Agents & Admins",
    "/admin/sub-admins": "Agents & Admins",
    "/payout-summary": "Fees",
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
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-2 py-1 border rounded text-sm">
                <option value="">Status</option>
                {/* <option value="CUSTOMER_PAID">CUSTOMER_PAID</option>
                <option value="CUSTOMER_NOT_PAID">CUSTOMER_NOT_PAID</option> */}
                <option value="PENDING">PENDING</option>
                <option value="PACKAGE_DELIVERED">PACKAGE_DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="FEE_PROPOSED">FEE_PROPOSED</option>
                <option value="FEE_REJECTED">FEE_REJECTED</option>
              </select>

              <select
                value={filters.agent || ""}
                onChange={(e) => handleFilterChange("agent", e.target.value)}
                className="px-2 py-1 border rounded text-sm">
                <option value="">Agent</option>
                {riders?.map((rider) => (
                  <option
                    key={rider.riderId}
                    value={`${rider.first_name} ${rider.last_name}`}>
                    {`${rider.first_name} ${rider.last_name}`}
                  </option>
                ))}
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
