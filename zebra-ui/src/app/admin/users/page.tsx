import { Metadata } from "next";
import { redirect } from "next/navigation";

import { UsersTableView } from "./UsersTableView";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { page, search } = await searchParams;

  if (search) {
    return {
      title: `Search: "${search}" | User Management`,
    };
  }

  const pageNum = page ? ` - Page ${page}` : "";
  return {
    title: `User Management${pageNum}`,
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const { page, search } = await searchParams;

  const parsedPage = Number(page);

  // If the page is invalid, redirect to page 1, but KEEP the search term if it exists!
  if (page !== undefined && (isNaN(parsedPage) || parsedPage < 1)) {
    const searchParam = search ? `&search=${search}` : "";
    redirect(`/admin/users?page=1${searchParam}`);
  }

  const currentPage = parsedPage || 1;
  const searchTerm = search || "";

  return <UsersTableView currentPage={currentPage} searchTerm={searchTerm} />;
}
