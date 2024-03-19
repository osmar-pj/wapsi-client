import { useEffect, useState, useContext } from "react";
import Mapa from "@/src/components/w-Map/w-Map";
import Header from "@/src/components/c-header/c-header";
import { MainContext, useMainContext } from "@/src/contexts/Main-context";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import Foot from "@/src/components/c-footer/c-footer";
import NotifyW from "@/src/components/c-modal/c-notify";

export default function Safety({ empresa, roles }) {
  const { setInstruments } = useMainContext();

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const instrument$ = new Subject();
  
    socket.on(`${empresa.toUpperCase()}`, (data) => {
      // console.log(data.value, data.name);
      instrument$.next(data);
    });
  
    const subscription = instrument$.subscribe((updatedData) => {
      setInstruments((prevInstruments) => {
        const updatedInstruments = prevInstruments.map((instrument) => {
          if (instrument.groups && Array.isArray(instrument.groups)) {
            const foundIndex = instrument.groups.findIndex((group) => group._id === updatedData._id);
            if (foundIndex !== -1) {
              const updatedGroup = { ...instrument.groups[foundIndex], ...updatedData };
              const updatedGroups = [...instrument.groups];
              updatedGroups[foundIndex] = updatedGroup;
              return { ...instrument, groups: updatedGroups };
            }
          }
          return instrument;
        });
        return updatedInstruments;
      });
    });
  
    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [empresa]);
  

  // console.log(
  //   controllers
  // );

  return (
    <>
      <Header roles={roles} />
      <section className="w-Home">
        <Mapa empresa={empresa} />
        <NotifyW/>
      </section>
      <Foot />
    </>
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

  const userData = JSON.parse(userDataCookie);
  const empresa = userData.empresa;
  const roles = userData.roles;
  return {
    props: { empresa, roles },
  };
};
