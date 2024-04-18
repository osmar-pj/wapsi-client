import GrapHig from "@/src/components/Graphic/Grap";
import GraphicAdvance from "@/src/components/Graphic/GraphicAdvance";
import GraphicBasic from "@/src/components/Graphic/GraphicBasic";
import { useState } from "react";

export default function Analysis() {
  const [selectedTab, setSelectedTab] = useState("basico");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section className="w-Analysis">
      <div className="t-t-f-btns">
        <div className="radio-inputs">
          <label className="radio">
            <input
              type="radio"
              name="radio"
              onChange={() => handleTabClick("basico")}
              checked={selectedTab === "basico"}
            />
            <span className="name">Basico</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              onChange={() => handleTabClick("avanzado")}
              checked={selectedTab === "avanzado"}
            />
            <span className="name">Avanzado</span>
          </label>
        </div>
      </div>
      {selectedTab === "avanzado" && <GraphicAdvance />}
       {selectedTab === "basico" && <GraphicBasic />} 
       {/* <div>
        <GrapHig/>
      </div>  */}
    </section>
  );
}

export const getServerSideProps = async (ctx) => {
  const userDataCookie = ctx.req.cookies.userData;
  const isLoggedIn = !!userDataCookie;

  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
