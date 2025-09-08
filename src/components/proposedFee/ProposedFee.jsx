import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, EllipsisVertical, Loader2, PenBox } from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
// import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelivery } from "@/redux/deliverySlice";
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
    if (
      permissions.includes("ACCEPT_REJECT_DELIVERY_FEE") ||
      userRole === "Admin"
    ) {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }

    dispatch(approveProposalFee({ token, userRole, id, adminId }));
  };
  const handleReject = (id) => {
    if (
      permissions.includes("ACCEPT_REJECT_DELIVERY_FEE") ||
      userRole === "Admin"
    ) {
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
        <h2 className="text-sm font-semibold">Delivery List</h2>
        {/* For adding and editting */}
      </div>
      {/* <DeliveryPaymentDialog
        data={formDataStep1}
        setFormData={setFormDataStep1}
        dialogOpen={modalOpen}
        setDialogOpen={setModalOpen}
      /> */}
      <Table className={""}>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Delivery Code</TableHead>
            <TableHead> Adress</TableHead>
            <TableHead> Status</TableHead>
            <TableHead> Proposed Fee(₦)</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          // onClick={() => {
          //   setAction(!action);
          // }}
          className="text-[12px] font-[Raleway] font-[500] ">
          {filtered?.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={Avatar}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{`${data.riderFirstName} ${data.riderLastName} `}</span>
                </div>
              </TableCell>
              <TableCell>
                {data?.products?.map((product, index) => (
                  <div key={index}>{product.productName}</div>
                ))}
              </TableCell>
              <TableCell>
                {data?.products?.map((product, index) => (
                  <div key={index}>{product.qty}</div>
                ))}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{data.deliveryCode}</span>
                  <Copy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data.deliveryCode);
                      setCopiedCode(data.deliveryCode);
                      setTimeout(() => setCopiedCode(null), 2000); // hide after 2s
                    }}
                  />
                  {copiedCode === data.deliveryCode && (
                    <span className="text-green-600 text-xs">Copied!</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{data.receiverAddress}</TableCell>
              <TableCell>{data.negotiationStatus}</TableCell>
              <TableCell>{Number(data.proposedFee).toLocaleString()}</TableCell>
              <TableCell>{data.uploadDate}</TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <EllipsisVertical
                    onClick={() => {
                      handleAction(data.id);
                    }}
                    className="items-center cursor-pointer text-[#8C8C8C]"
                  />
                </div>
                <ProposedFeeDialog
                  openDialog={openDialog}
                  setOpenDialog={setOpenDialog}
                  index={index}
                  id={selectedFee}
                />
                <ReassignDeliveryDialog
                  openDialog={dialogOpen}
                  setOpenDialog={setDialogOpen}
                  index={index}
                  id={selectedFee}
                />
                {action && selectedFee === data.id && (
                  <div className="shadow-2xl absolute right-[-50px] flex flex-col bg-gradient-to-tr from-white via-pink-300 to-rose-500  py-2 px-3">
                    <button
                      disabled={approvalLoading || rejectLoading}
                      onClick={() => {
                        handleApprove(selectedFee);
                      }}
                      className="text-[12px] font-bold text-black hover:bg-green-500 hover:shadow-2xl px-3 py-2 cursor-pointer ">
                      {approvalLoading ? "Processing..." : "Approve fee"}
                    </button>

                    <button
                      disabled={approvalLoading || rejectLoading}
                      onClick={() => {
                        handleReject(selectedFee);
                      }}
                      className="text-[12px] hover:bg-[#B10303] hover:text-white hover:shadow-2xl  font-bold text-black px-3 py-2 cursor-pointer">
                      {rejectLoading ? "Processing..." : "Reject fee"}
                    </button>

                    {approvalError && (
                      <p className="text-red-500">{approvalError}</p>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
