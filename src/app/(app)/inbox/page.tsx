'use client';

import { Suspense } from "react";
import InboxContent from "./InboxContent";

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading Inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
}
