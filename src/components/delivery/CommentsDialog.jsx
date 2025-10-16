import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/lib/Api";

const CommentsDialog = ({ open, onClose, deliveryId, token, receiverId }) => {
  const userRole = useSelector((state) => state.auth.user.userRole);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // 🟦 Fetch comments
  const fetchComments = async () => {
    if (!deliveryId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/get-comments/${deliveryId}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/get-comments/${deliveryId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/get-comments/${deliveryId}`
          : `${BASE_URL}api/v1/accountant/get-comments/${deliveryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Fetch when opened
  useEffect(() => {
    if (open && deliveryId) fetchComments();
  }, [open, deliveryId]);

  // 🟩 Handle sending message
  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const payload = {
        deliveryId,
        receiverId,
        message,
      };

      await axios.post(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/addComment-to-delivery`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/addComment-to-delivery`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/addComment-to-delivery`
          : `${BASE_URL}api/v1/accountant/addComment-to-delivery`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("");
      await fetchComments(); // Refresh messages after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] h-[550px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[#B10303] font-semibold">
            Delivery Comments
          </DialogTitle>
        </DialogHeader>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto border rounded-md p-3 bg-gray-50 space-y-3">
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No comments yet.
            </p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className={`flex ${
                  c.userRole !== "Rider" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm shadow-sm ${
                    c.userRole !== "Rider"
                      ? "bg-[#0659a6] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}>
                  <p className="font-semibold text-xs mb-1">{c.senderName}</p>
                  <p>{c.message}</p>
                  <span className="text-[10px] opacity-70 block mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="mt-4 flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent line break
                handleSend();
              }
            }}
            className="flex-1 border-gray-300"
          />
          <Button
            onClick={handleSend}
            disabled={sending}
            className="bg-[#0659a6] hover:bg-[#054884] text-white">
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>

        <div className="flex justify-end mt-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-[#B10303] border-[#B10303]">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
