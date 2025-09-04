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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import PencilEdit from "../../assets/icons/pencil-edit.svg";
import Delete from "../../assets/icons/delete.svg";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setMultiCallProducts } from "@/redux/productSlice";
import axios from "axios";
import SuccessModal from "../common/SuccessModal";
import { BASE_URL } from "@/lib/Api";
import DeliveryList from "../delivery/deliveryList";
import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";
import { fetchProposedOrders } from "@/redux/proposedFeeSlice";
import { clearFilters } from "@/redux/searchSlice";
const initialFormState = {
  productName: "",
  unitPrice: "",
  quantity: "",
};

const ProductList = () => {
  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const query = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const { products, loading, error, multiCallProducts, success } = useSelector(
    (state) => state.product
  );
  const restricted = useSelector((state) => state.restriction.restricted);
  // console.log(success);
  useEffect(() => {
    if (success) {
      return;
    }
    if (token && userRole) {
      dispatch(fetchProducts({ token, userRole }));
    }
    dispatch(clearFilters());
  }, [dispatch, token, userRole]);

  const handleProductUpload = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.productName === "" || formData.unitPrice === "") {
      setErrorMessage("All Fields Must be Filled!!");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/products-upload`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/products-upload`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/products-upload`
          : `${BASE_URL}api/v1/accountant/products-upload`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        dispatch(fetchProducts({ token, page, userRole }));
        setSuccessMessage("Product Added Successfully!");
        setSuccessModalOpen(true);
        setFormData(initialFormState);
        setValue("");
        dispatch(setMultiCallProducts());

        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 10000);
      }
      // else if (response.data.responseCode === "55") {
      //   setErrorMessage(response.data.responseDesc);
      // }
    } catch (error) {
      setErrorMessage(`Failed to upload product`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteProduct = async (id) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.delete(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delete-product/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delete-product/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delete-product/${id}`
          : `${BASE_URL}api/v1/accountant/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 204) {
        dispatch(fetchProducts({ token, userRole }));
        setSuccessMessage("Product Deleted Successfully.");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 10000);
      } else if (response.data.responseCode === "55") {
        setErrorMessage(response.data.responseDesc);
      }
    } catch (error) {
      setErrorMessage(`An error occured.`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const filtered = products?.filter((product) => {
    const productNames = product?.productName
      .toLowerCase()
      .includes(query.toLowerCase());

    const dateMatch = (() => {
      const { startDate, endDate } = filters;

      if (!startDate || !endDate) return true; // No filtering if not both provided

      const uploadDate = new Date(product.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      if (isNaN(uploadDate) || isNaN(start) || isNaN(end)) return false;

      return uploadDate >= start && uploadDate <= end;
    })();

    return productNames && dateMatch;
  });

  const sortedProducts = [...filtered].reverse();

  // useEffect(() => {
  //   dispatch(fetchProducts({ token, page, userRole }));
  // }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  const formatCurrency = (amount) => {
    const number = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(number);
  };
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
    const formatted = rawValue ? formatCurrency(rawValue) : "";

    setValue(formatted);
    setFormData({ ...formData, unitPrice: numericValue });
  };
  if (loading && !multiCallProducts) {
    return (
      // <div>
      //   <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      // </div>
      <Table className={" md:w-[1100px]"}>
        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index}>
              {/* Delivery Code */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Date */}
              <TableCell>
                <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Delivery Fee */}
              <TableCell>
                <div className="h-2.5 w-14 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Total */}
              <TableCell>
                <div className="h-2.5 w-14 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Customer Payment Status */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              {/* Rider Payment Status */}
              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!loading && error) {
    return (
      <div>
        <h2 className="text-center font-semibold text-sm  text-red-600">
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {/* <DialogTrigger asChild> */}
          <Button
            onClick={() => {
              if (userRole === "Accountant") {
                dispatch(setRestricted(true));
                return;
              }
              setFormData(initialFormState);
              setDialogOpen(true);
            }}
            className="bg-[#B10303] rounded-[4px] hover:bg-[#B10303]/80 cursor-pointer">
            Add New Product
          </Button>
          {/* </DialogTrigger> */}
          <DialogContent className="sm:max-w-[362px] ">
            <DialogHeader>
              <DialogTitle className="text-[#B10303] text-left">
                Add Product
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-0.5">
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="name" className="text-xs">
                  Product Name
                </Label>
                <Input
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  id="name"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="unitPrice" className="text-xs">
                  Price
                </Label>
                <Input
                  id="unitPrice"
                  type="text"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                  value={value}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <Label htmlFor="quantity" className="text-xs">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="text"
                  className="w-full rounded-xs bg-[#8C8C8C33]"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
              {successMessage && (
                <p className="text-green-500 text-sm">{successMessage}</p>
              )}
              {erorMessage && (
                <p className="text-red-500 text-sm">{erorMessage}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 -mt-2">
              <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                Cancel
              </DialogClose>
              <Button
                onClick={handleProductUpload}
                disable={isLoading}
                type="submit"
                className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                {isLoading ? "Uploading..." : "Uplaod"}
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
            <TableHead>Price (₦)</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="rounded-r-sm text-center">Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] font-[500]">
          {sortedProducts?.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.id}</TableCell>
              <TableCell>{data.productName}</TableCell>
              <TableCell>{data.unitPrice.toLocaleString()}</TableCell>
              <TableCell>{formatDate(data.createdAt)}</TableCell>
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
                      <button className="bg-[#B10303] h-6 w-6 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:bg-[#B10303]/75 transition-colors mr-1">
                        <img src={Delete} className="h-6 w-6 text-white" />
                      </button>
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
                          onClick={() => handleDeleteProduct(data.id)}
                          disable={isLoading}
                          type="submit"
                          className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                          {isLoading ? "deleting..." : "Done"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* View Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      {/* <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
                        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500 transition-colors" />
                      </button> */}
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
                          <Label className="text-xs">Delivery Status</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.deliveryStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">Payment Status</Label>
                          <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                            {data.paymentStatus}
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
      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded border ${
                currentPage === page
                  ? "bg-[#FFBFBF] text-black"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}>
              {page}
            </button>
          ))}
        </div>
      )} */}
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />

      <RestrictionModal
        open={restricted}
        onClose={() => {
          dispatch(setRestricted(false));
        }}
      />
    </div>
  );
};

export default ProductList;
