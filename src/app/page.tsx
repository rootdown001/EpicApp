import Contact from "./contact/page";
import Main from "./main/page";
import Redirect from "./redirect/page";

const themeColor = "#4B61A6";

export default function Home() {
  return (
    <>
      <Main />
      <Redirect />
      <Contact />
    </>
  );
}
