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
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/Api";
import axios from "axios";
import { fetchDelivery, setMultiCall } from "@/redux/deliverySlice";
import SuccessModal from "../common/SuccessModal";
import { NIGERIAN_STATES } from "@/config/stateData";
import { fetchProducts } from "@/redux/productSlice";

const DeliveryFormDialog = ({
  dialogOpen,
  setDialogOpen,
  formMode,
  formData,
  setFormData,
  handleOpenAdd,
  initialState,
  deliveryId,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const riders = useSelector((state) => state.allRiders.allRiders);
  const id = useSelector((state) => state.auth.user.userId);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    if (token && userRole) {
      dispatch(fetchProducts({ token, userRole }));
    }
  }, [dispatch, token, userRole]);
  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    setFormData({ ...formData, riderId: "" });
    setLoadingAgents(true);
    try {
      const response = await axios.get(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/riders-by-state?state=${stateName}`
          : `${BASE_URL}api/v1/subadmin/riders-by-state?state=${stateName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAgents(response.data.data);
    } catch (error) {
      console.error("Failed to fetch agents by state", error);
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };
  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      products: updated,
    }));
  };
  // Add new product row
  const handleAddProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { productName: "", quantity: "", productPrice: "" },
      ],
    }));
  };

  // Remove a product row
  const handleRemoveProduct = (index) => {
    const updated = formData.products.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, products: updated }));
  };

  const resetProducts = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        {
          productName: "",
          quantity: "",
          productPrice: "",
        },
      ],
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      formData.receiverAddress === "" ||
      formData.riderId === "" ||
      formData.receiverName === "" ||
      formData.receiverPhone === "" ||
      formData.dueDate === ""
    ) {
      setErrorMessage("All Fields Must be Filled!!");
      return;
    }
    // Check each product entry
    const invalidProduct = formData.products.some(
      (product) =>
        !product.productName || !product.quantity || !product.productPrice
    );

    if (invalidProduct) {
      setErrorMessage("All product fields must be filled!");
      return false;
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
      if (response.data.responseCode === "00") {
        dispatch(fetchDelivery({ token, userRole }));
        setSuccessMessage("Delivery Assigned Successfully!");
        setSuccessModalOpen(true);
        setFormData(initialState);
        resetProducts();
        dispatch(setMultiCall());
      } else if (response.data.responseCode === "55") {
        setErrorMessage(response.data.responseDesc);
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
          ? `${BASE_URL}api/v1/admin/delivery/${deliveryId}`
          : `${BASE_URL}api/v1/subadmin/delivery/${deliveryId}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        dispatch(fetchDelivery({ token, userRole }));
        dispatch(setMultiCall());
        setSuccessMessage("Delivery Edited Successfully!");
        setSuccessModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(`An error occured while editing delivery.`);
    } finally {
      setIsLoading(false);
    }
  };
  const approved = riders?.filter((rider) => {
    return rider.approvalStatus === "APPROVED";
  });
  // console.log(formData);
  return (
    <>
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
            {formData?.products?.map((product, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded-xl space-y-3 relative">
                {/* Product Selection */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs" htmlFor={`productName-${index}`}>
                    Product Name
                  </Label>
                  <select
                    id={`productName-${index}`}
                    value={product.productName}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const selectedProduct = products.find(
                        (p) => p.productName === selectedName
                      );
                      handleProductChange(index, "productName", selectedName);
                      handleProductChange(
                        index,
                        "productPrice",
                        selectedProduct ? selectedProduct.unitPrice : ""
                      );
                    }}
                    className="rounded-xs bg-[#8C8C8C33] px-2 py-2  overflow-y-scroll">
                    <option value="">Select a product</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.productName}>
                        {item.productName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs" htmlFor={`quantity-${index}`}>
                    Product Quantity
                  </Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    className="rounded-xs bg-[#8C8C8C33]"
                  />
                </div>

                {/* Price (Read-only) */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs" htmlFor={`productPrice-${index}`}>
                    Product Price (₦)
                  </Label>
                  <Input
                    id={`productPrice-${index}`}
                    type="number"
                    placeholder="Price"
                    value={product.productPrice}
                    className="rounded-xs bg-gray-100"
                    readOnly
                  />
                </div>

                {/* Remove Button */}
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="absolute top-2 right-2 text-red-500 text-xs hover:underline">
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add Product Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="mt-4 px-4 py-2 bg-[#006181] hover:bg-[#004e65] text-white rounded-md text-sm shadow-sm transition">
              + Add Another Product
            </button>

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
            {/* <div className="flex flex-col gap-1">
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
            </div> */}
            {/* <div className="flex flex-col gap-1">
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
            </div> */}
            {/* <div className="flex flex-col gap-1">
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
                  {approved?.map((rider) => {
                    return (
                      <SelectItem
                        className="hover:bg-gray-200 cursor-pointer"
                        value={`${rider.riderId}`}
                        key={rider.riderId}>
                        {`${rider.first_name} ${rider.last_name}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div> */}

            <div className="flex flex-col gap-4">
              {/* State Dropdown */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs">State</Label>
                <Select onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Agent Dropdown */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Agent</Label>
                <Select
                  value={formData.riderId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, riderId: value })
                  }
                  disabled={!selectedState || loadingAgents}>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue
                      placeholder={
                        loadingAgents ? "Loading..." : "Select Agent"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">
                        No agents found
                      </div>
                    ) : (
                      agents?.map((rider) => (
                        <SelectItem
                          key={rider.riderId}
                          className="hover:bg-gray-200 cursor-pointer"
                          value={rider.riderId.toString()}>
                          {`${rider.first_name} ${rider.last_name}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
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

            {/* <div className="flex flex-col gap-1">
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
            </div> */}

            {/* <div className="flex flex-col gap-1">
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
                  <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="DELIVERED">
                  Delivered
                </SelectItem>
                  <SelectItem
                    className="hover:bg-gray-200 cursor-pointer"
                    value="PENDING">
                    Not Delivered
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            */}
            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}
            {erorMessage && (
              <p className="text-red-500 text-sm">{erorMessage}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose
                onClick={() => {
                  setErrorMessage(""), setSuccessMessage("");
                  setFormData(initialState);
                  resetProducts();
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
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`Delivery Assigned Successfully!.`}
      />
    </>
  );
};

export default DeliveryFormDialog;
