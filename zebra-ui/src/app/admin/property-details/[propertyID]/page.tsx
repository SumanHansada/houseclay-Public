import { use } from "react";

export const dynamicParams = true;

interface TParams {
  params: Promise<{ propertyID: string }>;
}

export default function UserDetailsRedirectPage({ params }: TParams) {
  const { propertyID } = use(params);
  // redirect(`/admin/user-details/${userPhoneNo}/profile`);
  return <h1>Property Details for ID - {propertyID}</h1>;
}
