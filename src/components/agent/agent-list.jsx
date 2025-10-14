import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle, PenBox, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Avatar from "../../assets/icons/avatar.svg";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import Delete from "../../assets/icons/delete.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import SuccessModal from "../common/SuccessModal";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import { fetchBankList } from "@/redux/bankListSlice";
import { fetchRiders } from "@/redux/riderSlice";
import { setRestricted } from "@/redux/restrictionSlice";
import RestrictionModal from "../common/RestrictionModal";

const AgentList = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state.auth.permissions);
  const restricted = useSelector((state) => state.restriction.restricted);
  const riders = useSelector((state) => state.allRiders.allRiders);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const query = useSelector((state) => state.search.query);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const bankList = useSelector((state) => state.bankList.bankList);
  const success = useSelector((state) => state.bankList.success);
  const [filteredBank, setFilteredBank] = useState([]);

  const handleBankSelection = (data) => {
    const selectedBank = bankList.filter((bnk) => {
      return bnk.code === data?.bankName;
    });
    setFilteredBank(selectedBank[0]?.name);
  };

  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));
    if (success) {
      return;
    } else {
      dispatch(fetchBankList({ token }));
    }
  }, []);
  const approved = riders?.filter((rider) => {
    return (
      rider?.approvalStatus === "APPROVED" ||
      rider?.approvalStatus === "ACTIVATE"
    );
  });
  const filtered = approved?.filter(
    (rider) =>
      rider?.first_name.toLowerCase().includes(query.toLowerCase()) ||
      String(rider?.last_name).toLowerCase().includes(query.toLowerCase())
  );
  const handleDelete = async (id) => {
    if (permissions.includes("DELETE_RIDER")) {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    // e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.delete(
        // `${BASE_URL}api/v1/cutomercare/delete-rider/${id}`,
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/super-delete/rider/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/deactivate-user/rider/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/deactivate-user/rider/${id}`
          : `${BASE_URL}api/v1/accountant/deactivate-user/rider/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "00") {
        dispatch(fetchRiders({ token, userRole }));
        setSuccessMessage(response.data.data);
        setSuccessModalOpen(true);
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
  return (
    <div className="sm:me-5 sm:ms-2.5 overflow-x-scroll  ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Agent Listing</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-sm">
            <TableHead className="rounded-l-sm">Agent Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Email </TableHead>
            <TableHead>Total Deliveries</TableHead>
            <TableHead>Pending Deliveries</TableHead>
            <TableHead>Successful Deliveries</TableHead>
            <TableHead>
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px] font-[Raleway] overflow-x-scroll ">
          {filtered?.length === 0 ? (
            <h2 className="text-md font-semibold text-center mt-">
              No registered agents at the moment.
            </h2>
          ) : (
            filtered?.map((data, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={Avatar}
                      alt="avatar"
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{`${data.first_name} ${data.last_name}`}</span>
                  </div>
                </TableCell>
                <TableCell>{data.state}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.totalDeliveries}</TableCell>
                <TableCell>{data.pendingCount}</TableCell>
                <TableCell>{data.deliveredCount}</TableCell>
                <TableCell>
                  <div className="flex gap-3 justify-center">
                    <Dialog>
                      <DialogTrigger
                        onClick={() => {
                          handleBankSelection(data);
                        }}
                        asChild>
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
                            <Label className="text-xs">Agent Name</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {`${data.first_name} ${data.last_name}`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Email</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.email}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Phone</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.phone}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">State</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.state}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <Label className="text-xs">
                              Total Assigned Deliveries
                            </Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.totalDeliveries}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Account Number</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.accountNumber}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Account Name</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {data.accountName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">Bank</Label>
                            <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                              {filteredBank}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <DialogClose
                            type="submit"
                            className="bg-[#B10303] hover:bg-[#B10303]/80 curosor-pointer text-white w-1/2 text-sm rounded-[3px] h-9">
                            Done
                          </DialogClose>
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
                            Are you sure you want to delete this rider?
                          </DialogDescription>
                        </DialogHeader>
                        {erorMessage && (
                          <p className="text-red-500 text-sm text-center">
                            {erorMessage}
                          </p>
                        )}
                        {successMessage && (
                          <p className="text-green-500 text-sm text-center">
                            {successMessage}
                          </p>
                        )}
                        <div className="flex justify-center gap-2">
                          <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                            Cancel
                          </DialogClose>
                          <Button
                            onClick={() => {
                              handleDelete(data.userId);
                            }}
                            type="submit"
                            className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                            {isLoading ? "Deleting" : "Delete"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`Agent Deleted Successfully.`}
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

export default AgentList;
