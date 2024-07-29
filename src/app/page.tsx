import Contact from "./contact/page";
import { MetadataProvider } from "./context/MetadataContext";
import Main from "./main/page";
import Redirect from "./redirect/page";

// const themeColor = "#4B61A6";

export default function Home() {
  return (
    <MetadataProvider>
      <div className="">
        <Main />
        <Redirect />
        {/* <Contact /> */}
      </div>
    </MetadataProvider>
  );
}
// TODO: fix context for metadata - left off w Error: useMetadata must be used within a MetadataProvider
