"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleForceUpdate = async () => {
    await update({
      ...session,
      user: {
        ...session?.user,
        onboardingCompleted: true,
      },
    });
    router.push("/dashboard");
  };

  return (
    <div className="container max-w-2xl py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>세션 디버깅</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">현재 세션 정보:</h3>
            <pre className="p-4 rounded bg-muted overflow-auto max-h-80">
              {JSON.stringify(session, null, 2)}
            </pre>

            <div className="pt-4">
              <Button onClick={handleForceUpdate}>
                강제로 onboardingCompleted를 true로 설정하고 대시보드로 이동
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
