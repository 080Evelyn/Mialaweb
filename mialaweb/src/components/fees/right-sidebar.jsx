import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchRiders } from "@/redux/riderSlice";
import { BASE_URL } from "@/lib/Api";

const FeesSidebar = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const riders = useSelector((state) => state.riders.riders);
  const loading = useSelector((state) => state.riders.loading);
  const error = useSelector((state) => state.riders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);

  // Track open modal state
  const [openDialog, setOpenDialog] = useState("");
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchRiders({ token, userRole }));
  }, []);

  // Fetch details when dialog opens
  const handleOpen = async (index, agentId) => {
    setOpenDialog(index);
    setLoadingDetails(true);
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delivery-by-riderId/${agentId}`
          : `${BASE_URL}api/v1/subadmin/delivery-by-riderId/${agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setDetails(data.data);
    } catch (err) {
      console.error("Failed to fetch agent deliveries", err);
    } finally {
      setLoadingDetails(false);
    }
  };
  if (loading) {
    return <p className="text-center">Loading agents..</p>;
  }
  if (!loading && error) {
    return (
      <p className="text-sm text-red-600 text-center">
        Error fetching agents..
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="text-sm font-medium text-gray-700">Active Agents</div>

      {riders?.map((data, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex items-center gap-3">
            <img
              src={NewAgentAvatar}
              alt="agent avatar"
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {data.first_name} {data.last_name}
              </span>
            </div>
          </div>

          <Dialog
            open={openDialog === index}
            onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
            <DialogTrigger asChild>
              <Button
                className="h-6 px-3 text-xs bg-green-600 hover:bg-green-700 text-white rounded-[4px]"
                onClick={() => handleOpen(index, data.riderId)}>
                View Deliveries
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-[#B10303] text-left">
                  Agent Details
                </DialogTitle>
              </DialogHeader>

              {loadingDetails ? (
                <div className="py-4 text-center text-sm">Loading...</div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Agent Name</Label>
                    <span className="text-[10px] text-[#8C8C8C]">
                      {data.first_name} {data.last_name}
                    </span>
                  </div>

                  {/* Render delivery data in a table */}
                  {details ? (
                    <table className="w-full text-xs border mt-2">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-1 border">Product Name</th>
                          <th className="p-1 border">Delivery Code</th>
                          <th className="p-1 border"> Price</th>
                          <th className="p-1 border"> Fee</th>
                          <th className="p-1 border">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((item, i) => (
                          <tr key={i}>
                            <td className="p-1 border">{item.productName}</td>
                            <td className="p-1 border">{item.deliveryCode}</td>
                            <td className="p-1 border">{item.productPrice}</td>
                            <td className="p-1 border">{item.deliveryFee}</td>
                            <td className="p-1 border">
                              {Number(item.productPrice) +
                                Number(item.deliveryFee)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No delivery data available.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                  Close
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default FeesSidebar;
