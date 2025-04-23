import { activities } from "@/config/activities";

const Activities = () => {
  return (
    <div className=" font-normal pt-4 mt-1">
      <div className=" pb-3 text-sm">Activities</div>
      <div className="max-h-[45.5vh] overflow-y-auto">
        {activities.map((data) => {
          return (
            <div key={data.id} className="flex items-start gap-2 mb-2 pe-1 ">
              <div className="shrink-0 h-6 w-6  flex items-center justify-center ">
                <img src={data.icon} alt="avatar" />
              </div>

              <div className="flex flex-col flex-grow ">
                <span className=" text-[13px] -mt-1">{data.message}</span>
                <span className="text-[#8C8C8C] text-xs  whitespace-nowrap">
                  {data.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activities;
