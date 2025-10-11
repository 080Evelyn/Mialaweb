import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { fetchAllRiders } from "@/redux/allRiderSlice";
import { fetchPerformance } from "@/redux/performanceSlice";
import { clearFilters } from "@/redux/searchSlice";
// import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Performance = () => {
  const userRole = useSelector((state) => state.auth.user.userRole);
  const startDate = useSelector((state) => state.performance.startDate);
  const endDate = useSelector((state) => state.performance.endDate);
  const riders = useSelector((state) => state.performance.performance);
  // console.log(riders);
  const token = useSelector((state) => state.auth.token);
  const loader = useSelector((state) => state.performance.loading);
  const error = useSelector((state) => state.performance.error);
  const filters = useSelector((state) => state.search.filters);
  const query = useSelector((state) => state.search.query);
  const dispatch = useDispatch();

  const filtered = riders?.filter((item) => {
    const searchMatch = item.riderFullName
      .toLowerCase()
      .includes(query.toLowerCase());

    const agentMatch = filters.agent
      ? `${item.riderFullName} `
          .toLowerCase()
          .includes(filters.agent.toLowerCase())
      : true;

    const state = filters.states
      ? (item?.riderState ?? "").toLowerCase() === filters.states.toLowerCase()
      : true;
    return searchMatch && agentMatch && state;
  });
  useEffect(() => {
    dispatch(fetchPerformance({ token, userRole, startDate, endDate }));
    dispatch(clearFilters());
  }, [startDate, endDate, token, userRole]);

  if (loader) {
    return (
      <Table className={" md:w-[1100px]"}>
        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index}>
              {/* Agent (with avatar + name) */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-2.5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </TableCell>

              {/* Delivery Code */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Date */}
              <TableCell>
                <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Delivery Fee */}
              <TableCell>
                <div className="h-2.5 w-14 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Total */}
              <TableCell>
                <div className="h-2.5 w-14 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Customer Payment Status */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Rider Payment Status */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  if (
    !loader &&
    error ===
      "You do not have permission to perform this action: ORDERS_MANAGEMENT"
  ) {
    return (
      <div>
        <p className="text-center font-semibold text-sm text-red-600">
          You do not have permission to perform this data
        </p>
      </div>
    );
  }
  if (!loader && error) {
    return (
      <div>
        <p className="text-center font-semibold text-sm text-red-600">
          Something went wrong, check internet connection.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto border rounded-md">
      <Table className="md:w-[1100px] table-fixed">
        <TableHeader className="sticky top-0 z-50 bg-[#D9D9D9]">
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Delivery Assigned</TableHead>
            <TableHead>Delivery Delivered</TableHead>
            <TableHead>Delivery Percentage</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-[12px] font-[Raleway] font-[500]">
          {filtered?.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.riderFullName}</TableCell>
              <TableCell>{data.totalDeliveries}</TableCell>
              <TableCell>{data?.deliveredCount || "0"}</TableCell>
              <TableCell>
                {data?.deliveredCount > 0
                  ? (
                      (data?.deliveredCount / data.totalDeliveries) *
                      100
                    ).toFixed(2)
                  : "0.00"}
                %
              </TableCell>
              <TableCell>{data.riderState}</TableCell>
              <TableCell>{data.uploadDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Performance;
