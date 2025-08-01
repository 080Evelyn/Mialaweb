import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTransaction } from "@/redux/transactionSlice";

const PayoutSummaryTable = () => {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const transaction = useSelector((state) => state.transaction.transactions);
  const error = useSelector((state) => state.transaction.error);
  const loading = useSelector((state) => state.transaction.loading);
  const query = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  // console.log(error);
  const filtered = transaction?.filter((trans) => {
    return (
      trans?.reference?.toLowerCase().includes(query.toLowerCase()) ||
      trans?.email?.toLowerCase().includes(query.toLowerCase())
    );
  });
  useEffect(() => {
    dispatch(fetchTransaction({ token, userRole }));
  }, []);

  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Payout summary</h2>
        <div className="flex gap-2.5 text-sm">
          {/* <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/fees"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}>
            <Link to="/fees">Total Fee Collected </Link>
          </Button> */}
          {/* <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/payout-summary"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}>
            <Link to="/payout-summary">Payout Summary</Link>
          </Button> */}
        </div>
      </div>
      {loading ? (
        <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      ) : !loading && error !== "No valid transfer transactions found." ? (
        <p className="text-sm text-red-500 text-center">
          Something went wrong.
        </p>
      ) : !loading && error === "No valid transfer transactions found." ? (
        <p className="text-sm text-center">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
              <TableHead>Amount</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Bank Name </TableHead>
              {/* <TableHead>
              <span className="sr-only">Action</span>
            </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm font-[Raleway] ">
            {filtered?.length === 0 ? (
              <p className="text-center">No transactions at the moment.</p>
            ) : (
              filtered?.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>₦{data?.amount?.toLocaleString()}</TableCell>
                  <TableCell>{data?.accountNumber}</TableCell>
                  <TableCell>{data?.bankName}</TableCell>
                  <TableCell>
                    <Dialog>
                      {/* <DialogTrigger asChild>
                      <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                        </button>
                    </DialogTrigger> */}
                      <DialogContent className="sm:max-w-[362px] ">
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
                              Paystack TransactionId{" "}
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

                        <div className="flex justify-end gap-2 ">
                          <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                            Cancel
                          </DialogClose>
                          <DialogClose
                            type="submit"
                            className="bg-[#044616] hover:bg-[#044616]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9">
                            Done
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PayoutSummaryTable;
