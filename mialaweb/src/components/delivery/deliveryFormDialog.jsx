import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

const DeliveryFormDialog = ({
  dialogOpen,
  setDialogOpen,
  formMode,
  formData,
  setFormData,
  handleOpenAdd,
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAdd}
          className="bg-[#B10303] rounded-[4px] hover:bg-[#B10303]/80 cursor-pointer"
        >
          Assign New Delivery
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[362px]">
        <DialogHeader>
          <DialogTitle className="text-[#B10303]">
            {formMode === "add" ? "Assign New Delivery" : "Edit Delivery"}
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="productName">
              Product Name
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="stockQuantity">
              Stock Quantity
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="stockQuantity"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({ ...formData, stockQuantity: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="price">
              Price
            </Label>
            <Input
              className="rounded-xs bg-[#8C8C8C33]"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            >
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="lagos"
                >
                  Lagos
                </SelectItem>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="abuja"
                >
                  Abuja
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Agent</Label>
            <Select
              value={formData.agent}
              onValueChange={(value) =>
                setFormData({ ...formData, agent: value })
              }
            >
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="agent1"
                >
                  Agent 1
                </SelectItem>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="agent2"
                >
                  Agent 2
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Payment Status</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentStatus: value })
              }
            >
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="paid"
                >
                  Paid
                </SelectItem>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="not_paid"
                >
                  Not Paid
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Delivery Status</Label>
            <Select
              value={formData.deliveryStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, deliveryStatus: value })
              }
            >
              <SelectTrigger className="w-full rounded-xs bg-[#8C8C8C33]">
                <SelectValue placeholder="Select Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="delivered"
                >
                  Delivered
                </SelectItem>
                <SelectItem
                  className="hover:bg-gray-200 cursor-pointer"
                  value="not_delivered"
                >
                  Not Delivered
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose className="bg-white border border-[#8C8C8C] cursor-pointer hover:bg-gray-100 text-[#8C8C8C] w-1/2 font-[Raleway] text-sm rounded-[3px] h-9">
              Cancel
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#B10303] hover:bg-[#B10303]/80 cursor-pointer text-white w-1/2 font-[Raleway] text-sm rounded-[3px] h-9"
            >
              Done
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryFormDialog;
