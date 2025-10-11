import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { NIGERIAN_STATES } from "@/config/stateData";
import { BASE_URL } from "@/lib/Api";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import axios from "axios";
import { fetchDelivery, setMultiCall } from "@/redux/deliverySlice";
import SuccessModal from "../common/SuccessModal";
import { setRestricted } from "@/redux/restrictionSlice";
import RestrictionModal from "../common/RestrictionModal";

const ReassignDeliveryDialog = ({ id, openDialog, setOpenDialog, index }) => {
  const adminId = useSelector((state) => state.auth.user.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({ riderId: "" });
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.permissions);
  const restricted = useSelector((state) => state.restriction.restricted);

  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    setFormData({ ...formData, riderId: "" });
    setLoadingAgents(true);
    try {
      const response = await axios.get(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/riders-by-state?state=${stateName}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/riders-by-state?state=${stateName}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/riders-by-state?state=${stateName}`
          : `${BASE_URL}api/v1/accountant/riders-by-state?state=${stateName}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAgents(response.data.data);
    } catch (error) {
      console.error("Failed to fetch agents by state", error);
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleReassign = async (e) => {
    e.preventDefault();
    if (permissions.includes("ORDERS_MANAGEMENT") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/reassign-delivery/${adminId}/${id}/rider/${formData.riderId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/reassign-delivery/${adminId}/${id}/rider/${formData.riderId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/reassign-delivery/${adminId}/${id}/rider/${formData.riderId}`
          : `${BASE_URL}api/v1/accountant/reassign-delivery/${adminId}/${id}/rider/${formData.riderId}`,

        null,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        dispatch(fetchDelivery({ token, userRole }));
        dispatch(setMultiCall());
        setSuccessMessage("Delivery Reassigned Successfully!");
        setSuccessModalOpen(true);

        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        `${error.response.data.responseDesc}` || "An error occured."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog === index) console.log(id);
  }, [openDialog]);
  return (
    <>
      <Dialog
        open={openDialog === index}
        onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[362px] ">
          <DialogHeader>
            <DialogTitle className="text-[#B10303]">
              {"Re-Assign Delivery"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* State Dropdown */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs">State</Label>
              <Select onValueChange={handleStateChange}>
                <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Agent Dropdown */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Agent</Label>
              <Select
                value={formData.riderId}
                onValueChange={(value) =>
                  setFormData({ ...formData, riderId: value })
                }
                disabled={!selectedState || loadingAgents}>
                <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                  <SelectValue
                    placeholder={loadingAgents ? "Loading..." : "Select Agent"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {agents.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      No agents found
                    </div>
                  ) : (
                    agents?.map((rider) => (
                      <SelectItem
                        key={rider.riderId}
                        className="hover:bg-gray-200 cursor-pointer"
                        value={rider.riderId.toString()}>
                        {`${rider.first_name} ${rider.last_name}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}
          {erorMessage && <p className="text-red-500 text-sm">{erorMessage}</p>}
          <div className="flex justify-end gap-2 ">
            <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
              Close
            </DialogClose>
            <Button
              onClick={handleReassign}
              type="submit"
              className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9">
              {isLoading ? "Processing..." : "Reassign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`${successMessage}`}
      />

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
    </>
  );
};

export default ReassignDeliveryDialog;
