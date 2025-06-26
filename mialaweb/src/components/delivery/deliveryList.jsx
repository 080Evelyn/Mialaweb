import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenBox } from "lucide-react";
import Avatar from "../../assets/icons/avatar.svg";
import { useEffect, useState } from "react";
import DeliveryFormDialog from "./deliveryFormDialog";
import DeliveryDetailsDialog from "./deliveryDetailsDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelivery } from "@/redux/deliverySlice";
// import DeliveryPaymentDialog from "./DeliveryPaymentDialog";
import * as XLSX from "xlsx";
// import { fetchRidersById } from "@/redux/riderByIdSlice";
import { fetchAllRiders } from "@/redux/allRiderSlice";

const initialFormState = {
  products: [
    {
      productName: "",
      quantity: "",
      productPrice: "",
    },
  ],
  riderId: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  dueDate: "",
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
  // console.log(deliveryList);
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
  // console.log(deliveryList);
  const filtered = deliveryList?.filter((item) => {
    const productNames =
      item.products &&
      item?.products.map((p) => p.productName?.toLowerCase()).join(" "); // Join names into one string to use includes

    return (
      productNames?.includes(query.toLowerCase()) ||
      item.deliveryCode.toLowerCase().includes(query.toLowerCase())
    );
  });
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
  const exportToExcel = (data) => {
    const flatData = data.map((item) => {
      const products = Array.isArray(item.products) ? item.products : [];

      return {
        Agent: `${item.riderFirstName ?? ""} ${item.riderLastName ?? ""}`,
        DeliveryCode: item.deliveryCode ?? "",
        UploadDate: formatDateArray(item.uploadDate ?? []),
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

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deliveries");

    XLSX.writeFile(workbook, "delivery-list.xlsx");
  };

  const handleOpenAdd = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    setFormMode("edit");
    setDeliveryId(data.id);
    setFormData({
      products: Array.isArray(data.products)
        ? data.products.map((product) => ({
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
      <Table className={""}>
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
              <TableCell>{formatDateArray(data.uploadDate)}</TableCell>
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
              <TableCell>{Number(data.deliveryFee).toLocaleString()}</TableCell>
              <TableCell>{Number(data.totalFee).toLocaleString()}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryList;
