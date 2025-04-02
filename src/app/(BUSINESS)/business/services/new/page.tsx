"use client";

import BusinessServiceForm from "@/components/Forms/BusinessServiceForm";

export default function BusinessServiceNewPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">새 서비스 등록</h1>
      <BusinessServiceForm />
    </div>
  );
}
