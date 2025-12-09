import { useMe } from "../../shared/me";
import { HomeView } from "./view";

export const Home = () => {
  const fetchedUser = useMe();
  return <HomeView fetchedUser={fetchedUser} />;
};
