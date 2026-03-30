import { Metadata } from "next";
import { redirect } from "next/navigation";

import { PropertiesTableView } from "./PropertiesTableView";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNum = page ? ` - Page ${page}` : "";
  return { title: `Property Management${pageNum}` };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const parsedPage = Number(page);

  if (page !== undefined && (isNaN(parsedPage) || parsedPage < 1)) {
    redirect(`/admin/properties?page=1`);
  }

  const currentPage = parsedPage || 1;

  return <PropertiesTableView currentPage={currentPage} />;
}
