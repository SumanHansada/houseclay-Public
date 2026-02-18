import { Metadata } from "next";

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

  const currentPage = Number(page) || 1;
  const searchTerm = search || "";

  return (
    <UsersTableView initialPage={currentPage} initialSearch={searchTerm} />
  );
}
