import { TGetUsersResponse } from "@/interfaces/User";
// 30 dummy users
export const dummyUsers: Array<{
  name: string;
  email: string;
  avatar: string;
  phoneNo: string;
  blacklisted: boolean;
}> = [
  {
    name: "Alice Johnson",
    email: "alice.j@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    phoneNo: "9000000001",
    blacklisted: false,
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    phoneNo: "9000000002",
    blacklisted: false,
  },
  {
    name: "Carol Williams",
    email: "carol.williams@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    phoneNo: "9000000003",
    blacklisted: true,
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    phoneNo: "9000000004",
    blacklisted: false,
  },
  {
    name: "Eva Davis",
    email: "eva.davis@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    phoneNo: "9000000005",
    blacklisted: false,
  },
  {
    name: "Frank Miller",
    email: "frank.miller@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    phoneNo: "9000000006",
    blacklisted: true,
  },
  {
    name: "Grace Wilson",
    email: "grace.wilson@example.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    phoneNo: "9000000007",
    blacklisted: false,
  },
  {
    name: "Henry Moore",
    email: "henry.moore@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    phoneNo: "9000000008",
    blacklisted: false,
  },
  {
    name: "Isabel Taylor",
    email: "isabel.taylor@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    phoneNo: "9000000009",
    blacklisted: false,
  },
  {
    name: "Jack Anderson",
    email: "jack.anderson@example.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    phoneNo: "9000000010",
    blacklisted: true,
  },
  {
    name: "Karen Thomas",
    email: "karen.thomas@example.com",
    avatar: "https://i.pravatar.cc/150?img=11",
    phoneNo: "9000000011",
    blacklisted: false,
  },
  {
    name: "Larry Jackson",
    email: "larry.jackson@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    phoneNo: "9000000012",
    blacklisted: false,
  },
  {
    name: "Mona White",
    email: "mona.white@example.com",
    avatar: "https://i.pravatar.cc/150?img=13",
    phoneNo: "9000000013",
    blacklisted: false,
  },
  {
    name: "Nathan Harris",
    email: "nathan.harris@example.com",
    avatar: "https://i.pravatar.cc/150?img=14",
    phoneNo: "9000000014",
    blacklisted: true,
  },
  {
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    phoneNo: "9000000015",
    blacklisted: false,
  },
  {
    name: "Paul Thompson",
    email: "paul.thompson@example.com",
    avatar: "https://i.pravatar.cc/150?img=16",
    phoneNo: "9000000016",
    blacklisted: false,
  },
  {
    name: "Quincy Garcia",
    email: "quincy.garcia@example.com",
    avatar: "https://i.pravatar.cc/150?img=17",
    phoneNo: "9000000017",
    blacklisted: false,
  },
  {
    name: "Rachel Martinez",
    email: "rachel.martinez@example.com",
    avatar: "https://i.pravatar.cc/150?img=18",
    phoneNo: "9000000018",
    blacklisted: true,
  },
  {
    name: "Steve Robinson",
    email: "steve.robinson@example.com",
    avatar: "https://i.pravatar.cc/150?img=19",
    phoneNo: "9000000019",
    blacklisted: false,
  },
  {
    name: "Tina Clark",
    email: "tina.clark@example.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    phoneNo: "9000000020",
    blacklisted: false,
  },
  {
    name: "Uma Rodriguez",
    email: "uma.rodriguez@example.com",
    avatar: "https://i.pravatar.cc/150?img=21",
    phoneNo: "9000000021",
    blacklisted: false,
  },
  {
    name: "Victor Lewis",
    email: "victor.lewis@example.com",
    avatar: "https://i.pravatar.cc/150?img=22",
    phoneNo: "9000000022",
    blacklisted: true,
  },
  {
    name: "Wendy Lee",
    email: "wendy.lee@example.com",
    avatar: "https://i.pravatar.cc/150?img=23",
    phoneNo: "9000000023",
    blacklisted: false,
  },
  {
    name: "Xavier Walker",
    email: "xavier.walker@example.com",
    avatar: "https://i.pravatar.cc/150?img=24",
    phoneNo: "9000000024",
    blacklisted: false,
  },
  {
    name: "Yolanda Hall",
    email: "yolanda.hall@example.com",
    avatar: "https://i.pravatar.cc/150?img=25",
    phoneNo: "9000000025",
    blacklisted: false,
  },
  {
    name: "Zach Young",
    email: "zach.young@example.com",
    avatar: "https://i.pravatar.cc/150?img=26",
    phoneNo: "9000000026",
    blacklisted: true,
  },
  {
    name: "Aaron King",
    email: "aaron.king@example.com",
    avatar: "https://i.pravatar.cc/150?img=27",
    phoneNo: "9000000027",
    blacklisted: false,
  },
  {
    name: "Bella Wright",
    email: "bella.wright@example.com",
    avatar: "https://i.pravatar.cc/150?img=28",
    phoneNo: "9000000028",
    blacklisted: false,
  },
  {
    name: "Cameron Scott",
    email: "cameron.scott@example.com",
    avatar: "https://i.pravatar.cc/150?img=29",
    phoneNo: "9000000029",
    blacklisted: false,
  },
  {
    name: "Diana Green",
    email: "diana.green@example.com",
    avatar: "https://i.pravatar.cc/150?img=30",
    phoneNo: "9000000030",
    blacklisted: true,
  },
];

// ------------------------------------------
// PAGE 0 (indexes 0..11) → 12 items
// ------------------------------------------
export const fakeUsersPage0: TGetUsersResponse = {
  content: dummyUsers.slice(0, 12),
  pageable: {
    pageNumber: 0,
    pageSize: 12,
  },
  totalPages: 3,
  totalElements: 30,
  last: false,
  first: true,
  numberOfElements: 12,
  size: 12,
  number: 0,
};

// ------------------------------------------
// PAGE 1 (indexes 12..23) → 12 items
// ------------------------------------------
export const fakeUsersPage1: TGetUsersResponse = {
  content: dummyUsers.slice(12, 24),
  pageable: {
    pageNumber: 1,
    pageSize: 12,
  },
  totalPages: 3,
  totalElements: 30,
  last: false,
  first: false,
  numberOfElements: 12,
  size: 12,
  number: 1,
};

// ------------------------------------------
// PAGE 2 (indexes 24..29) → 6 items
// ------------------------------------------
export const fakeUsersPage2: TGetUsersResponse = {
  content: dummyUsers.slice(24, 30),
  pageable: {
    pageNumber: 2,
    pageSize: 12,
  },
  totalPages: 3,
  totalElements: 30,
  last: true,
  first: false,
  numberOfElements: 6,
  size: 12,
  number: 2,
};
