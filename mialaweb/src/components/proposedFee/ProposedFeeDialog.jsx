import React, { useEffect } from "react";
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
import { fetchProposedFee } from "@/redux/proposedFeeSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  approveProposalFee,
  rejectProposalFee,
} from "@/redux/approveRejectProposalFeeSlice";
const ProposedFeeDialog = ({ id, openDialog, setOpenDialog, index }) => {
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const proposals = useSelector((state) => state.proposedFee.proposedFee);
  const loading = useSelector((state) => state.proposedFee.loading);
  const error = useSelector((state) => state.proposedFee.error);
  const adminId = useSelector((state) => state.auth.user.userId);
  const approvalLoading = useSelector(
    (state) => state.approveReject.approveLoading
  );
  const rejectLoading = useSelector(
    (state) => state.approveReject.rejectLoading
  );
  const approvalError = useSelector((state) => state.approveReject.error);
  const success = useSelector((state) => state.approveReject.success);
  //   const reject = useSelector((state) => state.approveReject.reject);
  //   console.log(approve, reject);
  const dispatch = useDispatch();

  useEffect(() => {
    if (openDialog === index)
      dispatch(fetchProposedFee({ token, userRole, id, adminId }));
  }, [openDialog]);
  const handleApprove = () => {
    dispatch(approveProposalFee({ token, userRole, id, adminId }));
  };
  const handleReject = () => {
    dispatch(rejectProposalFee({ token, userRole, id, adminId }));
  };
  return (
    <Dialog
      open={openDialog === index}
      onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle className="text-[#B10303] text-left">
            Details
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : !loading && error ? (
          <p className="text-center">{error}</p>
        ) : (
          <Table className={""}>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
                <TableHead className="rounded-l-sm">Agent</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Delivery Code</TableHead>
                <TableHead>Proposed Fee(₦) </TableHead>
                <TableHead>Quantity </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[12px] font-[Raleway] font-[500] ">
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{`${proposals?.riderName} `}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {proposals?.products?.map((product, index) => (
                    <div key={index}>{product.productName}</div>
                  ))}
                </TableCell>

                <TableCell>{proposals?.deliveryCode}</TableCell>
                <TableCell>
                  {Number(proposals?.proposedFee).toLocaleString()}
                </TableCell>
                <TableCell>
                  {proposals?.products?.map((product, index) => (
                    <div key={index}>{parseFloat(product.quantity)}</div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        <div className="flex justify-end gap-2 ">
          {error && (
            <DialogClose className="bg-white border justify-center m-auto border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
              Close
            </DialogClose>
          )}
          {!error && (
            <>
              <Button
                onClick={handleApprove}
                className="bg-green-600 border  cursor-pointer hover:bg-green-500 text-[#fff] w-1/2 text-sm rounded-[3px] h-9">
                {approvalLoading ? "processing..." : "Approve"}
              </Button>
              <Button
                onClick={handleReject}
                type="submit"
                className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9">
                {rejectLoading ? "processing..." : "Reject"}
              </Button>
            </>
          )}
        </div>
        {success && (
          <p className="text-center text-green-500">
            Fee approved successfully!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProposedFeeDialog;
