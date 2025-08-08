import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Performance = () => {
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);
  const riders = useSelector((state) => state.allRiders.allRiders);
  const loader = useSelector((state) => state.allRiders.loading);
  const error = useSelector((state) => state.allRiders.error);
  const filters = useSelector((state) => state.search.filters);
  const query = useSelector((state) => state.search.query);
  const dispatch = useDispatch();

  const approved = riders?.filter((rider) => {
    return rider.approvalStatus === "APPROVED";
  });

  const filtered = approved?.filter((item) => {
    const searchMatch =
      item.first_name.includes(query.toLowerCase()) ||
      item.last_name.toLowerCase().includes(query.toLowerCase());

    const agentMatch = filters.agent
      ? `${item.first_name} ${item.last_name}`
          .toLowerCase()
          .includes(filters.agent.toLowerCase())
      : true;

    const state = filters.states
      ? (item?.state ?? "").toLowerCase() === filters.states.toLowerCase()
      : true;
    return searchMatch && agentMatch && state;
  });
  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));
    // if (success) {
    //   return;
    // }
  }, []);
  return (
    <div>
      <Table className={"overflow-x-scroll md:w-[1100px]"}>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Delivery Assigned</TableHead>
            <TableHead>Delivery Delivered</TableHead>
            <TableHead>Delivery Percentage </TableHead>
            <TableHead>State </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500] ">
          {!loader && error ? (
            <p className="text-center text-red-500">Something went wrong</p>
          ) : filtered?.length === 0 ? (
            <p className="!text-center py-4">No orders at the momemnt.</p>
          ) : (
            filtered?.map((data, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span>{`${data.first_name} ${data.last_name} `}</span>
                </TableCell>

                <TableCell>{data.totalDeliveries}</TableCell>
                <TableCell>{data.deliveredCount}</TableCell>
                <TableCell>
                  {data.totalDeliveries > 0
                    ? (
                        (data.deliveredCount / data.totalDeliveries) *
                        100
                      ).toFixed(2)
                    : "0.00"}
                  %
                </TableCell>
                <TableCell>{data.state}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Performance;
