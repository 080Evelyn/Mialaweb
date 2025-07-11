import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle, EllipsisVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Avatar from "../../assets/icons/avatar.svg";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllPayment } from "@/redux/allCustomerPaymentSlice";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import SuccessModal from "../common/SuccessModal";

const TotalFeesTable = () => {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const userId = useSelector((state) => state.auth.user.userId);
  const totalPayments = useSelector((state) => state.payment.payment);
  // console.log(totalPayments);
  const query = useSelector((state) => state.search.query);
  const initialFormState = {
    depositReference: "",
    deliveryCode: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const filtered = totalPayments.filter((trans) => {
    return (
      trans?.reference.toLowerCase().includes(query.toLowerCase()) ||
      trans?.email.toLowerCase().includes(query.toLowerCase()) ||
      trans?.paystackTransactionId.toLowerCase().includes(query.toLowerCase())
    );
  });
  const sortedTransactions = filtered.sort((a, b) => {
    return new Date(b.paidAt) - new Date(a.paidAt);
  });
  const handleAssignPayment = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const { deliveryCode, depositReference } = formData;
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/assign-payment?currentAdminId=${userId}`
          : `${BASE_URL}api/v1/subadmin/assign-payment?currentAdminId=${userId}`,
        {
          depositReference: depositReference,
          deliveryCode: deliveryCode,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "00") {
        setSuccessMessage("Payment assigned successfully!");
        dispatch(fetchAllPayment({ token, userRole }));
        // setFormData(initialState);
        setSuccessModalOpen(true);
      } else if (response.data.responseCode === "55") {
        setErrorMessage(response.data.responseDesc);
      }
    } catch (error) {
      setErrorMessage(error.response.data.responseDesc);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllPayment({ token, userRole }));
  }, [dispatch, token, userRole]);

  function formatDateArray(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      throw new Error("Invalid date array.");
    }

    const [year, month, day] = dateArray;

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Total Fees Collected</h2>
        <div className="flex gap-2.5 text-sm">
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/fees"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}>
            <Link to="/fees">Total Fee Collected </Link>
          </Button>
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/payout-summary"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}>
            <Link to="/payout-summary">Payout Summary</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
            <TableHead className="rounded-l-sm">Email</TableHead>
            <TableHead>Payment Assigned</TableHead>
            <TableHead>Amount </TableHead>
            <TableHead>link Delivery Code </TableHead>
            <TableHead>Status </TableHead>
            <TableHead>Date </TableHead>
            <TableHead>
              <span className="sr-only">Action</span>
            </TableHead>
            <TableHead>
              <span className="sr-only">more</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[14px] font-medium font-[Raleway]">
          {sortedTransactions?.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={Avatar}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{data.email}</span>
                </div>
              </TableCell>
              <TableCell>{data.usedForDelivery ? "True" : "False"}</TableCell>
              <TableCell>₦{data.amount}</TableCell>
              <TableCell>{data.linkedDeliveryCode}</TableCell>
              <TableCell>
                <Badge
                  className={`text-sm rounded-xs font-[Raleway] ${
                    data.status === "Pending" ? "bg-[#FBBC02]" : "bg-[#0FA301]"
                  }`}>
                  {data.status}
                </Badge>
              </TableCell>
              <TableCell>{data.paidAt.split("T")[0]}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    {
                      // data.usedForDelivery === 0 &&
                      <button
                        className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center"
                        onClick={() =>
                          setFormData({
                            depositReference: data.reference || "",
                            deliveryCode: data.linkedDeliveryCode || "",
                          })
                        }>
                        <EllipsisVertical className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                      </button>
                    }
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[362px]">
                    <DialogHeader>
                      <DialogTitle className="text-[#B10303] text-left">
                        Assign Payment
                      </DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-2 py-3">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs" htmlFor="depositReference">
                          Deposit Reference
                        </Label>
                        <Input
                          className="rounded-xs bg-[#8C8C8C33]"
                          id="depositReference"
                          value={formData.depositReference}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              depositReference: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs" htmlFor="deliveryCode">
                          Delivery Code
                        </Label>
                        <Input
                          className="rounded-xs bg-[#8C8C8C33]"
                          id="deliveryCode"
                          value={formData.deliveryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deliveryCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      {successMessage && (
                        <p className="text-green-500 text-sm text-center">
                          {successMessage}
                        </p>
                      )}
                      {errorMessage && (
                        <p className="text-red-500 text-sm text-center">
                          {errorMessage}
                        </p>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <DialogClose
                          onClick={() => {
                            setErrorMessage("");
                            setSuccessMessage("");
                          }}
                          className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                          Cancel
                        </DialogClose>
                        <Button
                          onClick={handleAssignPayment}
                          type="button"
                          className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                          {isLoading ? "Loading.." : "Submit"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    {
                      // data.usedForDelivery === 0 &&
                      <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                      </button>
                    }
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[362px]">
                    <DialogHeader>
                      <DialogTitle className="text-[#B10303] text-left">
                        Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-0.5">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Agent Email</Label>
                        <span className=" text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Reference</Label>
                        <span className=" text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.reference}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Status</Label>
                        <span
                          className={` text-right text-[10px] font-[Raleway] ${
                            data.status === "Pending"
                              ? "text-[#FBBC02]"
                              : "text-[#0FA301]"
                          }`}>
                          {data.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Customer Code</Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.customerCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Channel </Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.channel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Currency </Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.currency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          Paystack TransactionId
                        </Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          {data.paystackTransactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Amount </Label>
                        <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                          ₦{Number(data.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                        Cancel
                      </DialogClose>
                      {/* <Button
                        type="button"
                        className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                        {isLoading ? "Loading.." : "Submit"}
                      </Button> */}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`Payment Assigned Successfully.`}
      />
    </div>
  );
};

export default TotalFeesTable;
