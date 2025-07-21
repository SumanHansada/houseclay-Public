export interface ConnectCardInfo {
  id: number;
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  iconWidth?: number;
  iconHeight?: number;
}

export const CONNECT_CARDS: ConnectCardInfo[] = [
  {
    id: 1,
    iconSrc: "/icons/static-pages/connect-with-owners.svg",
    iconAlt: "Find & Connect with Owners",
    title: "Find & Connect with Owners",
    description:
      "Unlock verified owner details and contact them directly—no middlemen, no extra charges.",
    iconWidth: 150,
    iconHeight: 150,
  },
  {
    id: 2,
    iconSrc: "/icons/static-pages/simplify-rental-processes.svg",
    iconAlt: "Simplify Rental Processes",
    title: "Simplify Rental Processes",
    description:
      "Use Connects for rent agreements, tenant verification, and seamless property transactions.",
    iconWidth: 160,
    iconHeight: 150,
  },
  {
    id: 3,
    iconSrc: "/icons/static-pages/access-property-services.svg",
    iconAlt: "Access Property Services",
    title: "Access Property Services",
    description:
      "Redeem Connects for maintenance, cleaning, painting, and expert property management.",
    iconWidth: 150,
    iconHeight: 150,
  },
];
