import { fetchStats } from "@/redux/statSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const Stats = () => {
  const { stats, loading, error, success } = useSelector(
    (state) => state.stats
  );
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.userRole);
  const query = useSelector((state) => state.search.query);
  const filtered = stats?.filter((item) => {
    return item.productName?.toLowerCase().includes(query.toLowerCase());
  });
  useEffect(() => {
    if (success) {
      return;
    }
    if (token && userRole) {
      dispatch(fetchStats({ token, userRole }));
    }
  }, [dispatch, token, userRole]);

  return (
    <div className="sm:me-5 sm:ms-2.5">
      {loading ? (
        // <div>
        //   <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
        // </div>
        <Table className={" md:w-[1100px]"}>
          <TableBody>
            {Array.from({ length: 15 }).map((_, index) => (
              <TableRow key={index}>
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
      ) : !loading && error ? (
        <p className="text-center font-semibold text-sm text-red-600">
          Something went wrong, check internet connection.
        </p>
      ) : (
        <Table className={"overflow-x-scroll md:w-[1100px]"}>
          <>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
                <TableHead>Product</TableHead>
                <TableHead className="rounded-l-sm">Total</TableHead>
                <TableHead>Product Assigned to delivery</TableHead>
                <TableHead>Delivered Count </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[12px] font-[Raleway] font-[500] ">
              {filtered.length === 0 ? (
                <p className="!text-center py-4">No data at the momemnt.</p>
              ) : (
                filtered?.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.totalCount}</TableCell>
                    <TableCell>{data.linkedToAnyDelivery}</TableCell>
                    <TableCell>{data.linkedToDeliveredDelivery}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </>
        </Table>
      )}
    </div>
  );
};

export default Stats;
