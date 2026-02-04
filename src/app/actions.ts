// app/actions.ts
'use server' // <--- This is magic. It tells Next.js "Run this on the server, not the browser"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  // 1. Auth Check
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to add a job.");
  }

  // 2. Extract Data from the Form
  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const listingUrl = formData.get("listingUrl") as string;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  const description = formData.get("description") as string;

  // 3. Save to Database
  await prisma.job.create({
    data: {
      userId, // Link the job to YOU
      company,
      position,
      listingUrl,
      location,
      salary,
      description,
      status: "SAVED", // Default status
    },
  });

  // 4. Update the Dashboard & Redirect
  revalidatePath("/dashboard"); // Tells the dashboard to refresh the data
  redirect("/dashboard");       // Send you back to the main list
}
export async function deleteJob(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const jobId = formData.get("jobId") as string;

  await prisma.job.delete({
    where: {
      id: jobId,
      userId, // Security: Ensure you can only delete YOUR jobs
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateStatus(jobId: string, newStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.job.update({
    where: {
      id: jobId,
      userId,
    },
    data: {
      status: newStatus,
    },
  });

  revalidatePath(`/dashboard/${jobId}`);
  revalidatePath("/dashboard");
}