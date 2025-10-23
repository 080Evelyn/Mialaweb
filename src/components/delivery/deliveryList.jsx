import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  PenBox,
  ArrowRightCircle,
  Copy,
  ArrowLeftRight,
  MessageSquare,
} from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
import DeliveryFormDialog from "./deliveryFormDialog";
import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDelivery,
  fetchDeliveryById,
  setMultiCallFalse,
} from "@/redux/deliverySlice";
import ExcelJS from "exceljs";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";
import { clearFilters } from "@/redux/searchSlice";
import ReassignDeliveryDialog from "../proposedFee/ReassignDeliveryDialog";
import CommentsDialog from "./CommentsDialog";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";

const initialFormState = {
  products: [
    {
      productName: "",
      quantity: "1",
      productPrice: "",
      totalAfterDiscount: "",
      productId: "",
    },
  ],
  riderId: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  customerPaymentStatus: "",
  paymentType: "",
  amountPaid: "",
  balance: "",
  dueDate: "",
  deliveryStatus: "PENDING",
  comments: [
    {
      receiverId: "",
      message: "",
    },
  ],
  totalProductValue: "",
  finalTotal: "",
};

const DeliveryList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [selectedReciever, setSelectedReciever] = useState(null);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(initialFormState);
  const [totalFinalPrice, setTotalFinalPrice] = useState(0);
  const [deliveryId, setDeliveryId] = useState("");
  const deliveryDetails = useSelector((state) => state.delivery.details);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const multiCall = useSelector((state) => state.delivery.multiCall);
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const { totalPages, currentPage, loading, error } = useSelector(
    (state) => state.delivery
  );

  const restricted = useSelector((state) => state.restriction.restricted);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const userId = useSelector((state) => state.auth.user.userId);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.search.filters);
  const query = useSelector((state) => state.search.query);
  const [copiedCode, setCopiedCode] = useState(null);
  const [commentStatuses, setCommentStatuses] = useState([]);

  // 🟩 Fetch comment status periodically
  const fetchCommentStatus = async () => {
    try {
      const res = await axios.get(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/comment-status/${userId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/comment-status/${userId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/comment-status/${userId}`
          : `${BASE_URL}api/v1/accountant/comment-status/${userId}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentStatuses(res.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch comment statuses:", err);
    }
  };
  // ⏱ Poll every 30 seconds
  useEffect(() => {
    fetchCommentStatus();
    const interval = setInterval(fetchCommentStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/mark-as-read/${id}?userId=${userId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/mark-as-read/${id}?userId=${userId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/mark-as-read/${id}?userId=${userId}`
          : `${BASE_URL}api/v1/accountant/mark-as-read/${id}?userId=${userId}`,

        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCommentStatus();
    } catch (err) {
      console.error("❌ Failed to fetch comment statuses:", err);
    }
  };
  // 🔍 Helper: get unread count for a delivery
  const getUnreadCount = (deliveryId) => {
    const item = commentStatuses.find((c) => c.deliveryId === deliveryId);
    return item?.newComments || 0;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString().split("T")[0];
  };
  const exportToExcel = async (data) => {
    const flatData = data.map((item) => {
      const products = Array.isArray(item.products) ? item.products : [];

      return {
        Agent: `${item.riderFirstName ?? ""} ${item.riderLastName ?? ""}`,
        DeliveryCode: item.deliveryCode ?? "",
        UploadDate: item.uploadDate ?? [],
        CustomerName: item.receiverName ?? "",
        // Products: products.map((p) => p.productName).join(", "),
        // ProductPrices: products
        //   .map((p) => Number(p.productPrice).toLocaleString())
        //   .join(", "),
        // Quantities: products.map((p) => p.qty).join(", "),
        DeliveryFee: Number(item.deliveryFee || 0).toLocaleString(),
        TotalFee: Number(item.totalProductValue || 0).toLocaleString(),
        CustomerPaymentStatus: item.customerPaymentStatus ?? "",
        PaymentType: item.paymentType ?? "",
        DeliveryStatus: item.deliveryStatus ?? "",
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Deliveries");

    // Add headers
    worksheet.columns = Object.keys(flatData[0]).map((key) => ({
      header: key,
      key: key,
      width: 20, // You can adjust width as needed
    }));

    // Add rows
    flatData.forEach((row) => worksheet.addRow(row));

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "delivery-list.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleAction = (id, index) => {
    setOpenDialog(index);
    setSelectedId(id);
  };

  // Function to open the dialog
  const handleViewComments = (deliveryId, riderId) => {
    setSelectedDeliveryId(deliveryId);
    setOpenCommentsDialog(true);
    setSelectedReciever(riderId);
  };

  const filtered = deliveryList?.filter((item) => {
    const searchMatch =
      item.riderFirstName.toLowerCase().includes(query.toLowerCase()) ||
      item.riderLastName.toLowerCase().includes(query.toLowerCase()) ||
      item.deliveryCode.toLowerCase().includes(query.toLowerCase());

    const agentMatch = filters.agent
      ? `${item.riderFirstName} ${item.riderLastName}`
          .toLowerCase()
          .includes(filters.agent.toLowerCase())
      : true;

    const statusMatch = filters.status
      ? (item?.deliveryStatus ?? "").toLowerCase() ===
          filters.status.toLowerCase() ||
        (item?.paymentType ?? "").toLowerCase() === filters.status.toLowerCase()
      : true;

    const { startDate, endDate } = filters;
    if (!startDate || !endDate) return searchMatch && agentMatch && statusMatch;

    const uploadDate = new Date(item.uploadDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const dateMatch =
      !isNaN(uploadDate) && !isNaN(start) && !isNaN(end)
        ? uploadDate >= start && uploadDate <= end
        : false;

    return searchMatch && agentMatch && statusMatch && dateMatch;
  });
  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));
    dispatch(fetchDelivery({ token, userRole, page }));
  }, [dispatch, token, userRole, page]);
  useEffect(() => {
    dispatch(clearFilters());
  }, []);

  const handleOpenAdd = () => {
    if (permissions.includes("ORDERS_MANAGEMENT") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setFormMode("add");
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    dispatch(fetchDeliveryById({ token, userRole, id: data.deliveryId }));

    if (permissions.includes("ORDERS_MANAGEMENT") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }

    setFormMode("edit");
    setDeliveryId(data.deliveryId);
    setDialogOpen(true);
  };
  // --- useEffect to hydrate formData when deliveryDetails updates ---
  useEffect(() => {
    if (formMode === "edit" && deliveryDetails.custPaymentStatus) {
      setFormData({
        products: Array.isArray(deliveryDetails.products)
          ? deliveryDetails.products
              .filter((product) => product.deleted === false)
              .map((product) => ({
                productId: product.productId || "",
                productName: product.productName || "",
                quantity: product.qty || "",
                finalPrice: product.totalAfterDiscount,
                productPrice:
                  product.totalAfterDiscount != null
                    ? product.totalAfterDiscount / product.qty
                    : "",
                originalPrice: product.productPrice,
              }))
          : [
              {
                productName: "",
                quantity: "",
                productPrice: "",
              },
            ],
        receiverAddress: deliveryDetails.receiverAddress || "",
        riderId: deliveryDetails.riderId || "",
        receiverName: deliveryDetails.receiverName || "",
        receiverPhone: deliveryDetails.receiverPhone || "",
        dueDate: deliveryDetails.dueDate || "",
        customerPaymentStatus: deliveryDetails.custPaymentStatus ?? "",
        paymentType: deliveryDetails.paymentType || "",
        amountPaid: deliveryDetails.amountPaid || "",
        balance: deliveryDetails.balance || "",
        deliveryStatus: deliveryDetails.deliveryStatus || "",
        finalTotal: deliveryDetails.finalTotal || 0,
        // note: deliveryDetails?.note || "",
      });
    }
    setTotalFinalPrice(deliveryDetails.finalTotal || 0);
  }, [deliveryDetails, formMode]);

  if (loading && !multiCall) {
    return (
      // <div>
      //   <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      // </div>
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
      <button
        onClick={() => exportToExcel(filtered)}
        className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 text-sm mb-4">
        Export as Excel
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Delivery List</h2>
        <DeliveryFormDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handleOpenAdd={handleOpenAdd}
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          initialState={initialFormState}
          deliveryId={deliveryId}
          totalFinalPrice={totalFinalPrice}
          setTotalFinalPrice={setTotalFinalPrice}
        />
      </div>
      {/* ✅ Scroll container */}
      <div className="overflow-y-auto max-h-[600px]  ">
        <div className="!max-w-[400px]  overflow-x-scroll border rounded-md md:min-w-full">
          <Table className="md:w-[1100px]  border-collapse table-fixed">
            <TableHeader className="sticky top-0 z-40 bg-[#D9D9D9]">
              <TableRow className="text-sm">
                <TableHead>Agent</TableHead>
                <TableHead>Delivery Code</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Delivery Fee(₦)</TableHead>
                <TableHead>Total(₦)</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-[12px] font-[Raleway] font-[500]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    No orders at the moment.
                  </td>
                </tr>
              ) : (
                filtered.map((data, index) => {
                  const unreadCount = getUnreadCount(data.deliveryId);

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2 mr-4">
                          <img
                            src={Avatar}
                            alt="avatar"
                            className="h-6 w-6 rounded-full"
                          />
                          <div className="flex gap-1">
                            <span>{data.riderFirstName}</span>
                            <span>{data.riderLastName}</span>
                          </div>
                        </div>
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

                      <TableCell>{formatDate(data.creationDate)}</TableCell>

                      <TableCell>
                        <button
                          onClick={() =>
                            handleViewComments(data.deliveryId, data.riderId)
                          }
                          className="relative bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md transition flex items-center gap-1">
                          <MessageSquare size={14} />
                          View
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                      </TableCell>

                      <TableCell>
                        {Number(data.deliveryFee).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(data.finalTotal).toLocaleString()}
                      </TableCell>
                      <TableCell>{data.receiverName}</TableCell>
                      <TableCell>
                        {data.paymentType.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell
                        className={
                          data.deliveryStatus === "FAILED_DELIVERY"
                            ? "text-red-500 capitalize"
                            : data.deliveryStatus === "PENDING"
                            ? "text-yellow-500"
                            : data.deliveryStatus === "DELIVERED"
                            ? "text-green-500"
                            : ""
                        }>
                        {data.deliveryStatus.replace(/_/g, " ")}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-3 items-center">
                          {data.customerPaymentStatus}
                          {data.deliveryStatus !== "DELIVERED" && (
                            <button onClick={() => handleOpenEdit(data)}>
                              <PenBox className="h-5 w-5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedId(data.deliveryId);
                              setDetailsOpen(true);
                            }}>
                            <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500" />
                          </button>
                          {data.deliveryStatus === "FAILED_DELIVERY" && (
                            <button
                              onClick={() => {
                                handleAction(data.deliveryId, index);
                              }}>
                              <ArrowLeftRight className="w-4 h-4 mr-2 hover:text-gray-500 cursor-pointer" />
                            </button>
                          )}
                        </div>
                        <ReassignDeliveryDialog
                          openDialog={openDialog}
                          setOpenDialog={setOpenDialog}
                          index={index}
                          id={selectedId}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* ✅ Single global details dialog */}
      {selectedId && (
        <DeliveryDetailsDialog
          id={selectedId}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
      <CommentsDialog
        open={openCommentsDialog}
        onClose={() => {
          setOpenCommentsDialog(false), markAsRead(selectedDeliveryId);
        }}
        deliveryId={selectedDeliveryId}
        token={token}
        receiverId={selectedReciever}
      />

      {/* <div className="flex gap-2 mt-4 m-auto w-[80%] justify-center flex-wrap">
        <button
          className={`${
            page === 0
              ? "bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          }`}
          disabled={page === 0}
          onClick={() => {
            setPage(page - 1);
            dispatch(setMultiCallFalse());
          }}>
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1.5 rounded-sm ${
              i === page
                ? "bg-[#B10303] text-white" // active page style
                : "bg-[#D9D9D9] hover:bg-gray-400"
            }`}
            onClick={() => {
              setPage(i);
              dispatch(setMultiCallFalse());
            }}>
            {i + 1}
          </button>
        ))}

        <button
          className={`${
            page + 1 >= totalPages
              ? "bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          }`}
          disabled={page + 1 >= totalPages}
          onClick={() => {
            setPage(page + 1);
            dispatch(setMultiCallFalse());
          }}>
          Next
        </button>
      </div> */}
    </div>
  );
};

export default DeliveryList;
