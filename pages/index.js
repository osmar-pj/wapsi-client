import LegendIcon from "@/src/Icons/LegendIcon";
import CardTitle from "@/src/components/Map/CardTitle";
import Legend from "@/src/components/Map/Legend";
import Map from "@/src/components/Map/Map";
import { useMainContext } from "@/src/contexts/Main-context";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { io } from "socket.io-client";

export default function Home() {
  const { authTokens, setInstruments } = useMainContext();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const instrument$ = new Subject();

    socket.on(`${authTokens?.empresa.toUpperCase()}`, (data) => {
      // console.log(data.name, data.serie, data);
      instrument$.next(data);
    });

    const subscription = instrument$.subscribe((updatedData) => {
      if (updatedData && updatedData._id) {
        setInstruments((prevInstruments) => {
          const updatedInstruments = prevInstruments.map((instrument) => {
            if (instrument.groups && Array.isArray(instrument.groups)) {
              const foundIndex = instrument.groups.findIndex(
                (group) => group._id === updatedData._id
              );
              if (foundIndex !== -1) {
                const updatedGroup = {
                  ...instrument.groups[foundIndex],
                  ...updatedData,
                };
                const updatedGroups = [...instrument.groups];
                updatedGroups[foundIndex] = updatedGroup;
                return { ...instrument, groups: updatedGroups };
              }
            }
            return instrument;
          });
          return updatedInstruments;
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [authTokens, setInstruments]);

  const handleClick = () => {
    setShowInfo(!showInfo);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  return (
    <section className="w-Home">
      <CardTitle />
      <Map />
      {/* <Notification />       */}
      <button className="button-legend" onClick={handleClick}>
       <LegendIcon/>  Leyenda
      </button>
      {showInfo && <Legend onClose={handleCloseInfo} />}
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
