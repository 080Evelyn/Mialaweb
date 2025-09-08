import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowRightCircle, CheckCircle, Loader2, Power } from "lucide-react";
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
import { Link, useLocation } from "react-router";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import Delete from "../../assets/icons/delete.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { BASE_URL } from "@/lib/Api";
import axios from "axios";
import { fetchSubadmin } from "@/redux/subadminSlice";
import SuccessModal from "../common/SuccessModal";
import { setRestricted } from "@/redux/restrictionSlice";
import RestrictionModal from "../common/RestrictionModal";
import UserProfile from "./UserProfile";

const initialFormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  userRole: "",
  state: "",
  permissions: [],
};

const AdminList = () => {
  const userRoles = [
    { id: 1, role: "Accountant" },
    { id: 2, role: "Manager" },
    { id: 3, role: "CustomerCare" },
  ];

  const permissions = [
    "CREATE_STAFF",
    "APPROVE_BLOCK_RIDER_SIGNUP",
    "CREATE_EDIT_DELIVERY",
    "PIN_UNPIN_RIDER",
    // "DELETE_RIDER",
    // "DELETE_STAFF",
    // "NO_PERMISSION",
    // DELETE_MANAGER,
    "VIEW_ACCOUNT_DETAILS_TXN_HISTORY",
    "VIEW_ALL_DELIVERIES",
    "ACCEPT_REJECT_DELIVERY_FEE",
    "CREATE_DELETE_PRODUCT",
    // ALL_ACTIONS,
    "ACTIVATE_DEACTIVATE_USER",
  ];
  const [activate, setActivate] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const subAdmins = useSelector((state) => state.subadmin.subadmin);
  // console.log(subAdmins);
  const [dloading, setDloading] = useState(false);
  const loading = useSelector((state) => state.subadmin.loading);
  const success = useSelector((state) => state.subadmin.success);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const restricted = useSelector((state) => state.restriction.restricted);
  const permission = useSelector((state) => state.auth.permissions);

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      return;
    }
    dispatch(fetchSubadmin({ token, userRole }));
  }, []);
  // const sortedAdmin = [...subAdmins]?.reverse();

  const handleAddSubadmin = async (e) => {
    e.preventDefault();

    if (
      formData.first_name === "" ||
      formData.last_name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.phone === "" ||
      formData.userRole === "" ||
      formData.permissions.length === 0
    ) {
      setErrorMessage("All Input Field must be filled!!");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/create-admin-user`
          : `${BASE_URL}api/v1/manager/create-admin-user`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        dispatch(fetchSubadmin({ token, userRole }));
        setSuccessMessage("Admin-user Created Successfully!");
        setFormData(initialFormState);
        setSuccessModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(`An error occured while creating admin user.`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      permission.includes("ACTIVATE_DEACTIVATE_USER") ||
      userRole === "Admin"
    ) {
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
        dispatch(fetchSubadmin({ token, userRole }));
        setSuccessMessage(response.data.data);
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
      setDLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (
      permission.includes("ACTIVATE_DEACTIVATE_USER") ||
      userRole === "Admin"
    ) {
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
        dispatch(fetchSubadmin({ token, userRole }));
        setSuccessMessage(response.data.data);
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

  const handleActivate = async (id) => {
    if (
      permissions.includes("ACTIVATE_DEACTIVATE_USER") ||
      userRole === "Admin"
    ) {
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
          ? `${BASE_URL}api/v1/admin/activate-user/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/activate-user/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/activate-user/${id}`
          : `${BASE_URL}api/v1/accountant/activate-user/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "00") {
        dispatch(fetchSubadmin({ token, userRole }));
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
    <div className="sm:me-5 sm:ms-2.5 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Admin Listing</h2>
        <div className="flex gap-2.5 text-sm">
          {/* <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/agents"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}>
            <Link to="/admin/agents">Agents </Link>
          </Button> */}
          {/* <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/sub-admins"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}>
            <Link to="/admin/sub-admins">Staffs</Link>
          </Button> */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {/* <DialogTrigger asChild> */}
            <button
              onClick={() => {
                if (
                  permission.includes("CREATE_STAFF") ||
                  userRole === "Admin"
                ) {
                  dispatch(setRestricted(false));
                } else {
                  dispatch(setRestricted(true));
                  return;
                }
                setFormData(initialFormState);
                setDialogOpen(true);
              }}
              className=" bg-[#B10303] border-[1px] border-[#B10303] py-2 cursor-pointer hover:bg-[#B10303]/80 text-[#fff] px-2 rounded-[4px]">
              Add Staff
            </button>
            {/* </DialogTrigger> */}
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="text-[#B10303] text-left">
                  Create Admin staff
                </DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-2 py-3 ">
                <div className="flex justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="first_name">
                      First Name
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="last_name">
                      Last Name
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-between">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="email"
                      type={"email"}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-between">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs" htmlFor="phone">
                      Phone Number
                    </Label>
                    <Input
                      className="rounded-xs bg-[#8C8C8C33]"
                      id="phone"
                      type={"number"}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-[50%]">
                    <label className="text-xs" htmlFor="user-role">
                      User Role
                    </label>
                    <select
                      id="user-role"
                      value={formData.userRole}
                      onChange={(e) =>
                        setFormData({ ...formData, userRole: e.target.value })
                      }
                      className="w-full rounded bg-[#8C8C8C33] p-2">
                      <option value="" disabled>
                        Select Role
                      </option>
                      {userRoles.map(({ id, role }) => (
                        <option className="bg-white" key={id} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-50 overflow-y-auto p-2 border rounded bg-[#8C8C8C33]">
                    {permissions.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [...formData.permissions, perm],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(
                                  (p) => p !== perm
                                ),
                              });
                            }
                          }}
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm text-center">
                    {errorMessage}
                  </p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <DialogClose
                    onClick={() => {
                      setErrorMessage(""), setSuccessMessage("");
                      setFormData(initialFormState);
                    }}
                    className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                    Cancel
                  </DialogClose>
                  <Button
                    onClick={handleAddSubadmin}
                    type="submit"
                    className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                    {isLoading ? "Loading.." : "Submit"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
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
        <Table className={"overflow-x-scroll w-full"}>
          <TableHeader>
            <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
              <TableHead className="rounded-l-sm">Name</TableHead>
              <TableHead className="rounded-l-sm">Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number </TableHead>
              <TableHead>Status </TableHead>
              <TableHead>
                <span className="sr-only">Action</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[12px] font-[Raleway] ">
            {subAdmins?.map((data, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={Avatar}
                      alt="avatar"
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{`${data?.first_name} ${
                      data.last_mame ? data.last_mame : ""
                    }`}</span>
                  </div>
                </TableCell>
                <TableCell>{data.userRole}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell
                  className={`${
                    data.approvalStatus === "APPROVED" ||
                    data.approvalStatus === "ACTIVATE"
                      ? "text-green-400"
                      : "text-red-500"
                  } `}>
                  {data.approvalStatus === "ACTIVATE"
                    ? "APPROVED"
                    : data.approvalStatus}
                </TableCell>
                <TableCell>
                  {/* Delete Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#B10303] text-center gap-2 flex flex-col">
                          {activate ? (
                            <>
                              <CheckCircle className="w-20 h-20 mx-auto text-green-400" />
                              <span className="text-green-500">Activate</span>
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
                            ? "Deleting this user will permanently remove all their records from the database. This action is irreversible and the data cannot be recovered. If you only want to restrict the user’s access without losing their records, please consider deactivating the user instead.  "
                            : `Are you sure you want to ${
                                activate ? "activate" : "deactivate"
                              }  this Staff?`}
                        </DialogDescription>
                      </DialogHeader>
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
                      <div className="flex justify-center gap-2">
                        <DialogClose
                          onClick={() => {
                            setErrorMessage(""), setSuccessMessage("");
                          }}
                          className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] px-3 text-sm rounded-[3px] h-9">
                          Cancel
                        </DialogClose>
                        {userRole === "Admin" && !activate && (
                          <Button
                            onClick={() => {
                              handleDelete(data.id);
                            }}
                            type="submit"
                            className="bg-[#B10303] hover:bg-[#B10303]/80 text-white px-3 text-sm rounded-[3px] h-9">
                            {dloading ? "Deleting..." : "Delete"}
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            if (activate) {
                              handleActivate(data.id);
                            } else {
                              handleDeactivate(data.id);
                            }
                          }}
                          type="submit"
                          className={`${
                            activate
                              ? "bg-green-500 hover:bg-green-400"
                              : "bg-[#B10303] hover:bg-[#B10303]/80"
                          }  text-white  text-sm rounded-[3px] h-9`}>
                          {isLoading
                            ? "processing.."
                            : `${activate ? "Activate" : "Deactivate"} `}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {/* Details Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => {
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}>
                        <ArrowRightCircle className="h-6 w-6 text-[#D9D9D9] hover:text-gray-500" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#B10303] text-center gap-2 flex flex-col">
                          <span>Profile</span>
                        </DialogTitle>
                      </DialogHeader>
                      <UserProfile
                        data={data}
                        formData={formData}
                        setFormData={setFormData}
                        id={data.id}
                        successModalOpen={successModalOpen}
                        setSuccessModalOpen={setSuccessModalOpen}
                        successMessage={successMessage}
                        setSuccessMessage={setSuccessMessage}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`${successMessage}`}
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

export default AdminList;
