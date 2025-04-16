import { AlignJustify, Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "../ui/input";
import Filter from "../../assets/icons/Filter.svg";

function AdminHeader({ setOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b px-5 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="lg:hidden sm:block cursor-pointer"
          >
            <AlignJustify />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboards</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span>/</span>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Delivery</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex sm:flex-1 justify-end max-w-full sm:max-w-[271px] lg:me-45">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <img
              src={Filter}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-6 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search"
              className="pl-9 pr-9 w-full sm:w-full border-0 lg:w-[407px] bg-black/4"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
