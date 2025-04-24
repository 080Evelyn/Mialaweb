import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const DeliveryDetailsDialog = ({ data }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[362px] ">
      <DialogHeader>
        <DialogTitle className="text-[#B10303] text-left">Details</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-0.5">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Agent Name</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            {data.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Package</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            {data.package}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Amount</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            ₦{data.amount}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Package ID</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            {data.packageID}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Detailed Location</Label>
          <span className="text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            {data.location}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Status</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#0FA301] font-[Raleway]">
            {data.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Date</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            {data.date}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Total Amount Paid</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            ₦{data.amountPaid}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-xs">Delivery Fee</Label>
          <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
            ₦{data.deliveryFee}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2 ">
        <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
          Close
        </DialogClose>
        <Button
          type="submit"
          className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9"
        >
          Done
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeliveryDetailsDialog;
