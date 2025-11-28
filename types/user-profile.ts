export interface Profile {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
}
