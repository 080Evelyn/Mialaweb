import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle, PenBox, Trash2 } from "lucide-react";
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
import { agentsTableData } from "@/config/agentData";
import { Link, useLocation } from "react-router";

const AdminAgentList = () => {
  const location = useLocation();

  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Agent Listing</h2>
        <div className="flex gap-2.5 text-sm">
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/agents"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}
          >
            <Link to="/admin/agents">Agents </Link>
          </Button>
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/sub-admins"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}
          >
            <Link to="/admin/sub-admins">SubAdmins</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
            <TableHead className="rounded-l-sm">Agent Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Total Deliveries</TableHead>
            <TableHead>Total Fees Collected </TableHead>
            <TableHead>Time Frame </TableHead>
            <TableHead>
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] ">
          {agentsTableData.map((data, index) => (
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
              <TableCell>{data.state}</TableCell>
              <TableCell>{data.totalDeliveriesMade}</TableCell>
              <TableCell>₦{data.totalRevenueGenerated}</TableCell>
              <TableCell>{data.date}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                      <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[362px]">
                    <DialogHeader>
                      <DialogTitle className="text-[#B10303] text-left">
                        Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-0.5">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Agent Name</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.agentName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Email</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Phone</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.phone}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">State</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.state}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Status</Label>
                        <span className="text-sm text-right text-[10px] text-[#0FA301] font-[Raleway]">
                          {data.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Date</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.date}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">NIN</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.nin}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Total Deliveries Made</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.totalDeliveriesMade}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          Total Revenue Generated
                        </Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          ₦{data.totalRevenueGenerated}
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
                          {data.bank}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 ">
                      <Button className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                        Report
                      </Button>
                      <DialogClose
                        type="submit"
                        className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9"
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

export default AdminAgentList;
