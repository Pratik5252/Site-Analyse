import { ChevronUp, LayoutDashboard, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarRail,
  // SidebarSeparator,
} from "@/Components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import Logout from "../Utils/Logout";
import { useAuth } from "@/contexts/AuthContext";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="overflow-hidden"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="py-2">
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* <SidebarSeparator className="mx-0" /> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="cursor-pointer border bg-sidebar-accent"
              >
                <SidebarMenuButton>
                  {user && user.photoURL ? (
                    <>
                      <img
                        src={user?.photoURL || ""}
                        alt=""
                        srcSet=""
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <p>{user.displayName}</p>
                    </>
                  ) : (
                    <>
                      <User /> <p>Username</p>
                    </>
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="DropdownMenuContent">
                <DropdownMenuItem className="flex justify-between">
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
