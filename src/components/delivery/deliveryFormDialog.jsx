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
  const sortedProducts = [...products].reverse();
  const restricted = useSelector((state) => state.restriction.restricted);

  useEffect(() => {
    if (token && userRole) {
      dispatch(fetchProducts({ token, userRole }));
    }
  }, [dispatch, token, userRole]);
  const formatToNaira = (value) => {
    const numeric = String(value).replace(/[^0-9]/g, ""); // <- fix here
    const number = parseInt(numeric, 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(number);
  };
  const parseCurrency = (input) => {
    const numeric = String(input).replace(/[^0-9]/g, "");
    return numeric ? parseInt(numeric, 10) : 0;
  };
  const handleCurrencyChange = (e, key) => {
    const rawNumber = parseCurrency(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [key]: rawNumber,
    }));
  };

  const handleStateChange = async (stateName) => {
    setSelectedState(stateName);
    setFormData({ ...formData, riderId: "" });
    setLoadingAgents(true);
    try {
      const response = await axios.get(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/riders-by-state?state=${stateName}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/riders-by-state?state=${stateName}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/riders-by-state?state=${stateName}`
          : `${BASE_URL}api/v1/accountant/riders-by-state?state=${stateName}`,

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
        {
          productName: "",
          quantity: "",
          productPrice: "",
          discountPercent: "",
        },
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
          discountPercent: "",
        },
      ],
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      products: formData.products.map((p) => ({
        productName: p.productName,
        quantity: p.quantity,
        productPrice: p.originalPrice,
        discountPercent: p.discountPercent,
      })),
    };

    // console.log(payload);
    setErrorMessage("");
    setSuccessMessage("");

    if (
      formData.receiverAddress === "" ||
      formData.riderId === "" ||
      formData.receiverName === "" ||
      formData.receiverPhone === "" ||
      formData.dueDate === "" ||
      formData.deliveryStatus === "" ||
      formData.negotiationStatus === "" ||
      formData.agreementStatus === "" ||
      formData.riderPaymentStatus === "" ||
      formData.customerPaymentStatus === "" ||
      (formData.paymentType && formData.paymentType === "") ||
      (formData.amountPaid && formData.amountPaid === "") ||
      (formData.balance && formData.balance === "")
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
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/create-delivery/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/create-delivery/${id}`
          : `${BASE_URL}api/v1/accountant/create-delivery/${id}`,

        payload,

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

        // Hide success message after 10 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 10000);
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
    if (
      formData.paymentType === "FULL_PAYMENT" &&
      formData.amountPaid === ""
      // (formData.paymentType === "PART_PAYMENT" && formData.amountPaid === "") ||
      // (formData.paymentType === "PART_PAYMENT" && formData.balance === "")
    ) {
      setErrorMessage("All Fields Must be Filled!!");
      return;
    }

    let payload = {
      ...formData,
      products: formData.products.map(({ originalPrice, ...rest }) => rest),
    };
    // If customerPaymentStatus is "not_paid", remove paymentType
    if (payload.customerPaymentStatus === "CUSTOMER_NOT_PAID") {
      delete payload.paymentType;

      // setFormData((prev) => ({
      //   ...prev,
      //   amountPaid: "",
      //   balance: "",
      //   paymentType: "",
      // }));
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.put(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/update/${deliveryId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/update/${deliveryId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/update/${deliveryId}`
          : `${BASE_URL}api/v1/accountant/update/${deliveryId}`,

        payload,

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
        // Hide success message after 10 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 10000);
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

  // const currentRiderId = formData?.riderId;
  // console.log(currentRiderId);
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* <DialogTrigger asChild> */}
        <Button
          onClick={handleOpenAdd}
          className="bg-[#B10303] rounded-[4px] hover:bg-[#B10303]/80 cursor-pointer">
          Assign New Delivery
        </Button>
        {/* </DialogTrigger> */}

        <DialogContent className=" md:!w-[800px] h-[600px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-[#B10303]">
              {formMode === "add" ? "Assign New Delivery" : "Edit Delivery"}
            </DialogTitle>
          </DialogHeader>

          <form className="flex flex-col gap-2 h-[650px]">
            {formData?.products?.map((product, index) => {
              const originalUnitPrice =
                products.find((p) => p.productName === product.productName)
                  ?.unitPrice || 0;

              const unitPrice = Number(product.productPrice || 0);
              const quantity = Number(product.quantity || 0);
              const priceBeforeDiscount = unitPrice * quantity;

              const discountPercent =
                originalUnitPrice && originalUnitPrice > unitPrice
                  ? ((originalUnitPrice - unitPrice) / originalUnitPrice) * 100
                  : 0;
              formData.products[index].discountPercent = parseFloat(
                discountPercent.toFixed(2)
              );
              // const discountAmount =
              //   (originalUnitPrice * quantity * discountPercent) / 100;
              const finalPrice = priceBeforeDiscount;

              return (
                <div
                  key={index}
                  className="mb-6 p-4 border grid md:grid-cols-2 gap-2 rounded-xl space-y-3 relative">
                  {/* Product Selection */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor={`productName-${index}`}>
                      Product Name
                    </Label>
                    <select
                      id={`productName-${index}`}
                      value={product.productName}
                      //   onChange={(e) => {
                      //     const selectedName = e.target.value;
                      //     const selectedProduct = products.find(
                      //       (p) => p.productName === selectedName
                      //     );
                      //     handleProductChange(index, "productName", selectedName);
                      //     handleProductChange(
                      //       index,
                      //       "productPrice",
                      //       selectedProduct ? selectedProduct.unitPrice : ""
                      //     );
                      //   }
                      // }
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        const selectedProduct = sortedProducts.find(
                          (p) => p.productName === selectedName
                        );
                        handleProductChange(index, "productName", selectedName);

                        // Set both editable and original price
                        handleProductChange(
                          index,
                          "productPrice",
                          selectedProduct ? selectedProduct.unitPrice : ""
                        );
                        handleProductChange(
                          index,
                          "originalPrice",
                          selectedProduct ? selectedProduct.unitPrice : 0
                        );
                      }}
                      className="rounded-xs bg-[#8C8C8C33] px-2 py-2">
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
                      min="0"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                      className="rounded-xs bg-[#8C8C8C33]"
                    />
                  </div>

                  {/* Editable Unit Price */}
                  <div className="flex flex-col gap-1">
                    <Label
                      className="text-xs"
                      htmlFor={`productPrice-${index}`}>
                      Unit Price (₦)
                    </Label>
                    <Input
                      id={`productPrice-${index}`}
                      type="number"
                      placeholder="Unit Price"
                      value={product.productPrice}
                      onChange={(e) => {
                        handleProductChange(
                          index,
                          "productPrice",
                          e.target.value
                        );
                      }}
                      className="rounded-xs bg-[#8C8C8C33]"
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div className="flex flex-col gap-1">
                    <Label
                      className="text-xs"
                      htmlFor={`productDiscount-${index}`}>
                      Discount (%)
                    </Label>

                    <Input
                      id={`productDiscount-${index}`}
                      type="text"
                      readOnly
                      value={`${discountPercent.toFixed(2)}%`}
                      className="rounded-xs bg-[#8C8C8C33] text-gray-600"
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>

                  {/* Final Total After Discount */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-green-700 font-semibold">
                      Final Price (₦)
                    </Label>
                    <div className="bg-green-100 px-3 py-2 rounded text-sm font-medium text-green-900">
                      ₦{finalPrice.toLocaleString()}
                    </div>
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
              );
            })}

            {/* Add Product Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="mt-4 px-4 py-2 bg-[#006181] hover:bg-[#004e65] text-white rounded-md text-sm shadow-sm transition">
              + Add Another Product
            </button>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="receiverAddress">
                  Receiver Address
                </Label>
                <Input
                  className="rounded-xs bg-[#8C8C8C33]"
                  id="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      receiverAddress: e.target.value,
                    })
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
                  type={"number"}
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

              {/* State Dropdown */}

              <div className="flex flex-col gap-1">
                <label className="text-xs" htmlFor="state-select">
                  State
                </label>
                <select
                  id="state-select"
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded bg-[#8C8C8C33] p-2">
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option className="bg-white" key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
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
                <Label className="text-xs">Delivery Status</Label>
                <Select
                  value={formData.deliveryStatus}
                  onValueChange={(value) => {
                    setFormData({ ...formData, deliveryStatus: value });
                  }}>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="PICKEDUP">
                      PICKEDUP
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="PACKAGE_DELIVERED">
                      PACKAGE_DELIVERED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="PENDING">
                      PENDING
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="CANCELLED">
                      CANCELLED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="PROCESSING">
                      PROCESSING
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_PROPOSED">
                      FEE_PROPOSED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_REJECTED">
                      FEE_REJECTED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_COUNTERED">
                      FEE_COUNTERED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Customer Payment Status</Label>
                <Select
                  value={formData.customerPaymentStatus}
                  onValueChange={(value) => {
                    setFormData({ ...formData, customerPaymentStatus: value });
                    if (value === "CUSTOMER_NOT_PAID") {
                      setFormData((prev) => ({
                        ...prev,
                        amountPaid: "",
                        balance: "",
                        paymentType: "",
                      }));
                    }
                  }}>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="CUSTOMER_NOT_PAID">
                      Not Paid
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="CUSTOMER_PAID">
                      Paid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="flex flex-col gap-1">
                <Label className="text-xs">Rider Payment Status</Label>
                <Select
                  value={formData.riderPaymentStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, riderPaymentStatus: value })
                  }>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="RIDER_CREDITED">
                      RIDER_CREDITED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="RIDER_NOT_CREDITED">
                      RIDER_NOT_CREDITED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* <div className="flex flex-col gap-1">
                <Label className="text-xs">Agreement Status</Label>
                <Select
                  value={formData.agreementStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, agreementStatus: value })
                  }>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="AGREED">
                      AGREED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="PROCESSING">
                      PROCESSING
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="DISAGREED">
                      DISAGREED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="NEGOTIATING">
                      NEGOTIATING
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* <div className="flex flex-col gap-1">
                <Label className="text-xs">Negotiation Status</Label>
                <Select
                  value={formData.negotiationStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, negotiationStatus: value })
                  }>
                  <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_PROPOSED">
                      FEE_PROPOSED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_COUNTERED">
                      FEE_COUNTERED
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_ACCEPTED_BY_RIDER">
                      FEE_ACCEPTED_BY_RIDER
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_REJECTED_BY_ADMIN">
                      FEE_REJECTED_BY_ADMIN
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="FEE_APPROVED_BY_ADMIN">
                      FEE_APPROVED_BY_ADMIN
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="NO_NEGOTIATION_YET">
                      NO_NEGOTIATION_YET
                    </SelectItem>
                    <SelectItem
                      className="hover:bg-gray-200 cursor-pointer"
                      value="NEGOTIATION_FAILED">
                      NEGOTIATION_FAILED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {formData.customerPaymentStatus === "CUSTOMER_PAID" && (
                <>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Payment Type</Label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, paymentType: value })
                      }>
                      <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="hover:bg-gray-200 cursor-pointer"
                          value="FULL_PAYMENT">
                          Full Payment
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-gray-200 cursor-pointer"
                          value="PART_PAYMENT">
                          Part Payment
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="amountPaid">
                      Amount Payed
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="amountPaid"
                      value={formatToNaira(formData?.amountPaid)}
                      onChange={(e) => handleCurrencyChange(e, "amountPaid")}
                    />
                  </div>
                  {formData.paymentType === "PART_PAYMENT" && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs" htmlFor="balance">
                        Balance
                      </Label>
                      <Input
                        className="rounded-xs bg-[#8C8C8C33]"
                        id="balance"
                        value={formatToNaira(formData.balance)}
                        onChange={(e) => handleCurrencyChange(e, "balance")}
                      />
                    </div>
                  )}
                </>
              )}

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
            </div>
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
                  // setDialogOpen(false);
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
        message={`${successMessage}`}
      />
    </>
  );
};

export default DeliveryFormDialog;
