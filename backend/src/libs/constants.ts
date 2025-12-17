export const CATEGORY_INITIAL_OPTIONS = [
  {
    title: "Gym",
    icon: "GYM",
    background: "Saly-2",
    color: "#FF5335",
    isIncome: false,
  },
  {
    title: "Entertainment",
    icon: "ENTERTAINMENT",
    background: "Saly-14",
    color: "#5432D380",
    isIncome: false,
  },
  {
    title: "Clothing",
    icon: "CLOTHING",
    background: "Saly-9",
    color: "var(--purple-100)",
    isIncome: false,
  },
  {
    title: "Education",
    icon: "EDUCATION",
    background: "Saly-12",
    color: "#FF634880",
    isIncome: false,
  },
  {
    title: "Salary",
    icon: "BANK",
    background: "Saly-5",
    color: "var(--purple-200)",
    isIncome: true,
  },
  {
    title: "Extra Income",
    icon: "WALLET",
    background: "Saly-7",
    color: "#F392F2",
    isIncome: true,
  },
  {
    title: "Gifts",
    icon: "HEART",
    background: "Saly-4",
    color: "#FFA50280",
    isIncome: true,
  },
];

export const ACCOUNT_INITIAL_OPTIONS = [
  {
    title: "Wallet",
    amount: 0,
    icon: "WALLET",
  },
  {
    title: "Bank",
    amount: 0,
    icon: "BANK",
  },
  {
    title: "Cash",
    amount: 0,
    icon: "RUPEE",
  },
];

export const MONTH_NAMES = [
  { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
  { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
  { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
  { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
  { case: { $eq: ["$_id.month", 5] }, then: "May" },
  { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
  { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
  { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
  { case: { $eq: ["$_id.month", 9] }, then: "Sept" },
  { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
  { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
  { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
];

export const TYPES = {
  EXPENSE: "Expense",
  INCOME: "Income",
};
