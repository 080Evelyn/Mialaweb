import { newAdminData } from "@/config/adminData";
import NewAgentAvatar from "../../assets/icons/new-agent-avatar.svg";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";

const AgentSidebar = () => {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="text-sm font-medium text-gray-700">New Agent</div>
      {newAdminData.map((data, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex items-center gap-3">
            {/* <img
              src={NewAgentAvatar}
              alt="agent avatar"
              className="h-10 w-10"
            /> */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{data.agentName}</span>
              <span className="text-[9px] text-[#8C8C8C] ">{data.date}</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-col gap-1">
                <Button
                  className="h-6 px-3 text-xs text-[#8C8C8C] hover:bg-gray-100 border-[#8C8C8C] border-[1px] rounded-[4px]"
                  variant="ghost">
                  Cancel
                </Button>
                <Button className="h-6 px-3 text-xs bg-[#153D80] hover:bg-[#153D80]/80 text-white rounded-[4px]">
                  Approved
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[362px] ">
              <DialogHeader>
                <DialogTitle className="text-[#B10303] text-left">
                  SubAdmin Details
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
                  <span className="text-sm text-right text-[10px] text-[#FBBC02] font-[Raleway]">
                    {data.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Date</Label>
                  <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data.date}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                  Cancel
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-[#153D80] hover:bg-[#153D80]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default AgentSidebar;
