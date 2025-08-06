import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, PenBox } from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
import DeliveryFormDialog from "./deliveryFormDialog";
import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelivery } from "@/redux/deliverySlice";
// import DeliveryPaymentDialog from "./DeliveryPaymentDialog";
import ExcelJS from "exceljs";
// import { fetchRidersById } from "@/redux/riderByIdSlice";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";

const initialFormState = {
  products: [
    {
      productName: "",
      quantity: "",
      productPrice: "",
      discountPercent: "",
    },
  ],
  riderId: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  customerPaymentStatus: "",
  // riderPaymentStatus: "",
  // agreementStatus: "",
  // negotiationStatus: "",
  paymentType: "",
  amountPaid: "",
  balance: "",
  dueDate: "",
  deliveryStatus: "",
};

const DeliveryList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(initialFormState);
  const [deliveryId, setDeliveryId] = useState("");
  const token = useSelector((state) => state.auth.token);
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const selectedRider = useSelector((state) => state.riderById.riderById);
  const restricted = useSelector((state) => state.restriction.restricted);

  const [page, setPage] = useState(0);
  const { totalPages, currentPage, loading } = useSelector(
    (state) => state.delivery
  );
  // console.log(deliveryList);
  const [formDataStep1, setFormDataStep1] = useState({
    name: "",
    userId: "",
    account_number: "",
    bank_code: "",
  });
  const multiCall = useSelector((state) => state.delivery.multiCall);
  // const success = useSelector((state) => state.delivery.success);
  const error = useSelector((state) => state.delivery.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.search.filters);
  const query = useSelector((state) => state.search.query);

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

  const exportToExcel = async (data) => {
    const flatData = data.map((item) => {
      const products = Array.isArray(item.products) ? item.products : [];

      return {
        Agent: `${item.riderFirstName ?? ""} ${item.riderLastName ?? ""}`,
        DeliveryCode: item.deliveryCode ?? "",
        UploadDate: item.uploadDate ?? [],
        Products: products.map((p) => p.productName).join(", "),
        ProductPrices: products
          .map((p) => Number(p.productPrice).toLocaleString())
          .join(", "),
        Quantities: products.map((p) => p.qty).join(", "),
        DeliveryFee: Number(item.deliveryFee || 0).toLocaleString(),
        TotalFee: Number(item.totalFee || 0).toLocaleString(),
        CustomerPaymentStatus: item.custPaymentStatus ?? "",
        RiderPaymentStatus: item.riderPaymentStatus ?? "",
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

  const handleOpenAdd = () => {
    if (userRole === "Accountant") {
      dispatch(setRestricted(true));

      return;
    }
    setFormMode("add");
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    // console.log(data);
    if (userRole === "Accountant") {
      dispatch(setRestricted(true));

      return;
    }
    // console.log(data);
    setFormMode("edit");
    setDeliveryId(data.id);
    setFormData({
      products: Array.isArray(data.products)
        ? data.products.map((product) => ({
            productId: product.id || "",
            productName: product.productName || "",
            quantity: product.qty || "",
            productPrice:
              product.productPrice != null ? product.productPrice : "",
          }))
        : [
            {
              productName: "",
              quantity: "",
              productPrice: "",
            },
          ],
      receiverAddress: data.receiverAddress || "",
      riderId: `${data.riderId} ` || "",
      receiverName: data.receiverName || "",
      receiverPhone: data.receiverPhone || "",
      dueDate: data.dueDate || "",
      customerPaymentStatus: data.custPaymentStatus || "",
      // riderPaymentStatus: data.riderPaymentStatus || "",
      // agreementStatus: data.agreementStatus || "",
      // negotiationStatus: data.negotiationStatus || "",
      paymentType: data.paymentType || "",
      amountPaid: data.amountPaid || "",
      balance: data.balance || "",
      deliveryStatus: data.deliveryStatus || "",
    });
    setDialogOpen(true);
  };
  // Open the modal and fetch the rider
  // const handleOpenPaymentModal = (data) => {
  //   const id = data.riderId;
  //   dispatch(fetchRidersById({ token, userRole, id }));
  //   setModalOpen(true); // open modal first
  // };
  useEffect(() => {
    if (modalOpen && selectedRider) {
      setFormDataStep1({
        name: selectedRider.accountName || "",
        userId: selectedRider.userId || "",
        account_number: selectedRider.accountNumber || "",
        bank_code: selectedRider.bankName || "",
      });
    }
  }, [selectedRider, modalOpen]);

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
      <button
        onClick={() => exportToExcel(filtered)}
        className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 text-sm mb-4">
        Export as Excel
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Delivery List</h2>
        {/* For adding and editting */}
        <DeliveryFormDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handleOpenAdd={handleOpenAdd}
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          initialState={initialFormState}
          deliveryId={deliveryId}
        />
      </div>
      {/* <DeliveryPaymentDialog
        data={formDataStep1}
        setFormData={setFormDataStep1}
        dialogOpen={modalOpen}
        setDialogOpen={setModalOpen}
      /> */}
      <Table className={"overflow-x-scroll md:w-[1100px]"}>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Delivery Code</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Product Price(₦) </TableHead>
            <TableHead>Quantity </TableHead>
            <TableHead>Delivery Fee(₦) </TableHead>
            <TableHead>Total(₦) </TableHead>
            <TableHead>Customer Payment Status</TableHead>
            <TableHead>Rider Payment Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500] ">
          {filtered.length === 0 ? (
            <p className="!text-center py-4">No orders at the momemnt.</p>
          ) : (
            filtered?.map((data, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={Avatar}
                      alt="avatar"
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{`${data.riderFirstName}  ${data.riderLastName} `}</span>
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
                  {data?.products?.map((product, index) => (
                    <div key={index}>
                      {Number(product?.productPrice).toLocaleString()}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {data?.products?.map((product, index) => (
                    <div key={index}>{parseFloat(product.qty)}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {Number(data.deliveryFee).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(data.totalProductValue).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    {data.custPaymentStatus}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    {data.riderPaymentStatus}
                    <button onClick={() => handleOpenEdit(data)}>
                      <PenBox className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
                    </button>
                    <DeliveryDetailsDialog data={data} />
                    {/* {data.paymentApproval && (
                    <button
                      onClick={() => {
                        handleOpenPaymentModal(data);
                      }}
                      className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                      <BanknoteArrowUp className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
                    </button>
                  )} */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
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

export default DeliveryList;
