import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { testimonials } from "@/config";
import { StarIcon } from "lucide-react";

const Testimonial = () => (
  <section
    id="testimonials"
    className="min-h-screen flex justify-center items-center py-20 px-6"
  >
    <div>
      <h2 className="text-5xl font-semibold text-center tracking-[-0.03em]">
        Loved by Many
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl">
        See what our users have to say
      </p>
      <div className="mt-8 sm:mt-14 w-full max-w-(--breakpoint-xl) mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden border-r border-background">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col outline-solid outline-1 outline-border px-6 py-8"
            >
              <div className="flex items-center justify-center gap-2">
                <StarIcon className="w-6 h-6 fill-yellow-500 stroke-yellow-500" />
                <StarIcon className="w-6 h-6 fill-yellow-500 stroke-yellow-500" />
                <StarIcon className="w-6 h-6 fill-yellow-500 stroke-yellow-500" />
                <StarIcon className="w-6 h-6 fill-yellow-500 stroke-yellow-500" />
                <StarIcon className="w-6 h-6 fill-yellow-500 stroke-yellow-500" />
              </div>
              <p className="my-6 text-[17px] text-center max-w-md">
                &quot;{testimonial.testimonial}&quot;
              </p>
              <div className="mt-auto flex items-center justify-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonial;
