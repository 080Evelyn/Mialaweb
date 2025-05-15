import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import { tableData } from "@/config/productTableData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import PencilEdit from "../../assets/icons/pencil-edit.svg";
// import Delete from "../../assets/icons/delete.svg";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";

const ProductList = () => {
  const id = useSelector((state) => state.auth.user.userId);
  const token = useSelector((state) => state.auth.token);
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const query = useSelector((state) => state.search.query);
  const userRole = useSelector((state) => state.auth.user.userRole);

  const filtered = products?.content?.filter(
    (product) =>
      product?.productName.toLowerCase().includes(query.toLowerCase()) ||
      String(product?.deliveryCode).toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchProducts({ token, page, userRole }));
  }, []);
  function formatDateArray(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length !== 3) {
      throw new Error("Invalid date array. Expected format: [YYYY, MM, DD]");
    }

    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-center font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div>
        <h2 className="text-center font-semibold">
          Something went wrong, check internet connection.
        </h2>
      </div>
    );
  }
  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Product List</h2>
        {/* Add Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            {/* <Button className="bg-[#B10303] rounded-[4px] hover:bg-[#B10303]/80 cursor-pointer">
              Add New Product
            </Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[362px] ">
            {/* <DialogHeader>
              <DialogTitle className="text-[#B10303] text-left">
                Add Product
              </DialogTitle>
            </DialogHeader> */}
            <div className="grid gap-2 py-0.5">
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="name" className="text-xs">
                  Product Name
                </Label>
                <Input id="name" className="w-full rounded-xs bg-[#8C8C8C33]" />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="stockQty" className="text-xs">
                  Stock Quantity
                </Label>
                <Input
                  id="stockQty"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="price" className="text-xs">
                  Price
                </Label>
                <Input
                  id="price"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="status" className="text-xs">
                  Status
                </Label>
                <Input
                  id="status"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 -mt-2">
              <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                Cancel
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>Price (₦)</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="rounded-r-sm text-center">Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500]">
          {filtered?.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.deliveryCode}</TableCell>
              <TableCell>{data.productName}</TableCell>
              <TableCell>{data.qty}</TableCell>
              <TableCell>{data.productPrice}</TableCell>
              <TableCell>{formatDateArray(data.uploadDate)}</TableCell>
              <TableCell>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    data.paymentStatus === "NOT_PAID"
                      ? " bg-red-500"
                      : " bg-[#0FA301]"
                  }`}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-3 justify-center">
                  {/* Edit Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      {/* <button className="bg-[#0A55D0] h-6 w-6 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:bg-[#0A55D0]/80 transition-colors">
                        <img src={PencilEdit} className="h-6 w-6 text-white" />
                      </button> */}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[362px] ">
                      <DialogHeader>
                        <DialogTitle className="text-[#B10303] text-left">
                          Edit
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-2 py-0.5">
                        <div className="grid grid-cols-1 items-center gap-1.5">
                          <Label htmlFor="name" className="text-xs">
                            Product Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={data.productName}
                            className="w-full rounded-xs bg-[#8C8C8C33]"
                          />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-1.5">
                          <Label htmlFor="stockQty" className="text-xs">
                            Stock Quantity
                          </Label>
                          <Input
                            id="stockQty"
                            defaultValue={data.qty}
                            className="w-full rounded-xs bg-[#8C8C8C33]"
                          />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-1.5">
                          <Label htmlFor="price" className="text-xs">
                            Price
                          </Label>
                          <Input
                            id="price"
                            defaultValue={data.price}
                            className="w-full rounded-xs bg-[#8C8C8C33]"
                          />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-1.5">
                          <Label htmlFor="status" className="text-xs">
                            Status
                          </Label>
                          <Input
                            id="status"
                            defaultValue={data.deliveryStatus}
                            className="w-full rounded-xs bg-[#8C8C8C33]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 -mt-2">
                        <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                          Cancel
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      {/* <button className="bg-[#B10303] h-6 w-6 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:bg-[#B10303]/75 transition-colors mr-1">
                        <img src={Delete} className="h-6 w-6 text-white" />
                      </button> */}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#B10303] text-center gap-2 flex flex-col">
                          <img
                            src={AlertCircle}
                            alt="Alert Icon"
                            className="w-20 h-20 mx-auto"
                          />
                          <span>Delete</span>
                        </DialogTitle>
                        <DialogDescription className="text-center text-foreground font-semibold text-xs">
                          Are you sure you want to delete this product?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center gap-2">
                        <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                          Cancel
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* View Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[362px] ">
                      <DialogHeader>
                        <DialogTitle className="text-[#B10303] text-left">
                          Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3 py-0.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Product Name</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.productName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Stock Quantity</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.qty}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Price</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.productName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Date</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.uploadDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Status</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.deliveryStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                          Close
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-[#153D80] hover:bg-[#153D80]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
