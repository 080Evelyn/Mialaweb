import axios from "axios";
import { useState } from "react";
import Avatar from "../../assets/icons/avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubadmin } from "@/redux/subadminSlice";
import { setRestricted } from "@/redux/restrictionSlice";
import { BASE_URL } from "@/lib/Api";

const UserProfile = ({
  data,
  formData,
  setFormData,
  id,
  setSuccessModalOpen,
  successMessage,
  setSuccessMessage,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user.userRole);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [role, setRole] = useState(false);

  const userRoles = [
    { id: 1, role: "Accountant" },
    { id: 2, role: "Manager" },
    { id: 3, role: "CustomerCare" },
  ];
  const permissions = [
    // "CREATE_STAFF",
    // "APPROVE_BLOCK_RIDER_SIGNUP",
    // "CREATE_EDIT_DELIVERY",
    // "PIN_UNPIN_RIDER",
    // "DELETE_RIDER",
    // "DELETE_STAFF",
    // "NO_PERMISSION",
    // DELETE_MANAGER,
    // "VIEW_ACCOUNT_DETAILS_TXN_HISTORY",
    // "VIEW_ALL_DELIVERIES",
    // "ACCEPT_REJECT_DELIVERY_FEE",
    // "CREATE_DELETE_PRODUCT",
    // ALL_ACTIONS,
    // "ACTIVATE_DEACTIVATE_USER",

    "ADMIN",
    "APPROVALS",
    "ORDERS_MANAGEMENT",
    "TAGS",
    "DELETIONS",
    // NO_PERMISSION,
    "TRANSACTIONS",
    "DELIVERY_FEE",
    "PRODUCT_MANAGEMENT",
    "ACTIVATIONS",
  ];
  const [userPermissions, setUserPermissions] = useState(
    data.permissions || []
  );

  const togglePermission = (perm) => {
    let updated;
    if (userPermissions.includes(perm)) {
      updated = userPermissions.filter((p) => p !== perm);
    } else {
      updated = [...userPermissions, perm];
    }

    setUserPermissions(updated);

    // also update formData so backend gets the change
    setFormData((prev) => ({
      ...prev,
      permissions: updated,
    }));
  };

  const handleUpdatePermissions = async () => {
    if (permissions.includes("ACTIVATIONS") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const payload = {
      permissions: formData.permissions,
    };

    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/users/${id}/permissions`
          : `${BASE_URL}api/v1/manager/users/${id}/permissions`,
        payload,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        setSuccessModalOpen(response.data.responseMsg === "Success");
        dispatch(fetchSubadmin({ token, userRole }));
        setSuccessMessage(response.data.responseMsg);
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

  const handleRole = async () => {
    if (permissions.includes("ACTIVATIONS") || userRole === "Admin") {
      dispatch(setRestricted(false));
    } else {
      dispatch(setRestricted(true));
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const payload = {
      newRole: formData.userRole,
    };

    try {
      const response = await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/${id}/change-role`
          : `${BASE_URL}api/v1/manager/${id}/change-role`,
        payload,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        setSuccessModalOpen(response.data.responseMsg === "Success");
        dispatch(fetchSubadmin({ token, userRole }));
        setSuccessMessage(response.data.responseMsg);
      } else if (response.data.responseCode === "55") {
        setErrorMessage(response.data.responseDesc);
      }
    } catch (error) {
      setErrorMessage(`An error occured.`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="border shadow-md p-2 m-auto space-y-1">
        <div className="flex justify-between">
          <p className="font-semibold">Full Name:</p>
          <div className="flex items-center gap-2">
            <img src={Avatar} alt="avatar" className="h-6 w-6 rounded-full" />
            <span className="font-semibold">{`${data?.first_name} ${
              data?.last_name ?? ""
            }`}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold">User Role:</p>
          <span className="font-semibold">{data.userRole}</span>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold">Email:</p>
          <span className="font-semibold">{data.email}</span>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold">Phone:</p>
          <span className="font-semibold">{data.phone}</span>
        </div>
        <div className="flex m-1">
          <button
            onClick={() => {
              setRole(!role);
            }}
            className="justify-center text-white border cursor-pointer hover:bg-gray-500 font-semibold bg-gray-400  p-2 rounded-md shadow-md m-auto ">
            {role ? "View Permissions" : "Change Staff Role"}
          </button>
        </div>
      </div>
      {!role && (
        <div className="border shadow-md px-2 pb-4 m-auto mt-4">
          <p className="font-semibold mt-3">Permissions:</p>
          <div className="flex flex-col gap-2 mt-2">
            {permissions.map((perm) => (
              <label key={perm} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={userPermissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
                <span>{perm}</span>
              </label>
            ))}
          </div>

          <div className="flex w-full mt-5">
            <button
              disabled={isLoading}
              onClick={handleUpdatePermissions}
              className="justify-center text-white border cursor-pointer w-[100px] hover:bg-green-500 font-semibold  bg-green-400  p-2 rounded-md shadow-md m-auto ">
              {isLoading ? "Processing..." : "Update "}
            </button>
          </div>
          {successMessage && (
            <p className="text-green-500 text-sm text-center">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
        </div>
      )}

      {role && (
        <div className="border shadow-md px-2 pb-4 m-auto mt-4">
          <p className="pt-3 font-semibold text-center mb-3">
            Select User Role
          </p>
          <div className="flex flex-col gap-1 w-[100%]">
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
          <div className="flex mt-5">
            <button
              disabled={Loading}
              onClick={handleRole}
              className="justify-center text-white border cursor-pointer hover:bg-green-400 font-semibold  bg-green-500  p-2 rounded-md shadow-md m-auto ">
              {Loading ? "Processing..." : "Update Role"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
