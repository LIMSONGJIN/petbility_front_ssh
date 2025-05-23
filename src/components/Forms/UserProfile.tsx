"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";

export function UserProfile() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/login">로그인</Link>
      </Button>
    );
  }

  const userInitials = session.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 outline-none"
          >
            <Avatar>
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || "사용자"}
              />
              <AvatarFallback className="bg-violet-200 text-violet-700">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{session.user.name}</span>
              <span className="text-xs text-gray-500">
                {session.user.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex w-full cursor-pointer items-center"
            >
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex w-full cursor-pointer items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
