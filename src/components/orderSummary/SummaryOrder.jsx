import { fetchOrderSummary } from "@/redux/orderSummarySlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BASE_URL } from "@/lib/Api";
import { Loader2 } from "lucide-react";

const SummaryOrder = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const summary = useSelector((state) => state.orderSummary.summary);
  // console.log(summary);
  const query = useSelector((state) => state.search.query);
  const { totalPages, currentPage, loading, error } = useSelector(
    (state) => state.orderSummary
  );

  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState("");
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  // console.log(details);
  const filtered = summary?.filter((product) =>
    product?.productName.toLowerCase().includes(query.toLowerCase())
  );
  useEffect(() => {
    dispatch(fetchOrderSummary({ token, userRole, page }));
  }, [dispatch, token, userRole, page]);

  // Fetch details when dialog opens
  const handleOpen = async (index, productId) => {
    setOpenDialog(index);
    setLoadingDetails(true);
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/sale-per-product/${productId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/sale-per-product/${productId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/sale-per-product/${productId}`
          : `${BASE_URL}api/v1/accountant/sale-per-product/${productId}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setDetails(data.data);
    } catch (err) {
      console.error("Failed to fetch agent deliveries", err);
    } finally {
      setLoadingDetails(false);
    }
  };
  return (
    <div>
      {loading ? (
        <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      ) : !loading && error ? (
        <p className="text-center">Something went wrong</p>
      ) : (
        <>
          <p className="text-sm text-center font-semibold pb-3">
            Double click each row to view product summary.
          </p>
          <Table className={"overflow-x-scroll md:w-[1100px]"}>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
                <TableHead>Product Name </TableHead>
                <TableHead>Unit Price </TableHead>
                <TableHead>Total Assigned count</TableHead>
                <TableHead>Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[12px] font-[Raleway] font-[500] ">
              {filtered.length === 0 ? (
                <p className="!text-center py-4">No orders at the momemnt.</p>
              ) : (
                filtered?.map((data, index) => (
                  <>
                    <TableRow
                      key={index}
                      onDoubleClick={() => handleOpen(index, data.productId)}>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>
                        ₦{Number(data.unitPrice).toLocaleString()}
                      </TableCell>
                      <TableCell>{data.totalAssignedCount}</TableCell>
                      <TableCell>
                        ₦{Number(data.totalRevenue).toLocaleString()}
                      </TableCell>

                      {/* <TableCell> */}
                      {/* <div className="flex gap-3 items-center">
    {data.riderPaymentStatus}
    <button onClick={() => handleOpenEdit(data)}>
      <PenBox className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
    </button>
  </div> */}
                      {/* </TableCell> */}
                    </TableRow>
                    <Dialog
                      open={openDialog === index}
                      onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-[#B10303] text-left">
                            Product Details
                          </DialogTitle>
                        </DialogHeader>

                        {loadingDetails ? (
                          <div className="py-4 text-center text-sm">
                            Loading...
                          </div>
                        ) : (
                          <div className="flex flex-col !h-[400px] overflow-y-scrol gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                  {data.first_name} {data.last_name}
                                </span>
                              </div>
                            </div>

                            {/* Render delivery data in a table */}

                            {loadingDetails ? (
                              <div className="py-4 text-center text-sm">
                                Loading...
                              </div>
                            ) : (
                              <div className="flex flex-col !h-[400px] overflow-y-scroll gap-3">
                                {details && (
                                  <>
                                    {/* Product Summary */}
                                    <div className="text-sm space-y-1 border p-3 rounded-md bg-gray-50">
                                      <p>
                                        <strong>Product:</strong>{" "}
                                        {details.productName}
                                      </p>
                                      <p>
                                        <strong>Unit Price:</strong> ₦
                                        {Number(
                                          details.unitPrice
                                        ).toLocaleString()}
                                      </p>
                                      <p>
                                        <strong>Total Revenue:</strong> ₦
                                        {Number(
                                          details.totalRevenue
                                        ).toLocaleString()}
                                      </p>
                                      <p>
                                        <strong>Total Count Assigned:</strong>
                                        {details.totalAmountOfTimesAssigned}
                                      </p>
                                      <p>
                                        <strong>Total Sold:</strong>
                                        {details.totalRevenueCount}
                                      </p>
                                    </div>

                                    {/* Delivery Table */}
                                    {details.deliveries?.length > 0 ? (
                                      <table className="w-full text-xs border mt-4">
                                        <thead>
                                          <tr className="bg-gray-100 text-left">
                                            <th className="p-1 border">
                                              Delivery Status
                                            </th>

                                            <th className="p-1 border">
                                              Delivery Code
                                            </th>
                                            <th className="p-1 border">
                                              Total After Discount (₦)
                                            </th>
                                            <th className="p-1 border">
                                              Receiver Name
                                            </th>
                                            <th className="p-1 border">
                                              Quantity
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {details.deliveries.map((item, i) => (
                                            <tr key={i}>
                                              <td className="p-1 border">
                                                {item?.deliveryStatus}
                                              </td>
                                              <td className="p-1 border">
                                                {item.deliveryCode}
                                              </td>
                                              <td className="p-1 border">
                                                {Number(
                                                  item.totalAfterDiscount
                                                ).toLocaleString()}
                                              </td>

                                              <td className="p-1 border">
                                                {item?.receiverName}
                                              </td>
                                              <td className="p-1 border">
                                                {item?.quantity}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <p className="text-sm text-gray-500">
                                        No delivery data available.
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                          <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                            Close
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
      <div className="flex gap-2 mt-4 m-auto w-[300px] justify-center">
        <button
          className={`${
            page === 0
              ? " bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          } `}
          disabled={page === 0}
          onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span className="items-center px-3 py-1.5">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className={`${
            page + 1 >= totalPages
              ? " bg-stone-100 cursor-not-allowed px-3 py-1.5 rounded-sm"
              : "bg-[#D9D9D9] px-3 py-1.5 rounded-sm cursor-pointer"
          } `}
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SummaryOrder;
