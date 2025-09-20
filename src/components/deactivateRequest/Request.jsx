import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Avatar from "../../assets/icons/avatar.svg";
import AlertCircle from "../../assets/icons/alert-circle.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import RestrictionModal from "../common/RestrictionModal";
import { setRestricted } from "@/redux/restrictionSlice";
import { fetchRequest } from "@/redux/requestSlice";
import axios from "axios";
import SuccessModal from "../common/SuccessModal";
import { BASE_URL } from "@/lib/Api";

const Request = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const permissions = useSelector((state) => state.auth.permissions);
  const token = useSelector((state) => state.auth.token);
  const restricted = useSelector((state) => state.restriction.restricted);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const request = useSelector((state) => state.request.request);
  const loading = useSelector((state) => state.request.loading);
  const error = useSelector((state) => state.request.error);
  useEffect(() => {
    dispatch(fetchRequest({ token, userRole }));
  }, []);
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  const handleDeactivate = async (id) => {
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
        dispatch(fetchRequest({ token, userRole }));
        setSuccessMessage(response.data.data);
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessMessage("");
          setSuccessModalOpen(false);
        }, 5000);
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

  if (loading) {
    return (
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

              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              <TableCell>
                <div className="h-2.5 w-16 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              <TableCell>
                <div className="h-2.5 w-20 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

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
        <p className="text-center font-semibold text-sm text-red-600">
          Something went wrong, check internet connection.
        </p>
      </div>
    );
  }
  return (
    <div className="sm:me-5 sm:ms-2.5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold">Deactivate account request</h2>
      </div>
      {/* ✅ Scroll container */}
      <div className="overflow-y-auto max-h-[600px] border rounded-md">
        <Table className="md:w-[1100px] border-collapse table-fixed">
          <TableHeader className="sticky top-0 z-50 bg-[#D9D9D9]">
            <TableRow className="text-sm">
              <TableHead>Agent</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className={"w-[100px]"}>Reason</TableHead>
              <TableHead> Status</TableHead>
              <TableHead> Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[12px] font-[Raleway] font-[500]">
            {request.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No requests at the moment.
                </td>
              </tr>
            ) : (
              request.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2 mr-4">
                      <img
                        src={Avatar}
                        alt="avatar"
                        className="h-6 w-6 rounded-full"
                      />
                      <div className="flex gap-1">
                        <span>{data.riderName}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{data.email}</span>
                    </div>
                  </TableCell>

                  <TableCell>{formatDate(data.createdAt)}</TableCell>

                  <TableCell className={"w-[100px]"}>{data.reason}</TableCell>
                  <TableCell>{data.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      {/* Delete Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="bg-[#B10303] h-6 w-6 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:bg-[#B10303]/75 transition-colors mr-1">
                            <Trash2 className="h-6 w-6 text-white" />
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
                              <span>Deactivate</span>
                            </DialogTitle>
                            <DialogDescription className="text-center text-foreground font-semibold text-xs">
                              Are you sure you want to deactivate this account?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-center gap-2">
                            <DialogClose className="bg-white border border-[#8C8C8C] hover:bg-gray-100 text-[#8C8C8C] w-1/2 text-sm rounded-[3px] h-9">
                              Cancel
                            </DialogClose>
                            <Button
                              onClick={() => handleDeactivate(data.riderId)}
                              disable={isLoading}
                              type="submit"
                              className="bg-[#B10303] hover:bg-[#B10303]/80 text-white w-1/2 text-sm rounded-[3px] h-9">
                              {isLoading ? "Processing..." : "Deactivate"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <button
                        onClick={() => {
                          setSelectedId(data.deliveryId);
                          setDetailsOpen(true);
                        }}></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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

export default Request;
