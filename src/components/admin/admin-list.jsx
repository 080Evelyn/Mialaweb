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

const initialFormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  userRole: "",
  state: "",
};

const AdminList = () => {
  const userRoles = [
    { id: 1, role: "Accountant" },
    { id: 2, role: "Manager" },
    { id: 3, role: "CustomerCare" },
  ];
  const [formData, setFormData] = useState(initialFormState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const subAdmins = useSelector((state) => state.subadmin.subadmin);
  const loading = useSelector((state) => state.subadmin.loading);
  const success = useSelector((state) => state.subadmin.success);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const restricted = useSelector((state) => state.restriction.restricted);
  const location = useLocation();
  const dispatch = useDispatch();
  // console.log(subAdmins);
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
      formData.userRole === ""
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
    if (userRole === "Manager") {
      dispatch(setRestricted(true));

      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.delete(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delete-admin-staffs/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delete-admin-staffs/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delete-admin-staffs/${id}`
          : `${BASE_URL}api/v1/accountant/delete-admin-staffs/${id}`,
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
  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Admin Listing</h2>
        <div className="flex gap-2.5 text-sm">
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/agents"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            } `}>
            <Link to="/admin/agents">Agents </Link>
          </Button>
          <Button
            className={`cursor-pointer rounded-[4px] ${
              location.pathname === "/admin/sub-admins"
                ? "bg-[#B10303] hover:bg-[#B10303]/80"
                : "bg-white border-[1px] border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C]"
            }`}>
            <Link to="/admin/sub-admins">Staffs</Link>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {/* <DialogTrigger asChild> */}
            <button
              onClick={() => {
                if (userRole === "Accountant" || userRole === "CustomerCare") {
                  dispatch(setRestricted(true));
                  return;
                }
                setFormData(initialFormState);
                setDialogOpen(true);
              }}
              className=" bg-[#B10303] border-[1px] border-[#B10303] cursor-pointer hover:bg-[#B10303]/80 text-[#fff] px-2 rounded-[4px]">
              Add Staff
            </button>
            {/* </DialogTrigger> */}
            <DialogContent className="sm:max-w-[362px]">
              <DialogHeader>
                <DialogTitle className="text-[#B10303] text-left">
                  Create Admin staff
                </DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-2 py-3">
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

                <div className="flex flex-col gap-1">
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
        <Loader2 className="animate-spin w-5 h-5 m-auto mt-5" />
      ) : (
        <Table className={"overflow-x-scroll w-full"}>
          <TableHeader>
            <TableRow className="bg-[#D9D9D9] hover:bg-[#D6D6D6] text-xs">
              <TableHead className="rounded-l-sm">Name</TableHead>
              <TableHead className="rounded-l-sm">Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number </TableHead>
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
                      data.last_name ? data.last_name : ""
                    }`}</span>
                  </div>
                </TableCell>
                <TableCell>{data.userRole}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>
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
                          Are you sure you want to delete this staff?
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
                          className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                          Cancel
                        </DialogClose>
                        <Button
                          onClick={() => {
                            handleDelete(data.id);
                          }}
                          type="submit"
                          className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                          {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
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
