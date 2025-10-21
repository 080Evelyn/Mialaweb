import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/Api";
import axios from "axios";
import { fetchDelivery, setMultiCall } from "@/redux/deliverySlice";
import SuccessModal from "../common/SuccessModal";
import { NIGERIAN_STATES } from "@/config/stateData";
import { fetchProducts } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";
import { fetchStats } from "@/redux/statSlice";

const DeliveryFormDialog = ({
  dialogOpen,
  setDialogOpen,
  formMode,
  formData,
  setFormData,
  handleOpenAdd,
  initialState,
  deliveryId,
  totalFinalPrice,
  setTotalFinalPrice,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const id = useSelector((state) => state.auth.user.userId);
  const [receiverId, setReceiverId] = useState("");
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const { products } = useSelector((state) => state.product);
  const [errors, setErrors] = useState({});
  const loading = useSelector((state) => state.delivery.idLoading);
  const error = useSelector((state) => state.delivery.idError);

  const nigerianPhoneRegex = /^(?:\+234|234|0)(7\d{9}|8\d{9}|9\d{9})$/;

  const validate = () => {
    const newErrors = {};

    // General delivery info validation
    if (!formData.riderId) newErrors.riderId = "Required";
    if (!formData.receiverName) newErrors.receiverName = "Required";
    if (!formData.dueDate) newErrors.dueDate = "Required";
    if (!formData.receiverPhone) newErrors.receiverPhone = "Required";
    else if (formData.receiverPhone.length !== 11)
      newErrors.receiverPhone = "Must be 11 digits";
    if (!formData.receiverAddress) newErrors.receiverAddress = "Required";
    if (!formData.deliveryStatus) newErrors.deliveryStatus = "Required";
    if (!formData.customerPaymentStatus)
      newErrors.customerPaymentStatus = "Required";
    // Validate product fields
    if (!formData.products || formData.products.length === 0) {
      newErrors.products = "At least one product is required";
    } else {
      const invalidProduct = formData.products.some((product, index) => {
        const productName = (product.productName || "").trim();
        const quantity = Number(product.quantity ?? 0);
        // const productPrice = Number(
        //   product.productPrice ?? product.originalPrice
        // );

        return (
          !productName ||
          isNaN(quantity) ||
          // isNaN(productPrice) ||
          quantity <= 0
          // ||
          // productPrice <= 0
        );
      });

      if (invalidProduct) {
        newErrors.products = "Each product must have name, quantity, and price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          productId: "",
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
          productId: "",
        },
      ],
    }));
  };

  useEffect(() => {
    if (formData?.products?.length > 0) {
      const total = formData.products.reduce((acc, product) => {
        const unitPrice = Number(
          product.subTotal || product.productPrice * product.quantity
        );
        const quantity = Number(product.quantity || 0);
        const finalPrice = unitPrice;

        return acc + finalPrice;
      }, 0);
      const original = formData.products.reduce((acc, product) => {
        const unitPrice = Number(product.originalPrice || 0);
        const quantity = Number(product.quantity || 0);
        const finalPrice = unitPrice * quantity;

        return acc + finalPrice;
      }, 0);
      setTotalFinalPrice(total);
      setOriginalPrice(original);
    } else {
      setTotalFinalPrice(0);
    }
  }, [formData.products]);

  useEffect(() => {
    setReceiverId(formData.riderId);
  }, [formData.riderId]);

  useEffect(() => {
    if (formData?.finalTotal !== undefined) {
      setTotalFinalPrice(formData.finalTotal);
    }
  }, [formData.finalTotal]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      totalProductValue: originalPrice,
      finalTotal: totalFinalPrice,
      products: formData.products.map((p) => ({
        productName: p.productName,
        quantity: p.quantity,
        productPrice: p.originalPrice,
        totalAfterDiscount: p.finalPrice,
        productId: p.productId,
      })),
      comments: formData.comments.map((c) => ({
        ...c,
        receiverId: receiverId,
      })),
    };

    // console.log(payload);
    if (!validate()) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    if (
      (formData.paymentType === "FULL_PAYMENT" ||
        formData.paymentType === "CASH") &&
      formData.amountPaid !== totalFinalPrice
    ) {
      setErrorMessage("Amount entered is not equal to total product amount.");
      return;
    }
    if (
      formData.paymentType === "PART_PAYMENT" &&
      formData.amountPaid >= totalFinalPrice
    ) {
      setErrorMessage(
        "Amount entered should be less than total product amount for part payment."
      );
      return;
    }
    if (
      formData.paymentType === "PART_PAYMENT" &&
      formData.amountPaid + formData.balance !== totalFinalPrice
    ) {
      setErrorMessage(
        "Sum of amount and balance entered is not equal to total product amount."
      );
      return;
    }
    if (
      formData.customerPaymentStatus === "CUSTOMER_PAID" &&
      formData.paymentType === "PAYMENT_ON_DELIVERY"
    ) {
      setErrorMessage(
        "Failed to assign delivery. Payment status does not align with payment type."
      );
      return;
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
        dispatch(fetchStats({ token, userRole }));
        setSuccessMessage("Delivery Assigned Successfully!");
        setSuccessModalOpen(true);
        setFormData(initialState);
        resetProducts();
        dispatch(setMultiCall());

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 2000);
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
    if (!validate()) {
      return;
    }
    if (formData.receiverPhone.length !== 11) {
      setErrorMessage("Phone number must be 11 digits");
      return;
    }

    // if (!nigerianPhoneRegex.test(formData.receiverPhone)) {
    //   setErrorMessage("Invalid phone number");
    //   return;
    // }
    if (formData.paymentType === "FULL_PAYMENT" && formData.amountPaid === "") {
      setErrorMessage("All Fields Must be Filled!!");
      return;
    }
    if (
      (formData.paymentType === "FULL_PAYMENT" ||
        formData.paymentType === "CASH") &&
      formData.amountPaid !== totalFinalPrice
    ) {
      setErrorMessage("Amount entered is not equal to total product amount.");
      return;
    }
    if (
      formData.paymentType === "PART_PAYMENT" &&
      formData.amountPaid >= totalFinalPrice
    ) {
      setErrorMessage(
        "Amount entered should be less than total product amount for part payment."
      );
      return;
    }
    if (
      formData.paymentType === "PART_PAYMENT" &&
      formData.amountPaid + formData.balance !== totalFinalPrice
    ) {
      setErrorMessage(
        "Sum of amount and balance entered is not equal to total product amount."
      );
      return;
    }

    if (
      formData.customerPaymentStatus === "CUSTOMER_NOT_PAID" &&
      formData.paymentType !== "PAYMENT_ON_DELIVERY"
    ) {
      setErrorMessage(
        "Failed to assign delivery. Payment status does not align with payment type."
      );
      return;
    }
    if (
      formData.customerPaymentStatus === "CUSTOMER_PAID" &&
      formData.paymentType === "PAYMENT_ON_DELIVERY"
    ) {
      setErrorMessage(
        "Failed to assign delivery. Payment status does not align with payment type."
      );
      return;
    }
    const payload = {
      ...formData,
      finalTotal: totalFinalPrice,
      products: formData.products.map((p) => {
        return {
          productName: p.productName,
          quantity: p.quantity,
          productPrice: p.originalPrice,
          productId: p.productId,
          totalAfterDiscount: p.finalPrice,
        };
      }),
    };
    // if (payload.customerPaymentStatus === "CUSTOMER_NOT_PAID") {
    //   delete payload.paymentType;
    // }
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
        dispatch(fetchStats({ token, userRole }));
        dispatch(setMultiCall());
        setSuccessMessage("Delivery Edited Successfully!");
        setSuccessModalOpen(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
          setDialogOpen(false);
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(`An error occured while editing delivery.`);
    } finally {
      setIsLoading(false);
    }
  };

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
          {loading ? (
            <div className="">
              <p className="!text-center">Loading...</p>
              <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Failed to load delivery details
            </p>
          ) : (
            <form className="flex flex-col gap-2 h-[650px]">
              {formData.products.map((product, index) => {
                const selectedProduct = products.find(
                  (p) => p.productName === product.productName
                );
                const originalUnitPrice =
                  selectedProduct?.unitPrice ?? product.originalPrice ?? 0;
                const qty = Number(product.quantity || 0);

                // original total (baseline) = unitPrice * quantity
                const originalTotal = originalUnitPrice * qty;

                // Use product.subTotal if present; otherwise initialize from originalTotal
                const subTotal = Number(
                  product.subTotal ?? product.productPrice * product.quantity
                );

                const finalPrice = subTotal; // final price mirrors subtotal

                // discount percent from originalTotal vs subTotal
                const discountPercent =
                  originalTotal > 0
                    ? ((originalTotal - subTotal) / originalTotal) * 100
                    : 0;

                return (
                  <div
                    key={index}
                    className="mb-6 p-4 border grid md:grid-cols-2 gap-2 rounded-xl space-y-3 relative">
                    {/* Product select */}
                    <div className="mb-2">
                      <Label className="text-xs">Product Name</Label>
                      <select
                        value={product.productName}
                        onChange={(e) => {
                          const name = e.target.value;
                          const sel = products.find(
                            (p) => p.productName === name
                          );
                          const unit = sel?.unitPrice ?? 0;
                          // set productName, productId, originalPrice, subTotal & finalPrice to unit*quantity
                          handleProductChange(index, "productName", name);
                          handleProductChange(
                            index,
                            "productId",
                            sel?.id ?? ""
                          );
                          handleProductChange(index, "originalPrice", unit);
                          const calculatedTotal =
                            unit * Number(product.quantity || 1);
                          handleProductChange(
                            index,
                            "subTotal",
                            calculatedTotal
                          );
                          handleProductChange(
                            index,
                            "finalPrice",
                            calculatedTotal
                          );
                          handleProductChange(index, "discountPercent", 0);
                        }}
                        className="rounded-xs bg-[#8C8C8C33] px-2 py-2">
                        <option value="">Select a product</option>
                        {products
                          ?.filter((p) => !p.deleted)
                          .map((item) => (
                            <option key={item.id} value={item.productName}>
                              {item.productName}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="mb-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => {
                          const newQty = Math.max(
                            1,
                            Number(e.target.value || 0)
                          );
                          // update quantity
                          handleProductChange(index, "quantity", newQty);

                          // recalc originalTotal and then update subTotal & finalPrice to originalTotal
                          const newOriginalTotal = originalUnitPrice * newQty;
                          handleProductChange(
                            index,
                            "subTotal",
                            newOriginalTotal
                          );
                          handleProductChange(
                            index,
                            "finalPrice",
                            newOriginalTotal
                          );

                          // discount becomes 0 since we reset to original total
                          handleProductChange(index, "discountPercent", 0);
                        }}
                        className="rounded-xs bg-[#8C8C8C33]"
                      />
                    </div>

                    {/* Unit Price readonly */}
                    <div className="mb-2">
                      <Label className="text-xs">Unit Price (₦)</Label>
                      <Input
                        readOnly
                        value={originalUnitPrice}
                        className="rounded-xs bg-[#e5e5e5] cursor-not-allowed"
                      />
                    </div>

                    {/* Subtotal editable (this is total = unitPrice * qty, editable by user) */}
                    <div className="mb-2">
                      <Label className="text-xs">Subtotal (₦) -editable </Label>
                      <Input
                        type="number"
                        min="0"
                        value={product.subTotal ?? finalPrice}
                        onChange={(e) => {
                          const entered = Number(e.target.value || 0);
                          // update subTotal and finalPrice (final mirrors subTotal)
                          handleProductChange(index, "subTotal", entered);
                          handleProductChange(index, "finalPrice", entered);

                          // compute discount relative to originalTotal
                          const newDiscount =
                            originalTotal > 0
                              ? ((originalTotal - entered) / originalTotal) *
                                100
                              : 0;
                          handleProductChange(
                            index,
                            "discountPercent",
                            parseFloat(newDiscount.toFixed(2))
                          );
                        }}
                        className="rounded-xs bg-green-100 text-green-900"
                      />
                    </div>

                    {/* Final price readonly (mirrors subtotal) */}
                    <div className="mb-2">
                      <Label className="text-xs">Final Price (₦)</Label>
                      <Input
                        readOnly
                        value={finalPrice}
                        className="rounded-xs bg-gray-200 cursor-not-allowed"
                      />
                    </div>

                    {/* Discount % readonly */}
                    <div className="mb-2">
                      <Label className="text-xs">Discount (%)</Label>
                      <Input
                        readOnly
                        value={`${Number(
                          product.discountPercent ?? discountPercent
                        ).toFixed(2)}%`}
                        className="rounded-xs bg-[#8C8C8C33] cursor-not-allowed"
                      />
                    </div>

                    {/* remove btn */}
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="absolute top-2 right-2 text-red-500 text-xs hover:underline">
                        Remove
                      </button>
                    )}
                    {errors?.products && (
                      <p className="text-red-500 text-xs">{errors.products}</p>
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

              <div className="bg-green-200 flex justify-between py-1.5">
                <p className="font-bold px-4">Total</p>
                <span className="px-4 font-bold">
                  ₦{totalFinalPrice.toLocaleString()}
                </span>
              </div>
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
                  {errors?.receiverAddress && (
                    <p className="text-red-500 text-xs">
                      {errors.receiverAddress}
                    </p>
                  )}
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
                  {errors?.receiverName && (
                    <p className="text-red-500 text-xs">
                      {errors.receiverName}
                    </p>
                  )}
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
                      setFormData({
                        ...formData,
                        receiverPhone: e.target.value,
                      })
                    }
                  />
                  {errors?.receiverPhone && (
                    <p className="text-red-500 text-xs">
                      {errors.receiverPhone}
                    </p>
                  )}
                </div>

                {/* State Dropdown */}

                {formMode === "add" && (
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
                )}

                {/* Agent Dropdown */}

                {formMode === "add" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs">Agent</label>
                    <select
                      value={formData.riderId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          riderId: e.target.value,
                        }))
                      }
                      disabled={!selectedState || loadingAgents}
                      className="w-full rounded-xs bg-[#8C8C8C33] p-2 cursor-pointer">
                      <option value="">
                        {loadingAgents ? "Loading..." : "Select Agent"}
                      </option>
                      {agents.length === 0 && !loadingAgents ? (
                        <option value="" disabled>
                          No agents found
                        </option>
                      ) : (
                        agents?.map((rider) => (
                          <option
                            key={rider.riderId}
                            value={rider.riderId.toString()}>
                            {`${rider.first_name} ${rider.last_name}`}
                          </option>
                        ))
                      )}
                    </select>
                    {errors?.riderId && (
                      <p className="text-red-500 text-xs">{errors.riderId}</p>
                    )}
                  </div>
                )}

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
                  {errors?.dueDate && (
                    <p className="text-red-500 text-xs">{errors.dueDate}</p>
                  )}
                </div>
                {formMode === "edit" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs">Delivery Status</label>
                    <select
                      value={formData.deliveryStatus}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryStatus: e.target.value,
                        }))
                      }
                      className="w-full rounded-xs bg-[#8C8C8C33] p-2 cursor-pointer">
                      <option value="">Select Delivery Status</option>

                      <>
                        <option value="PENDING">PENDING</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="FAILED_DELIVERY">FAILED_DELIVERY</option>
                        <option value="NOT_REACHABLE">NOT_REACHABLE</option>
                        <option value="NOT_PICKING">NOT_PICKING</option>
                      </>
                    </select>
                    {errors?.deliveryStatus && (
                      <p className="text-red-500 text-xs">
                        {errors.deliveryStatus}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs">Customer Payment Status</label>
                  <select
                    value={formData.customerPaymentStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        customerPaymentStatus: value,
                        ...(value === "CUSTOMER_NOT_PAID" && {
                          amountPaid: "",
                          balance: "",
                          paymentType: "PAYMENT_ON_DELIVERY",
                        }),
                      }));
                    }}
                    className="w-full rounded-xs bg-[#8C8C8C33] p-2">
                    <option value="">Select Payment Status</option>
                    <option value="CUSTOMER_NOT_PAID">Not Paid</option>
                    <option value="CUSTOMER_PAID">Paid</option>
                  </select>
                  {errors?.customerPaymentStatus && (
                    <p className="text-red-500 text-xs">
                      {errors.customerPaymentStatus}
                    </p>
                  )}
                </div>

                {formMode === "add" && (
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="note">
                      Comment (optional)
                    </Label>
                    <textarea
                      id="comment"
                      className="rounded-xs bg-[#8C8C8C33] px-2 py-1"
                      placeholder="Add a comment..."
                      value={formData.comments?.[0]?.message || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          comments: [
                            {
                              ...prev.comments[0],
                              message: e.target.value,
                            },
                          ],
                        }))
                      }
                    />
                  </div>
                )}

                {formData.customerPaymentStatus === "CUSTOMER_PAID" && (
                  // <>
                  //   <div className="flex flex-col gap-1">
                  //     <Label className="text-xs">Payment Type</Label>
                  //     <select
                  //       className="w-full rounded-xs bg-[#8C8C8C33] p-2"
                  //       value={formData.paymentType}
                  //       onChange={(e) =>
                  //         setFormData({
                  //           ...formData,
                  //           paymentType: e.target.value,
                  //         })
                  //       }>
                  //       <option value="">Select Status</option>
                  //       <option value="FULL_PAYMENT">Full Payment</option>
                  //       <option value="PART_PAYMENT">Part Payment</option>
                  //       <option value="PAYMENT_ON_DELIVERY">
                  //         Payment on delivery
                  //       </option>
                  //     </select>
                  //   </div>

                  //   {formData.paymentType !== "PAYMENT_ON_DELIVERY" && (
                  //     <div className="flex flex-col gap-1">
                  //       <Label className="text-xs" htmlFor="amountPaid">
                  //         Amount Payed
                  //       </Label>
                  //       <Input
                  //         className="rounded-xs bg-[#8C8C8C33]"
                  //         id="amountPaid"
                  //         value={formatToNaira(formData?.amountPaid)}
                  //         // onChange={(e) =>
                  //         //   handleCurrencyChange(e, "amountPaid")
                  //         // }
                  //         onChange={(e) => {
                  //           handleCurrencyChange(e, "amountPaid");

                  //           // auto-calculate balance if it's part payment
                  //           if (formData.paymentType === "PART_PAYMENT") {
                  //             const amountPaid =
                  //               parseFloat(e.target.value.replace(/,/g, "")) ||
                  //               0;
                  //             const balance = totalFinalPrice - amountPaid;
                  //             setFormData((prev) => ({
                  //               ...prev,
                  //               amountPaid,
                  //               balance: balance < 0 ? 0 : balance,
                  //             }));
                  //           }
                  //         }}
                  //       />
                  //     </div>
                  //   )}
                  //   {formData.paymentType === "PART_PAYMENT" && (
                  //     <div className="flex flex-col gap-1">
                  //       <Label className="text-xs" htmlFor="balance">
                  //         Balance
                  //       </Label>
                  //       <Input
                  //         className="rounded-xs bg-[#8C8C8C33]"
                  //         id="balance"
                  //         value={formatToNaira(formData.balance)}
                  //         onChange={(e) => handleCurrencyChange(e, "balance")}
                  //       />
                  //     </div>
                  //   )}
                  // </>

                  <>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Payment Type</Label>
                      <select
                        className="w-full rounded-xs bg-[#8C8C8C33] p-2"
                        value={formData.paymentType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentType: e.target.value,
                            // reset balance when payment type changes
                            balance: 0,
                          })
                        }>
                        <option value="">Select Status</option>
                        {formMode === "add" ? (
                          <>
                            <option value="FULL_PAYMENT">Full Payment</option>
                            <option value="PART_PAYMENT">Part Payment</option>
                            {/* <option value="CASH">Cash Payment</option> */}
                          </>
                        ) : (
                          <>
                            <option value="FULL_PAYMENT">Full Payment</option>
                            <option value="PART_PAYMENT">Part Payment</option>
                            <option value="CASH">Cash Payment</option>
                            <option value="PAYMENT_ON_DELIVERY">
                              Payment on delivery
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    {formData.paymentType !== "PAYMENT_ON_DELIVERY" && (
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs" htmlFor="amountPaid">
                          Amount Paid
                        </Label>

                        <Input
                          className="rounded-xs bg-[#8C8C8C33]"
                          id="amountPaid"
                          value={formatToNaira(formData.amountPaid)}
                          onChange={(e) => {
                            handleCurrencyChange(e, "amountPaid");

                            // use the parsed value from state after update
                            if (formData.paymentType === "PART_PAYMENT") {
                              const newAmountPaid = parseCurrency(
                                e.target.value
                              ); // use your helper
                              const balance = totalFinalPrice - newAmountPaid;

                              setFormData((prev) => ({
                                ...prev,
                                amountPaid: newAmountPaid,
                                balance: balance < 0 ? 0 : balance,
                              }));
                            }
                          }}
                        />
                      </div>
                    )}

                    {formData.paymentType === "PART_PAYMENT" && (
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs" htmlFor="balance">
                          Balance
                        </Label>
                        <Input
                          className="rounded-xs bg-[#8C8C8C33]"
                          id="balance"
                          value={formatToNaira(formData.balance)}
                          readOnly
                        />
                      </div>
                    )}
                  </>
                )}
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
          )}
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
