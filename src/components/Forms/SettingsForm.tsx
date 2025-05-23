"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function SettingsForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const saveNotificationSettings = async () => {
    try {
      setIsLoading(true);
      // 실제 구현에서는 여기에서 API 호출을 통해 설정을 저장합니다.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("알림 설정이 저장되었습니다.");
    } catch (err) {
      toast.error("설정 저장 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center">
        <p>로그인이 필요합니다.</p>
        <Button asChild className="mt-4">
          <a href="/auth/login">로그인</a>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="notifications">알림</TabsTrigger>
        <TabsTrigger value="sessions">세션 관리</TabsTrigger>
      </TabsList>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>알림 설정</CardTitle>
            <CardDescription>알림 수신 방법을 관리하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <Label htmlFor="email-notifications" className="text-base">
                  이메일 알림
                </Label>
                <p className="text-sm text-gray-500">
                  활동 및 업데이트에 대한 이메일 알림을 받습니다.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <Label htmlFor="marketing-emails" className="text-base">
                  마케팅 이메일
                </Label>
                <p className="text-sm text-gray-500">
                  신규 기능 및 프로모션에 대한 마케팅 이메일을 받습니다.
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveNotificationSettings} disabled={isLoading}>
              {isLoading ? "저장 중..." : "설정 저장"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="sessions">
        <Card>
          <CardHeader>
            <CardTitle>세션 관리</CardTitle>
            <CardDescription>현재 로그인된 기기를 관리하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">현재 세션</p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()} 에 로그인
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded">
                    활성
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                다른 기기에서 로그인한 세션이 없습니다. 다른 기기에서 로그인하면
                여기에 표시됩니다.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() =>
                toast.success("다른 모든 세션에서 로그아웃되었습니다.")
              }
            >
              다른 모든 세션에서 로그아웃
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
