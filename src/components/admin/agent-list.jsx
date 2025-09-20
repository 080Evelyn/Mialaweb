import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import {
  ArrowRightCircle,
  CheckCircle,
  Loader2,
  PenBox,
  Power,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Avatar from "../../assets/icons/avatar.svg";
// import { agentsTableData } from "@/config/agentData";
// import PencilEdit from "../../assets/icons/pencil-edit.svg";
import Delete from "../../assets/icons/delete.svg";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRiders } from "@/redux/riderSlice";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import SuccessModal from "../common/SuccessModal";
import { fetchAllRiders } from "@/redux/allRiderSlice";
import { fetchBankList } from "@/redux/bankListSlice";
import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";
import WarningModal from "../common/WarningModal";

const AdminAgentList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dloading, setDloading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activate, setActivate] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const riders = useSelector((state) => state.allRiders.allRiders);
  const [warningOpen, setWarningOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const loader = useSelector((state) => state.allRiders.loading);
  const loading = useSelector((state) => state.allRiders.loading);
  const error = useSelector((state) => state.allRiders.error);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const query = useSelector((state) => state.search.query);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const bankList = useSelector((state) => state.bankList.bankList);
  const success = useSelector((state) => state.bankList.success);
  const [filteredBank, setFilteredBank] = useState([]);
  const permissions = useSelector((state) => state.auth.permissions);
  // console.log(permissions);
  const restricted = useSelector((state) => state.restriction.restricted);

  const handleBankSelection = (data) => {
    const selectedBank = bankList.filter((bnk) => {
      return bnk.code === data?.bankCode;
    });
    setFilteredBank(selectedBank[0]?.name);
  };

  // console.log(riders);
  const filtered = riders?.filter(
    (rider) =>
      rider?.first_name.toLowerCase().includes(query.toLowerCase()) ||
      String(rider?.last_name).toLowerCase().includes(query.toLowerCase())
  );
  // console.log(filteredBank);
  useEffect(() => {
    dispatch(fetchAllRiders({ token, userRole }));
    if (success) {
      return;
    } else {
      dispatch(fetchBankList({ token }));
    }
  }, []);
  const handleDactivate = async (id) => {
    if (permissions.includes("ACTIVATIONS") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.delete(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/deactivate-user/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/deactivate-user/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/deactivate-user/${id}`
          : `${BASE_URL}api/v1/accountant/deactivate-user/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "00") {
        dispatch(fetchAllRiders({ token, userRole }));
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

  const handleActivate = async (id) => {
    if (permissions.includes("ACTIVATIONS") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.put(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/activate-user/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/activate-user/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/activate-user/${id}`
          : `${BASE_URL}api/v1/accountant/activate-user/${id}`,
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "00") {
        dispatch(fetchAllRiders({ token, userRole }));
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

  const handleDelete = async (id) => {
    if (userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }
    setDloading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.delete(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/super-delete/${id}`
          : "",

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
      setDloading(false);
    }
  };
  if (loading) {
    // <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />;
    <Table className={" md:w-[1100px]"}>
      <TableBody>
        {Array.from({ length: 15 }).map((_, index) => (
          <TableRow key={index}>
            {/* Agent (with avatar + name) */}
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="flex flex-col gap-1">
                  <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-2.5 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </TableCell>

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
    </Table>;
  }
  if (error && !loading) {
    <h2 className="text-sm text-center text-red-500">Error fetching agents</h2>;
  }
  return (
    <div className="sm:me-5 sm:ms-2.5 ">
      <div className="flex justify-between items-center mb-6  w-[80%] ">
        <h2 className="text-sm font-semibold">Agent Listing</h2>
        <div className="flex gap-2.5 text-sm">
          {/* <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/agents"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}>
            <Link to="/admin/agents">Agents </Link>
          </Button> */}
          {/* {(userRole === "Admin" || userRole === "Manager") && (
            <Button
              className={`cursor-pointer rounded-[4px] ${
                location.pathname === "/admin/sub-admins"
                  ? "bg-[#B10303] hover:bg-[#B10303]/80"
                  : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
              }`}>
              <Link to="/admin/sub-admins">Staffs</Link>
            </Button>
          )} */}
        </div>
      </div>
      {loader ? (
        // <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
        <Table className={" md:w-[1100px]"}>
          <TableBody>
            {Array.from({ length: 15 }).map((_, index) => (
              <TableRow key={index}>
                {/* Agent (with avatar + name) */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="flex flex-col gap-1">
                      <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-2.5 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </TableCell>

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
      ) : (
        <>
          <div className="overflow-y-auto max-h-[600px] border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 z-50 bg-[#D9D9D9]">
                <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
                  <TableHead className="rounded-l-sm">Agent Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Email </TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Pending Deliveries</TableHead>
                  <TableHead>Successful Deliveries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Action</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[12px] font-[Raleway] ">
                {filtered?.length === 0 ? (
                  <h2 className="text-md font-semibold text-center mt-3">
                    No registered agents at the moment.
                  </h2>
                ) : (
                  filtered?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className={""}>
                        <div className="flex items-center gap-2 mr-5">
                          <img
                            src={Avatar}
                            alt="avatar"
                            className="h-6 w-6 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span>{`${data.first_name} `}</span>
                            <span>{` ${data.last_name}`}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{data.state}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.totalDeliveries}</TableCell>
                      <TableCell>{data.pendingCount}</TableCell>
                      <TableCell>{data.deliveredCount}</TableCell>
                      <TableCell
                        className={`${
                          data.approvalStatus === "APPROVED" ||
                          data.approvalStatus === "ACTIVATE"
                            ? "text-green-400"
                            : "text-red-500"
                        }`}>
                        {data.approvalStatus === "ACTIVATE"
                          ? "APPROVED"
                          : data.approvalStatus}
                      </TableCell>
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
                            <DialogContent className="sm:max-w-[362px]">
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

                                {/* <div className="flex justify-between items-center">
                <Label className="text-xs">Date</Label>
                <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                  {data.date}
                </span>
              </div> */}

                                <div className="flex justify-between items-center">
                                  <Label className="text-xs">
                                    Total Assigned Deliveries
                                  </Label>
                                  <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                                    {data.totalDeliveries}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <Label className="text-xs">
                                    Account Number
                                  </Label>
                                  <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                                    {data.accountNumber}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Label className="text-xs">Bank</Label>
                                  <span className="text-sm text-right text-[10px] text-[#8C8C8C] font-[Raleway]">
                                    {filteredBank}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-center gap-2 ">
                                {/* <Button className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                Report
              </Button> */}
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
                              {data.approvalStatus !== "PENDING" && (
                                <button
                                  className={` ${
                                    data.approvalStatus === "DEACTIVATE"
                                      ? "bg-green-500 hover:bg-green-400"
                                      : ""
                                  } bg-[#B10303] h-6 w-6 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:bg-[#B10303]/75 transition-colors mr-1`}>
                                  {(data.approvalStatus === "APPROVED" ||
                                    data.approvalStatus === "ACTIVATE") && (
                                    <img
                                      onClick={() => {
                                        setErrorMessage("");
                                        setSuccessMessage("");
                                        setActivate(false);
                                      }}
                                      src={Delete}
                                      className="h-6 w-6 text-white"
                                    />
                                  )}
                                  {data.approvalStatus === "DEACTIVATE" && (
                                    <Power
                                      onClick={() => {
                                        setErrorMessage("");
                                        setSuccessMessage("");
                                        setActivate(true);
                                      }}
                                    />
                                  )}
                                </button>
                              )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle
                                  className={`text-[#B10303] text-center gap-2 flex flex-col`}>
                                  {activate ? (
                                    <>
                                      <CheckCircle className="w-20 h-20 mx-auto text-green-400" />
                                      <span className="text-green-500">
                                        Activate
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={AlertCircle}
                                        alt="Alert Icon"
                                        className="w-20 h-20 mx-auto"
                                      />
                                      <span>Deactivate</span>
                                    </>
                                  )}
                                </DialogTitle>
                                <DialogDescription className="text-center text-foreground font-semibold text-xs">
                                  {userRole === "Admin" && !activate
                                    ? "Deleting this user will permanently remove all their records including transaction history from the database. This action is irreversible and the data cannot be recovered. If you only want to restrict the user’s access without losing their records, please consider deactivating the user instead.  "
                                    : `Are you sure you want to ${
                                        activate ? "activate" : "deactivate"
                                      }  this Agent?`}
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
                                <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] px-3 text-sm rounded-[3px] h-9">
                                  Cancel
                                </DialogClose>
                                <Button
                                  onClick={() => {
                                    if (activate) {
                                      handleActivate(data.userId);
                                    } else {
                                      handleDactivate(data.userId);
                                    }
                                  }}
                                  type="submit"
                                  disabled={isLoading || dloading}
                                  className={`${
                                    activate
                                      ? "bg-green-500 hover:bg-green-400"
                                      : "bg-[#B10303] hover:bg-[#B10303]/80"
                                  }  text-white  text-sm rounded-[3px] h-9`}>
                                  {isLoading
                                    ? "processing.."
                                    : `${
                                        activate ? "Activate" : "Deactivate"
                                      } `}
                                </Button>

                                {userRole === "Admin" && !activate && (
                                  <Button
                                    onClick={() => {
                                      setSelectedId(data.userId);
                                      setWarningOpen(true);
                                      setDloading(false);
                                    }}
                                    disabled={dloading || isLoading}
                                    type="submit"
                                    className="bg-[#B10303] hover:bg-[#B10303]/80 text-white  text-sm rounded-[3px] h-9">
                                    {dloading ? "processing.." : "Delete"}
                                  </Button>
                                )}
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
          </div>
        </>
      )}

      <WarningModal
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        onConfirm={() => {
          handleDelete(selectedId);
          setWarningOpen(false);
        }}
        loading={dloading}
      />

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

export default AdminAgentList;
