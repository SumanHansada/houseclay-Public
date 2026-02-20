import { Metadata } from "next";
import { redirect } from "next/navigation";

import { VerifyPropertyStatusEnum } from "@/common/enums";

import { VerificationTableView } from "./VerificationTableView";

interface PageProps {
  params: Promise<{ status: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export async function generateStaticParams() {
  return [
    { status: VerifyPropertyStatusEnum.VERIFY },
    { status: VerifyPropertyStatusEnum.REVERIFY },
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { status } = await params;
  return { title: `Property Verification - ${status}` };
}

export default async function VerificationPage({
  params,
  searchParams,
}: PageProps) {
  const { status } = await params;
  const { page, search } = await searchParams;

  const validStatuses = Object.values(VerifyPropertyStatusEnum) as string[];
  if (!validStatuses.includes(status)) {
    redirect(
      `/admin/properties/verification/${VerifyPropertyStatusEnum.VERIFY}`,
    );
  }

  const validStatus = status as VerifyPropertyStatusEnum;
  const parsedPage = Number(page);

  if (page !== undefined && (isNaN(parsedPage) || parsedPage < 1)) {
    const searchParam = search ? `&search=${search}` : "";
    redirect(
      `/admin/properties/verification/${validStatus}?page=1${searchParam}`,
    );
  }

  const currentPage = parsedPage || 1;
  const searchTerm = search || "";

  return (
    <VerificationTableView
      status={validStatus}
      currentPage={currentPage}
      searchTerm={searchTerm}
    />
  );
}
