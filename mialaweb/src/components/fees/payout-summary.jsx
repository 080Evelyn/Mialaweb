import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Avatar from "../../assets/icons/avatar.svg";
import { Link, useLocation } from "react-router";
import { payoutSummaryTableData } from "@/config/feesData";
import { Badge } from "../ui/badge";

const PayoutSummaryTable = () => {
  const location = useLocation();

  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Total Fees Collected</h2>
        <div className="flex gap-2.5 text-sm">
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/fees"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}
          >
            <Link to="/fees">Total Fee Collected </Link>
          </Button>
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/payout-summary"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}
          >
            <Link to="/payout-summary">Payout Summary</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
            <TableHead className="rounded-l-sm">Agent Name</TableHead>
            <TableHead>Completed Payout</TableHead>
            <TableHead>Last Payout Date</TableHead>
            <TableHead>Pending Payout </TableHead>
            <TableHead>Status </TableHead>
            <TableHead>
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm font-[Raleway] ">
          {payoutSummaryTableData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={Avatar}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{data.agentName}</span>
                </div>
              </TableCell>
              <TableCell>{data.completedPayout}</TableCell>
              <TableCell>{data.latestPayoutDate}</TableCell>
              <TableCell>₦{data.pendingPayout}</TableCell>
              <TableCell>
                <Badge
                  className={`text-sm rounded-xs font-[Raleway] ${
                    data.status === "Pending" ? "bg-[#FBBC02]" : "bg-[#0FA301]"
                  }`}
                >
                  {data.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                      <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[362px] ">
                    <DialogHeader>
                      <DialogTitle className="text-[#B10303] text-left">
                        Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-0.5">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Agent Name</Label>
                        <span className=" text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.agentName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Pending Payout</Label>
                        <span className=" text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.pendingPayout}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Status</Label>
                        <span
                          className={` text-right text-[10px] font-[Raleway] ${
                            data.status === "Pending"
                              ? "text-[#FBBC02]"
                              : "text-[#0FA301]"
                          }`}
                        >
                          {data.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Date</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.latestPayoutDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Account Number</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.accountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Bank</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.Bank}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 ">
                      <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                        Cancel
                      </DialogClose>
                      <DialogClose
                        type="submit"
                        className="bg-[#044616] hover:bg-[#044616]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9"
                      >
                        Done
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayoutSummaryTable;
