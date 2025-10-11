import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveryById } from "@/redux/deliverySlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const DeliveryDetailsDialog = ({ id, open, onOpenChange }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.userRole);
  const token = useSelector((state) => state.auth.token);
  const data = useSelector((state) => state.delivery.details);
  const loading = useSelector((state) => state.delivery.idLoading);
  const error = useSelector((state) => state.delivery.idError);
  // console.log(data);
  const filteredProducts =
    data && data?.products?.filter((product) => product.deleted === false);

  useEffect(() => {
    if (id && open) {
      dispatch(fetchDeliveryById({ token, userRole, id }));
    }
  }, [id, open, dispatch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[362px] h-[600px] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle className="text-[#B10303] text-left">
            Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-3 py-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border shadow-md rounded-md p-3 flex flex-col gap-3">
                {/* Section title */}
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />

                {/* Fake rows */}
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center gap-3">
                    {/* Label skeleton */}
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />

                    {/* Value skeleton */}
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">
            Failed to load delivery details
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3 py-0.5">
              <div className="border shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Rider Details</p>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Agent Name</Label>
                  <span className="text-[10px] text-[#8C8C8C]">
                    {`${data?.riderFirstName} ${data?.riderLastName}`}
                  </span>
                </div>
              </div>
              <div className="border shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Package Details</p>

                <div className="flex flex-col gap-3 mt-2">
                  {filteredProducts?.map((product, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-2 shadow-sm bg-gray-50">
                      <p className="text-xs font-semibold mb-1">
                        {product.productName}
                      </p>

                      <div className="flex justify-between text-[10px] text-[#8C8C8C] font-[Raleway]">
                        <span>Unit Price:</span>
                        <span>
                          ₦{Number(product.productPrice).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] text-[#8C8C8C] font-[Raleway]">
                        <span>Discount Price:</span>
                        <span>
                          ₦
                          {Number(product.totalAfterDiscount / product.qty)
                            .toFixed(2)
                            .toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] text-[#8C8C8C] font-[Raleway]">
                        <span>Quantity:</span>
                        <span>{product.qty}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8C8C8C] font-[Raleway]">
                        <span>Total</span>
                        <span>
                          ₦
                          {Number(
                            product.productPrice * product.qty
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8C8C8C] font-[Raleway]">
                        <span>Total After Discount:</span>
                        <span>
                          ₦{Number(product.totalAfterDiscount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand total */}
                <div className="flex justify-between mt-3 text-xs font-semibold">
                  <span>Total Amount:</span>
                  <span>₦{Number(data?.finalTotal).toLocaleString()}</span>
                </div>
              </div>

              <div className="border shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Payment Details</p>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Customer Payment Status</Label>
                  <span
                    className={`text-right w-[45%] text-[10px] ${
                      data?.custPaymentStatus === "CUSTOMER_NOT_PAID"
                        ? "text-red-600"
                        : "text-[#0FA301]"
                    }  font-[Raleway]`}>
                    {data?.custPaymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Payment type</Label>
                  <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.paymentType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Amount paid</Label>
                  <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    ₦{Number(data?.amountPaid).toLocaleString()}
                  </span>
                </div>
                {(data?.balance || data?.balance === 0) && (
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Balance</Label>
                    <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                      ₦{Number(data?.balance).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Delivery details</p>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Delivery Fee</Label>
                  <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    ₦{Number(data?.deliveryFee).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Label className="text-xs">Delivery Code</Label>
                  <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.deliveryCode}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Label className="text-xs">Due Date</Label>
                  <span className="text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.dueDate}
                  </span>
                </div>
              </div>
              <div className="border shadow-md rounded-md p-3">
                <p className="font-semibold text-sm">Customer Details</p>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Receiver Name</Label>
                  <span className="text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.receiverName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Receiver Address</Label>
                  <span className="text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.receiverAddress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Receiver Phone Number</Label>
                  <span className="text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.receiverPhone}
                  </span>
                </div>
              </div>
              <div className="border shadow-md rounded-md p-3">
                <p className="font-semibold text-sm">Status</p>
                <div className={`flex justify-between items-center`}>
                  <Label className="text-xs">Delivery Status</Label>
                  <span
                    className={`text-right w-[45%] text-[10px] ${
                      data?.deliveryStatus === "PENDING"
                        ? "text-yellow-400"
                        : "text-[#0FA301]"
                    } font-[Raleway]`}>
                    {data?.deliveryStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Label className="text-xs">Rider Payment Status</Label>
                  <span
                    className={`text-right w-[45%] text-[10px] ${
                      data?.riderPaymentStatus === "RIDER_NOT_CREDITED"
                        ? "text-red-600"
                        : "text-[#0FA301]"
                    }  font-[Raleway]`}>
                    {data?.riderPaymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Label className="text-xs">Negotiation status</Label>
                  <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                    {data?.negotiationStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                Close
              </DialogClose>
              <Button className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetailsDialog;
