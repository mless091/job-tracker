// components/job-board/StatusSelect.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStatus } from "@/app/actions";


export default function StatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={async (value) => {
        // Call the server action directly
        await updateStatus(id, value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="SAVED">Saved</SelectItem>
        <SelectItem value="APPLIED">Applied</SelectItem>
        <SelectItem value="INTERVIEW">Interviewing</SelectItem>
        <SelectItem value="OFFER">Offer</SelectItem>
        <SelectItem value="REJECTED">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}