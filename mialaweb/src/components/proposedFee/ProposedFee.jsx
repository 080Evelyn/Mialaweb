import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Loader2, PenBox } from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
// import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelivery } from "@/redux/deliverySlice";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import ProposedFeeDialog from "./ProposedFeeDialog";
import ReassignDeliveryDialog from "./ReassignDeliveryDialog";

const ProposedFee = () => {
  // Track open modal state
  const [dialogOpen, setDialogOpen] = useState("");
  const [openDialog, setOpenDialog] = useState("");
  const [action, setAction] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const selectedRider = useSelector((state) => state.riderById.riderById);
  // console.log(deliveryList);
  const handleAction = (id) => {
    setAction(!action);
    setSelectedFee(id);
  };
  const [page, setPage] = useState(0);
  const { delivery, totalPages, currentPage, loading } = useSelector(
    (state) => state.delivery
  );
  const multiCall = useSelector((state) => state.delivery.multiCall);
  const error = useSelector((state) => state.delivery.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);

  const handleViewProposedFee = (index) => {
    setOpenDialog(index);
  };
  const handleOpenAssignModal = (index) => {
    setDialogOpen(index);
  };
  const delivered = deliveryList?.filter((rider) => {
    return rider.deliveryStatus === "DELIVERED";
  });
  const filtered = deliveryList?.filter((item) => {
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
    // if (success) {
    //   return;
    // }
    dispatch(fetchDelivery({ token, userRole, page }));
  }, [dispatch, token, userRole, page]);

  function formatDateArray(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length !== 3) {
      throw new Error("Invalid date array. Expected format: [YYYY, MM, DD]");
    }

    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  if (loading && !multiCall) {
    return (
      <div>
        <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div>
        <p className="text-center font-semibold text-sm text-red-600">
          Something went wrong, check internet connection.
        </p>
      </div>
    );
  }
  return (
    <div className="sm:me-5 sm:ms-2.5">
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
            <TableHead>Delivery Code</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          onClick={() => {
            setAction(!action);
          }}
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
              <TableCell>{data.deliveryCode}</TableCell>
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
                  <div className="shadow-2xl absolute right-10 flex flex-col bg-white h-[80px] w-[200px]">
                    <button
                      onClick={() => {
                        handleViewProposedFee(index);
                      }}
                      className="text-[12px] font-bold text-black hover:bg-[#D6D6D6] hover:shadow-2xl px-3 py-2 cursor-pointer ">
                      View proposed fee
                    </button>
                    <button
                      onClick={() => {
                        handleOpenAssignModal(index);
                      }}
                      className="text-[12px] hover:bg-[#D6D6D6] hover:shadow-2xl  font-bold text-black px-3 py-2 cursor-pointer">
                      Reassign delivery
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex gap-2 mt-4 m-auto w-[300px] justify-center">
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
      </div>
    </div>
  );
};

export default ProposedFee;
