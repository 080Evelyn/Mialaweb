import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, EllipsisVertical } from "lucide-react";
// import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import ProposedFeeDialog from "./ProposedFeeDialog";
import ReassignDeliveryDialog from "./ReassignDeliveryDialog";
import { fetchProposedOrders } from "@/redux/proposedFeeSlice";
import { setRestricted } from "@/redux/restrictionSlice";
import RestrictionModal from "../common/RestrictionModal";
import {
  approveProposalFee,
  rejectProposalFee,
  resetApproveRejectState,
} from "@/redux/approveRejectProposalFeeSlice";
import { clearFilters } from "@/redux/searchSlice";
import SuccessModal from "../common/SuccessModal";

const ProposedFee = () => {
  // Track open modal state
  const [dialogOpen, setDialogOpen] = useState("");
  const [openDialog, setOpenDialog] = useState("");
  const [action, setAction] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const adminId = useSelector((state) => state.auth.user.userId);
  const permissions = useSelector((state) => state.auth.permissions);
  const restricted = useSelector((state) => state.restriction.restricted);
  const approvalLoading = useSelector(
    (state) => state.approveReject.approveLoading
  );
  const rejectLoading = useSelector(
    (state) => state.approveReject.rejectLoading
  );
  const success = useSelector((state) => state.approveReject.success);
  const rejectSuccess = useSelector(
    (state) => state.approveReject.rejectSuccess
  );
  const approvalError = useSelector((state) => state.approveReject.error);
  const [page, setPage] = useState(0);
  const { proposedOrders, errorOrders, loadingOrders, multiCall } = useSelector(
    (state) => state.proposedFee
  );
  const userRole = useSelector((state) => state.auth.user.userRole);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);

  const handleAction = (id) => {
    setAction(!action);
    setSelectedFee(id);
  };

  const handleApprove = (id) => {
    if (permissions.includes("DELIVERY_FEE") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }

    dispatch(approveProposalFee({ token, userRole, id, adminId }));
  };
  const handleReject = (id) => {
    if (permissions.includes("DELIVERY_FEE") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    dispatch(rejectProposalFee({ token, userRole, id, adminId }));
  };

  const filtered = proposedOrders?.filter((item) => {
    const productNames =
      item.products?.map((p) => p.productName?.toLowerCase()).join(" ") ?? "";

    const searchMatch =
      productNames.includes(query.toLowerCase()) ||
      item.deliveryCode.toLowerCase().includes(query.toLowerCase());

    const agentMatch = filters.agent
      ? `${item.riderFirstName} ${item.riderLastName}`
          .toLowerCase()
          .includes(filters.agent.toLowerCase())
      : true;

    const statusMatch = filters.status
      ? (item?.deliveryStatus ?? "").toLowerCase() ===
        filters.status.toLowerCase()
      : true;

    const dateMatch = (() => {
      const { startDate, endDate } = filters;

      if (!startDate || !endDate) return true; // No filtering if not both provided

      const uploadDate = new Date(item.uploadDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      if (isNaN(uploadDate) || isNaN(start) || isNaN(end)) return false;

      return uploadDate >= start && uploadDate <= end;
    })();

    return searchMatch && agentMatch && statusMatch && dateMatch;
  });

  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));

    dispatch(fetchProposedOrders({ token, userRole }));
    dispatch(clearFilters());
  }, [dispatch, token, userRole, page]);
  useEffect(() => {
    setTimeout(() => {
      dispatch(resetApproveRejectState());
    }, 5000);
    if (rejectSuccess) {
      setSuccessModalOpen(true);
      setSuccessMessage("Fee Rejected Successfully.");
    }
    if (success) {
      setSuccessModalOpen(true);
      setSuccessMessage("Fee Approved Successfully.");
    }
    if (rejectSuccess || success) {
      dispatch(fetchProposedOrders({ token, userRole }));
    }
  }, [rejectSuccess, success, approvalError]);
  if (loadingOrders && !multiCall) {
    return (
      <Table className={" md:w-[1100px]"}>
        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index}>
              {/* Agent (with avatar + name) */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-2.5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </TableCell>
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
    );
  }

  if (!loadingOrders && errorOrders) {
    return (
      <div>
        <p className="text-center font-semibold text-sm text-red-600">
          Something went wrong, check internet connection.
        </p>
      </div>
    );
  }
  return (
    <div className="sm:me-5 sm:ms-2.5 w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Delivery Fees</h2>
        {/* For adding and editting */}
      </div>
      {/* <DeliveryPaymentDialog
        data={formDataStep1}
        setFormData={setFormDataStep1}
        dialogOpen={modalOpen}
        setDialogOpen={setModalOpen}
      /> */}
      <div className="overflow-y-auto max-h-[600px] md:w-full">
        <div className="!max-w-[400px]  overflow-x-scroll border rounded-md md:min-w-full">
          <Table className="">
            <TableHeader className="sticky top-0 z-50 bg-[#D9D9D9]">
              <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
                <TableHead className="rounded-l-sm">Agent</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Delivery Code</TableHead>
                <TableHead> Address</TableHead>
                <TableHead> Status</TableHead>
                <TableHead> Delivery Fee(₦)</TableHead>
                <TableHead>Date </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[12px] font-[Raleway] font-[500]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No Proposed Fee
                  </td>
                </tr>
              ) : (
                filtered.map((data, index) => (
                  <TableRow key={index} className="align-top">
                    {/* Rider Info */}
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-2">
                        <span>{`${data.riderFirstName} ${data.riderLastName}`}</span>
                      </div>
                    </TableCell>

                    {/* Products */}
                    <TableCell colSpan={2}>
                      <div className="border border-gray-200 rounded-md bg-gray-50">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-1 text-left font-medium text-gray-600">
                                Product
                              </th>
                              <th className="p-1 text-left font-medium text-gray-600">
                                Qty
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.products?.map((product, i) => (
                              <tr key={i} className="border-t border-gray-200">
                                <td className="p-1">{product.productName}</td>
                                <td className="p-1">{product.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TableCell>

                    {/* Delivery Code */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{data.deliveryCode}</span>
                        <Copy
                          size={16}
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(data.deliveryCode);
                            setCopiedCode(data.deliveryCode);
                            setTimeout(() => setCopiedCode(null), 2000);
                          }}
                        />
                        {copiedCode === data.deliveryCode && (
                          <span className="text-green-600 text-xs">
                            Copied!
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{data.receiverAddress}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] ${
                          data.negotiationStatus === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : data.negotiationStatus === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}>
                        {data.negotiationStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      ₦{Number(data.proposedFee).toLocaleString()}
                    </TableCell>
                    <TableCell>{data.uploadDate}</TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="relative flex justify-end">
                        <EllipsisVertical
                          onClick={() => handleAction(data.id)}
                          className="cursor-pointer text-[#8C8C8C]"
                        />
                        {action && selectedFee === data.id && (
                          <div className="absolute right-0 top-6 w-[130px] bg-white border shadow-lg rounded-md overflow-hidden">
                            <button
                              disabled={approvalLoading}
                              onClick={() => handleApprove(selectedFee)}
                              className="block w-full text-left text-xs px-3 py-2 hover:bg-green-100">
                              {approvalLoading
                                ? "Processing..."
                                : "Approve fee"}
                            </button>
                            <button
                              disabled={rejectLoading}
                              onClick={() => handleReject(selectedFee)}
                              className="block w-full text-left text-xs px-3 py-2 hover:bg-red-100">
                              {rejectLoading ? "Processing..." : "Reject fee"}
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
      {/* <div className="flex gap-2 mt-4 m-auto w-[300px] justify-center">
        <button
          className={`${
            page === 0
              ? " bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          } `}
          disabled={page === 0}
          onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span className="items-center px-3 py-1.5">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className={`${
            page + 1 >= totalPages
              ? " bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          } `}
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div> */}
    </div>
  );
};

export default ProposedFee;
