import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { BASE_URL } from "@/lib/Api";
import axios from "axios";
import { fetchDelivery } from "@/redux/deliverySlice";

const DeliveryFormDialog = ({
  dialogOpen,
  setDialogOpen,
  formMode,
  formData,
  setFormData,
  handleOpenAdd,
  initialState,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const riders = useSelector((state) => state.riders.riders);
  const id = useSelector((state) => state.auth.user.userId);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      formData.productName === "" ||
      formData.qty === "" ||
      formData.productPrice === "" ||
      formData.receiverAddress === "" ||
      formData.riderId === "" ||
      formData.paymentStatus === "" ||
      formData.deliveryStatus === "" ||
      formData.receiverName === "" ||
      formData.receiverPhone === "" ||
      formData.dueDate === "" ||
      formData.uploadDate === "" ||
      formData.deliveryFee === ""
    ) {
      setErrorMessage("All Fields Must be Filled!!");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/create-delivery/${id}`
          : `${BASE_URL}api/v1/subadmin/create-delivery/${id}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        dispatch(fetchDelivery({ token, userRole }));
        setSuccessMessage("Delivery Created Successfully!");
        setFormData(initialState);
      }
    } catch (error) {
      setErrorMessage(`An error occured while creating delivery.`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.put(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/update-delivery/${id}`
          : `${BASE_URL}api/v1/subadmin/update-delivery/${id}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        dispatch(fetchDelivery({ token }));
        setSuccessMessage("Delivery Edited Successfully!");
      }
    } catch (error) {
      setErrorMessage(`An error occured while editing delivery.`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAdd}
          className="bg-[#B10303] rounded-[4px] hover:bg-[#B10303]/80 cursor-pointer">
          Assign New Delivery
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[362px]">
        <DialogHeader>
          <DialogTitle className="text-[#B10303]">
            {formMode === "add" ? "Assign New Delivery" : "Edit Delivery"}
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-2 h-[600px] overflow-y-scroll">
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="productName">
              Product Name
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="qty">
              Stock Quantity
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="qty"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="productPrice">
              Product Price(₦)
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              type={"number"}
              id="productPrice"
              value={formData.productPrice}
              onChange={(e) =>
                setFormData({ ...formData, productPrice: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="receiverAddress">
              Receiver Address
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="receiverAddress"
              value={formData.receiverAddress}
              onChange={(e) =>
                setFormData({ ...formData, receiverAddress: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="receiverName">
              Receiver Name
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="receiverName"
              value={formData.receiverName}
              onChange={(e) =>
                setFormData({ ...formData, receiverName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="receiverPhone">
              Receiver Phone
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="receiverPhone"
              value={formData.receiverPhone}
              onChange={(e) =>
                setFormData({ ...formData, receiverPhone: e.target.value })
              }
            />
          </div>

          {/* <div className="flex flex-col gap-1">
            <Label className="text-xs">Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) =>
                setFormData({ ...formData, location: value })
              }>
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="lagos">
                  Lagos
                </SelectItem>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="abuja">
                  Abuja
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="deliveryFee">
              Delivery Fee
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              type={"number"}
              id="deliveryFee"
              value={formData.deliveryFee}
              onChange={(e) =>
                setFormData({ ...formData, deliveryFee: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="uploadDate">
              Upload Date
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="uploadDate"
              type="date"
              value={formData.uploadDate}
              onChange={(e) =>
                setFormData({ ...formData, uploadDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Agent</Label>
            <Select
              value={formData.riderId}
              onValueChange={(value) =>
                setFormData({ ...formData, riderId: value })
              }>
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                {riders.map((rider) => {
                  return (
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value={`${rider.userId}`}>
                      {`${rider.first_name} ${rider.last_name}`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="dueDate">
              Due Date
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Payment Status</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentStatus: value })
              }>
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="NOT_PAID">
                  Not Paid
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Delivery Status</Label>
            <Select
              value={formData.deliveryStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, deliveryStatus: value })
              }>
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="DELIVERED">
                  Delivered
                </SelectItem> */}
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="PENDING">
                  Not Delivered
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}
          {erorMessage && <p className="text-red-500 text-sm">{erorMessage}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose
              onClick={() => {
                setErrorMessage(""), setSuccessMessage("");
              }}
              className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
              Cancel
            </DialogClose>
            <Button
              onClick={formMode === "add" ? handleAdd : handleEdit}
              type="submit"
              className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
              {isLoading ? "Loading.." : "Done"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryFormDialog;
