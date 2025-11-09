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
import { Copy, Loader2, LoaderCircle, Pin } from "lucide-react";
import axios from "axios";
import { setRestricted } from "@/redux/restrictionSlice";
import RestrictionModal from "../common/RestrictionModal";

const FeesSidebar = () => {
  const dispatch = useDispatch();
  const [copiedCode, setCopiedCode] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);
  const riders = useSelector((state) => state.riders.riders);
  const loading = useSelector((state) => state.riders.loading);
  const error = useSelector((state) => state.riders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const restricted = useSelector((state) => state.restriction.restricted);

  // Track open modal state
  const [openDialog, setOpenDialog] = useState("");
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDetails = details?.filter((item) =>
    item.deliveryCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchRiders({ token, userRole }));
  }, []);

  const handlePinRider = async (id, status) => {
    if (permissions.includes("TAGS") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setIsLoading(true);
    setLoadingId(id);
    // setErrorMessage("");
    // setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/pin-rider`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/pin-rider`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/pin-rider`
          : `${BASE_URL}api/v1/accountant/pin-rider`,

        {
          riderId: id,
          pin: status,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // if (response.data.responseCode === "00") {

      dispatch(fetchRiders({ token, userRole }));

      // }
    } catch (error) {
      // setErrorMessage(`An error occured.`);
      console.log(error);
    } finally {
      setIsLoading(false);
      setLoadingId(null);
    }
  };

  // Fetch details when dialog opens
  const handleOpen = async (index, agentId) => {
    if (permissions.includes("ORDERS_MANAGEMENT") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setOpenDialog(index);
    setLoadingDetails(true);
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delivery-by-riderId/${agentId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delivery-by-riderId/${agentId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delivery-by-riderId/${agentId}`
          : `${BASE_URL}api/v1/accountant/delivery-by-riderId/${agentId}`,

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
    return (
      <>
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-3">
              {/* Icon skeleton */}
              <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />

              {/* Name skeleton */}
              <div className="flex flex-col gap-1">
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (!loading && error) {
    return (
      <p className="text-sm text-red-600 text-center">
        Error fetching agents..
      </p>
    );
  }
  const approved = riders?.filter((rider) => {
    return (
      rider?.approvalStatus === "APPROVED" ||
      rider.approvalStatus === "ACTIVATE"
    );
  });
  const sorted = approved && [...approved].sort((a, b) => b.pinned - a.pinned);
  // console.log(details);
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="text-sm font-medium text-gray-700">Active Agents</div>

      {sorted?.map((data, index) => (
        <div className="flex items-center justify-between gap-2" key={index}>
          <div className="flex items-center gap-3">
            <button
              disabled={loadingId === data.userId}
              onClick={() => handlePinRider(data.userId, !data.pinned)}
              className="ml-2 flex items-center"
              title={data.pinned ? "Unpin rider" : "Pin rider"}>
              {loadingId === data.userId ? (
                <Loader2 className="animate-spin w-5 h-5 !text-gray-400" />
              ) : (
                <Pin
                  className={`w-5 h-5 cursor-pointer ${
                    data.pinned
                      ? "!text-yellow-500 !fill-yellow-500"
                      : "!text-gray-400"
                  }`}
                />
              )}
            </button>
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
                onClick={() => handleOpen(index, data.userId)}>
                View Deliveries
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle className="text-[#B10303] text-left">
                  Agent Details
                </DialogTitle>
              </DialogHeader>

              {loadingDetails ? (
                <div className="py-4 text-center text-sm">Loading...</div>
              ) : (
                <div className="flex flex-col !h-[400px]  gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {data.first_name} {data.last_name}
                      </span>
                    </div>
                  </div>

                  {/* 🔍 Search Input */}
                  <div className="flex justify-end mb-2 mr-2">
                    <input
                      type="text"
                      placeholder="Search by Delivery Code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#B10303]"
                    />
                  </div>

                  {/* Render delivery data in a table */}
                  {details ? (
                    <div className="h-full overflow-y-auto">
                      <table className="w-full text-xs border mt-2">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-gray-100 text-left">
                            <th className="p-1 border">Product Name</th>
                            <th className="p-1 border">Delivery Code</th>
                            <th className="p-1 border">Delivery Fee (₦)</th>
                            <th className="p-1 border">Price (₦)</th>
                            <th className="p-1 border">
                              Price after discount (₦)
                            </th>
                            <th className="p-1 border">Quantity</th>
                            <th className="p-1 border">Total Price (₦)</th>
                            <th className="p-1 border">Delivery Status</th>
                            <th className="p-1 border">Customer Name</th>
                            <th className="p-1 border">Customer Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDetails.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="text-center py-3">
                                No matching deliveries found.
                              </td>
                            </tr>
                          ) : (
                            filteredDetails.map((item, i) => (
                              <tr key={i}>
                                <td className="p-1 border">
                                  {item?.products?.map((product, index) => (
                                    <div key={index}>{product.productName}</div>
                                  ))}
                                </td>

                                <td className="p-1 border flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <span>{item.deliveryCode}</span>
                                    <Copy
                                      size={16}
                                      className="cursor-pointer"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          item.deliveryCode
                                        );
                                        setCopiedCode(item.deliveryCode);
                                        setTimeout(
                                          () => setCopiedCode(null),
                                          2000
                                        );
                                      }}
                                    />
                                    {copiedCode === item.deliveryCode && (
                                      <span className="text-green-600 text-xs">
                                        Copied!
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="p-1 border">
                                  {item.deliveryFee}
                                </td>
                                <td className="p-1 border">
                                  {item?.products?.map((product, index) => (
                                    <div key={index}>
                                      {Number(
                                        product?.productPrice
                                      ).toLocaleString()}
                                    </div>
                                  ))}
                                </td>
                                <td className="p-1 border">
                                  {item?.products?.map((product, index) => (
                                    <div key={index}>
                                      {Number(
                                        product?.totalAfterDiscount /
                                          product?.qty
                                      ).toLocaleString()}
                                    </div>
                                  ))}
                                </td>
                                <td className="p-1 border">
                                  {item?.products?.map((product, index) => (
                                    <div key={index}>
                                      {Number(product?.qty).toLocaleString()}
                                    </div>
                                  ))}
                                </td>
                                <td className="p-1 border">
                                  {Number(item.finalTotal).toLocaleString()}
                                </td>
                                <td
                                  className={`p-1 border ${
                                    item.deliveryStatus === "DELIVERED"
                                      ? "text-green-500"
                                      : item.deliveryStatus === "CANCELLED" ||
                                        item.deliveryStatus ===
                                          "NOT_REACHABLE" ||
                                        item.deliveryStatus ===
                                          "FEE_REJECTED" ||
                                        item.deliveryStatus ===
                                          "FAILED_DELIVERY"
                                      ? "text-red-500"
                                      : "text-yellow-400"
                                  }`}>
                                  {item.deliveryStatus}
                                </td>
                                <td className="p-1 border">
                                  {item.receiverName}
                                </td>
                                <td className="p-1 border">
                                  {item.receiverAddress}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No delivery data available.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-[100px] text-sm rounded-[3px] h-9">
                  Close
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
    </div>
  );
};

export default FeesSidebar;
