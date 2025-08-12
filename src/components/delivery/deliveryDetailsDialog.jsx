import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const DeliveryDetailsDialog = ({ data }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          // onClick={() => {
          //   console.log(data);
          // }}
          className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
          <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[362px] h-[600px] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle className="text-[#B10303] text-left">
            Details
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-0.5">
          <div className="border shadow-md rounded-md p-3">
            <p className="text-sm font-semibold">Rider Details</p>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Agent Name</Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                {`${data?.riderFirstName} ${data?.riderLastName}`}
              </span>
            </div>
          </div>

          <div className="border shadow-md rounded-md p-3">
            <p className="text-sm font-semibold">Package Details</p>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Package</Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                {data?.products?.map((product, index) => (
                  <div key={index}>{product.productName}</div>
                ))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Product Price</Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                {data?.products?.map((product, index) => (
                  <div key={index}>
                    ₦{Number(product?.productPrice).toLocaleString()}
                  </div>
                ))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Discount Price</Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                {data?.products?.map((product, index) => (
                  <div key={index}>
                    ₦
                    {Number(
                      product?.totalAfterDiscount / product?.qty
                    ).toLocaleString()}
                  </div>
                ))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Quantity</Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                {data?.products?.map((product, index) => (
                  <div key={index}>{Number(product?.qty)}</div>
                ))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Total Amount </Label>
              <span className=" text-right w-[45%] text-[10px] text-[#8C8C8C] font-[Raleway]">
                ₦{Number(data?.totalProductValue).toLocaleString()}
              </span>
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
        <div className="flex justify-end gap-2 ">
          <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
            Close
          </DialogClose>
          <Button
            type="submit"
            className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetailsDialog;
