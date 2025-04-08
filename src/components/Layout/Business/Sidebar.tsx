import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  Package,
  DollarSign,
  MessageSquare,
  ArrowLeftIcon,
  ChevronLeftIcon,
} from "lucide-react";

const menuItems = [
  {
    title: "대시보드",
    href: "/business",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "예약 관리",
    href: "/business/reservations",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "서비스 관리",
    href: "/business/services",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "고객 관리",
    href: "/business/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "매출 관리",
    href: "/business/sales",
    icon: <DollarSign className="w-5 h-5" />,
  },
  // {
  //   title: "설정",
  //   href: "/business/settings",
  //   icon: <Settings className="w-5 h-5" />,
  // },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed left-0 top-0 h-full ${
        isOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        <Link
          href="/"
          className={`flex items-center gap-2 ${
            isOpen ? "w-full" : "w-12"
          } transition-all duration-300`}
        >
          <span
            className={`${
              isOpen ? "opacity-100 w-auto" : "w-auto"
            } transition-all duration-300 whitespace-nowrap overflow-hidden font-bold text-violet-600 text-xl`}
          >
            {isOpen ? "Petbility" : "P"}
          </span>
        </Link>
      </div>

      <nav className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-violet-100 text-violet-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`${pathname === item.href ? "scale-110" : ""}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`${
                    isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                  } transition-all duration-300 whitespace-nowrap overflow-hidden`}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={onToggle}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 p-2 rounded-lg z-50"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-white border hover:bg-gray-100 transition-colors rounded-full shadow-sm">
          <ChevronLeftIcon
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
