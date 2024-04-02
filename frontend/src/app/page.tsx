import { redirect } from "next/navigation";

/**
 * On the root URL of our site (i.e. "<domain>/"), redirect the user to the staff login page.
 */
const Home = () => {
  redirect("/login");
};

export default Home;
