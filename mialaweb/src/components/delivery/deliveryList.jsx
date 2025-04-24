import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenBox } from "lucide-react";
import { deliveryTableData } from "@/config/deliveryTableData";
import Avatar from "../../assets/icons/avatar.svg";
import { useState } from "react";
import DeliveryFormDialog from "./deliveryFormDialog";
import DeliveryDetailsDialog from "./deliveryDetailsDialog";

const initialFormState = {
  productName: "",
  stockQuantity: "",
  price: "",
  location: "",
  agent: "",
  paymentStatus: "",
  deliveryStatus: "",
};

const DeliveryList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    setFormMode("edit");
    setFormData({
      productName: data.product || "",
      stockQuantity: data.quantity || "",
      price: data.amountPaid != null ? `₦${data.amountPaid}` : "",
      location: data.location || "",
      agent: data.name || "",
      paymentStatus: data.paymentStatus || "not_paid",
      deliveryStatus:
        data.status === "successful" ? "delivered" : "not_delivered",
    });
    setDialogOpen(true);
  };

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
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Package ID</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Amount Paid </TableHead>
            <TableHead>Delivery Fee </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500]">
          {deliveryTableData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={Avatar}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{data.name}</span>
                </div>
              </TableCell>
              <TableCell>{data.product}</TableCell>
              <TableCell>{data.packageID}</TableCell>
              <TableCell>{data.date}</TableCell>
              <TableCell>₦{data.amountPaid}</TableCell>
              <TableCell>₦{data.deliveryFee}</TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      data.status === "successful"
                        ? "bg-[#0FA301]"
                        : "bg-red-500"
                    }`}
                  />
                  <button onClick={() => handleOpenEdit(data)}>
                    <PenBox className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500" />
                  </button>

                  <DeliveryDetailsDialog data={data} />
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
