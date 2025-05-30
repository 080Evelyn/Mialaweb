import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BanknoteArrowUp, PenBox } from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
import DeliveryFormDialog from "./deliveryFormDialog";
import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelivery } from "@/redux/deliverySlice";
import DeliveryPaymentDialog from "./DeliveryPaymentDialog";

import { fetchRidersById } from "@/redux/riderByIdSlice";
import { fetchAllRiders } from "@/redux/allRiderSlice";

const initialFormState = {
  productName: "",
  qty: "",
  productPrice: "",
  receiverAddress: "",
  riderId: "",
  paymentStatus: "",
  deliveryStatus: "",
  receiverName: "",
  receiverPhone: "",
  deliveryFee: "",
  dueDate: "",
  uploadDate: "",
};

const DeliveryList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(initialFormState);
  const token = useSelector((state) => state.auth.token);
  const deliveryList = useSelector((state) => state.delivery.delivery);
  const selectedRider = useSelector((state) => state.riderById.riderById);
  const [formDataStep1, setFormDataStep1] = useState({
    name: "",
    userId: "",
    account_number: "",
    bank_code: "",
  });
  const multiCall = useSelector((state) => state.delivery.multiCall);
  const loading = useSelector((state) => state.delivery.loading);
  const success = useSelector((state) => state.delivery.success);
  const error = useSelector((state) => state.delivery.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);

  const filtered = deliveryList?.filter(
    (product) =>
      product?.productName.toLowerCase().includes(query.toLowerCase()) ||
      String(product?.deliveryCode).toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));
    if (success) {
      return;
    }
    dispatch(fetchDelivery({ token, userRole }));
  }, []);

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

  const handleOpenAdd = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    setFormMode("edit");
    setFormData({
      productName: data.productName || "",
      qty: data.qty || "",
      productPrice: data.productPrice != null ? data.productPrice : "",
      receiverAddress: data.receiverAddress || "",
      riderId: `${data.riderId} ` || "",
      paymentStatus: data.paymentStatus === "NOT_PAID" ? "NOT_PAID" : "PAID",
      deliveryStatus:
        data.deliveryStatus === "PENDING" ? "PENDING" : "DELIVERED",
      receiverName: data.receiverName || "",
      receiverPhone: data.receiverPhone || "",
      deliveryFee: data.deliveryFee || "",
      dueDate: data.dueDate || "",
      uploadDate: formatDateArray(data.uploadDate) || "",
    });
    setDialogOpen(true);
  };
  // Open the modal and fetch the rider
  const handleOpenPaymentModal = (data) => {
    const id = data.riderId;
    dispatch(fetchRidersById({ token, userRole, id }));
    setModalOpen(true); // open modal first
  };
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
        <p className="text-center font-semibold">Loading...</p>
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
        <DeliveryFormDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handleOpenAdd={handleOpenAdd}
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          initialState={initialFormState}
        />
      </div>
      <DeliveryPaymentDialog
        data={formDataStep1}
        setFormData={setFormDataStep1}
        dialogOpen={modalOpen}
        setDialogOpen={setModalOpen}
      />
      <Table className={""}>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Delivery Code</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Product Price(₦) </TableHead>
            <TableHead>Quantity </TableHead>
            <TableHead>Amount(₦) </TableHead>
            <TableHead>Delivery Fee(₦) </TableHead>
            <TableHead>Total(₦) </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500] ">
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
              <TableCell>{data.productName}</TableCell>
              <TableCell>{data.deliveryCode}</TableCell>
              <TableCell>{formatDateArray(data.uploadDate)}</TableCell>
              <TableCell>
                {Number(data.productPrice).toLocaleString()}
              </TableCell>
              <TableCell>{parseFloat(data.qty)}</TableCell>
              <TableCell>
                {(
                  Number(data.productPrice) * parseFloat(data.qty)
                ).toLocaleString()}
              </TableCell>
              <TableCell>{Number(data.deliveryFee).toLocaleString()}</TableCell>
              <TableCell>
                {(
                  Number(data.deliveryFee) +
                  Number(data.productPrice) * data.qty
                ).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      data.paymentApproval ? " bg-[#0FA301]" : " bg-red-500"
                    }`}
                  />
                  <button onClick={() => handleOpenEdit(data)}>
                    <PenBox className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
                  </button>
                  <DeliveryDetailsDialog data={data} />
                  {data.paymentApproval && (
                    <button
                      onClick={() => {
                        handleOpenPaymentModal(data);
                      }}
                      className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                      <BanknoteArrowUp className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryList;
