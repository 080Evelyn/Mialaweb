import NewAgentAvatar from "../../assets/icons/new-agent-avatar.svg";
import { newAgentData } from "@/config/agentData";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingRiders } from "@/redux/pendingRidersSlice";
import SuccessModal from "../common/SuccessModal";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";

const AdminAgentSidebar = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const pendingRiders = useSelector(
    (state) => state.pendingRiders.pendingRiders
  );
  const loading = useSelector((state) => state.pendingRiders.loading);
  const error = useSelector((state) => state.pendingRiders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const restricted = useSelector((state) => state.restriction.restricted);

  useEffect(() => {
    dispatch(fetchPendingRiders({ token, userRole }));
  }, []);

  const handleApproveRider = async (id) => {
    if (userRole === "Accountant" || userRole === "CustomerCare") {
      dispatch(setRestricted(true));

      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.patch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/approve-rider-signup/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/approve-rider-signup/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/approve-rider-signup/${id}`
          : `${BASE_URL}api/v1/accountant/approve-rider-signup/${id}`,
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(fetchAllRiders({ token, userRole }));
      dispatch(fetchPendingRiders({ token, userRole }));
      setSuccessModalOpen(true);
      setSuccessMessage("Agent Approved!");
    } catch (error) {
      setErrorMessage("An error occurred.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center font-semibold mt-11 text-xs">
        Loading pending agents..
      </h2>
    );
  }
  if (!loading && error) {
    return (
      <h2 className="text-center font-semibold mt-11 text-xs">
        Error fetching pending agents.
      </h2>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="text-sm font-medium text-gray-700">New Agent</div>
      {pendingRiders?.length === 0 ? (
        <p className="text-sm font-semibold">
          No pending agents at the moment.
        </p>
      ) : (
        pendingRiders?.map((data, index) => (
          <div className="flex items-center justify-between gap-2" key={index}>
            <div className="flex items-center gap-3">
              {/* <img
                src={NewAgentAvatar}
                alt="agent avatar"
                className="h-10 w-10"
              /> */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{`${data.first_name} ${data.last_name}`}</span>
                {/* <span className="text-[9px] text-[#8C8C8C] ">{data.date}</span> */}
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              {/* <DialogTrigger asChild> */}
              <div className="flex flex-col gap-1">
                {/* <Button
                    className="h-6 px-3 text-xs text-[#8C8C8C] hover:bg-gray-100 border-[#8C8C8C] border-[1px] rounded-[4px]"
                    variant="ghost">
                    Cancel
                  </Button> */}
                <Button
                  onClick={() => {
                    if (
                      userRole === "Accountant" ||
                      userRole === "CustomerCare"
                    ) {
                      dispatch(setRestricted(true));

                      return;
                    } else {
                      setDialogOpen(true);
                    }
                  }}
                  className="h-6 px-3 text-xs bg-green-600 hover:bg-green-700 text-white rounded-[4px]">
                  Approve
                </Button>
              </div>
              {/* </DialogTrigger> */}
              <DialogContent className="sm:max-w-[362px] ">
                <DialogHeader>
                  <DialogTitle className="text-[#B10303] text-left">
                    Agent Details
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-0.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Agents Name</Label>
                    <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                      {`${data.first_name} ${data.last_name}`}
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
                      {data.approvalStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Account Number</Label>
                    <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                      {data.bankDetails.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Account Name</Label>
                    <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                      {data.bankDetails.accountName}
                    </span>
                  </div>
                </div>
                {successMessage && (
                  <p className="text-green-500 text-sm text-center">
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-sm text-center">
                    {errorMessage}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                    Block
                  </DialogClose>
                  <Button
                    onClick={() => {
                      handleApproveRider(data.userId);
                    }}
                    type="submit"
                    className="bg-[#153D80] hover:bg-[#153D80]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                    {isLoading ? "loading.." : "Approve"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))
      )}

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`Agent Approved Successfully.`}
      />
    </div>
  );
};

export default AdminAgentSidebar;
