import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActivityInterceptor } from "@/hooks/activityInterceptor";

const ActivityInterceptor = ({ onLogout }) => {
  const { showPrompt, countdown, stayActive } = useActivityInterceptor({
    inactiveTime: 10 * 60 * 1000, // 10 mins
    countdownTime: 60, // 60 seconds
    onLogout,
  });

  return (
    <Dialog open={showPrompt}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Are you still there?
          </DialogTitle>
        </DialogHeader>

        <p className="mt-2 text-gray-600">
          You've been inactive for a while. You will be logged out automatically
          in:
        </p>

        <p className="text-center text-4xl font-bold text-red-500 my-4">
          {countdown}s
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={stayActive}>
            I'm still here
          </Button>

          <Button variant="destructive" onClick={onLogout}>
            Logout now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityInterceptor;
