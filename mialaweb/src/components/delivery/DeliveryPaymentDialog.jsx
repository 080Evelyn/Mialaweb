import { ArrowRightCircle, BanknoteArrowUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRidersById } from "@/redux/riderByIdSlice";
import { fetchBankList } from "@/redux/bankListSlice";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import SuccessModal from "../common/SuccessModal";

const DeliveryPaymentDialog = ({ data }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.userRole);
  const selectedRider = useSelector((state) => state.riderById.riderById);
  const bankList = useSelector((state) => state.bankList.bankList);
  const success = useSelector((state) => state.bankList.success);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const selectedBank = bankList.filter((bnk) => {
    return bnk.code === selectedRider.bankName;
  });
  const selectedBankName = selectedBank[0]?.name;
  const [formDataStep1, setFormDataStep1] = useState({
    name: selectedRider.accountName || "",
    userId: selectedRider.userId || "",
    account_number: selectedRider.accountNumber || "",
    bank_code: selectedRider.bankName || "",
  });
  const [formDataStep2, setFormDataStep2] = useState({
    amount: "",
    reason: "",
  });
  const id = data.riderId;
  useEffect(() => {
    dispatch(fetchRidersById({ token, userRole, id }));
    if (success) {
      return;
    } else {
      dispatch(fetchBankList({ token }));
    }
  }, []);
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/create-recipient?userId=${id}`
          : `${BASE_URL}api/v1/subadmin/create-recipient?userId=${id}`,
        formDataStep1,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseMsg === "Success") {
        setStep(2);
      }
    } catch (error) {
      setErrorMessage("Failed to create recipient.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    console.log(formDataStep2);
    setIsLoading(true);
    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/initiate?userId=${id}`
          : `${BASE_URL}api/v1/subadmin/initiate?userId=${id}`,
        formDataStep2,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.responseCode === "00") {
        setSuccessMessage("Payment Initialization Successful");
        setSuccessModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Payment Initialization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="h-6.5 w-6.5 p-0.5 rounded-sm cursor-pointer flex items-center justify-center">
            <BanknoteArrowUp className="h-5.5 w-5.5 text-[#D9D9D9] hover:text-gray-500 cursor-pointer" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[362px] ">
          <DialogHeader>
            <DialogTitle className="text-[#B10303] text-left">
              Payment
            </DialogTitle>
          </DialogHeader>
          {step === 1 && (
            <form className="flex flex-col gap-2 py-3">
              <h2 className="text-xl font-bold">Create Receipient</h2>

              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="name">
                  Name
                </Label>
                <Input
                  className="rounded-xs bg-[#8C8C8C33]"
                  id="name"
                  value={formDataStep1.name}
                  onChange={(e) =>
                    setFormDataStep1({
                      ...formDataStep1,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="account_number">
                  Account Number
                </Label>
                <Input
                  classaccount_number="rounded-xs bg-[#8C8C8C33]"
                  id="account_number"
                  // readOnly
                  value={formDataStep1.account_number}
                  onChange={(e) =>
                    setFormDataStep1({
                      ...formDataStep1,
                      account_number: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="bank_code">
                  Bank Name
                </Label>
                <Input
                  classbank_code="rounded-xs bg-[#8C8C8C33]"
                  id="bank_code"
                  value={selectedBankName}
                  // onChange={(e) =>
                  //   setFormDataStep1({
                  //     ...formDataStep1,
                  //     bank_code: e.target.value,
                  //   })
                  // }
                />
              </div>
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
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                  Cancel
                </DialogClose>
                <Button
                  onClick={handleSubmitStep1}
                  type="button"
                  className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                  {isLoading ? "Loading.." : "Submit"}
                </Button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form className="flex flex-col gap-2 py-3">
              <h2 className="text-xl font-bold">Initialize Payment</h2>

              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="amount">
                  Amount
                </Label>
                <Input
                  className="rounded-xs bg-[#8C8C8C33]"
                  id="amount"
                  type={"number"}
                  value={formDataStep2.amount}
                  onChange={(e) =>
                    setFormDataStep2({
                      ...formDataStep2,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs" htmlFor="reason">
                  Reason
                </Label>
                <Input
                  className="rounded-xs bg-[#8C8C8C33]"
                  id="reason"
                  value={formDataStep2.reason}
                  onChange={(e) =>
                    setFormDataStep2({
                      ...formDataStep2,
                      reason: e.target.value,
                    })
                  }
                />
              </div>
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
              <div className="flex justify-end gap-2 mt-4">
                {/* <DialogClose
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  }}
                  className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                  Cancel
                  </DialogClose> */}
                <Button
                  className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmitStep2}
                  type="button"
                  className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
                  {isLoading ? "Loading.." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={`Payment for ${selectedRider.first_name} ${selectedRider.last_name} has been initialized.`}
      />
    </div>
  );
};

export default DeliveryPaymentDialog;
