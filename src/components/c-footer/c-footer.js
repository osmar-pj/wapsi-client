import Marquee from "react-fast-marquee";

export default function Foot() {
  return (
    <>
      <footer className="w-Foot">
        <Marquee speed={30} className="Foot-marquee">
          <p className="marquee-text">
            Si no es seguro, no se hace <span>·</span> Tus acciones y mis
            acciones cuidan vidas <span>·</span> Si no es seguro, no se hace{" "}
            <span>·</span> Tus acciones y mis acciones cuidan vidas{" "}
            <span>·</span> Si no es seguro, no se hace <span>·</span> Tus acciones y mis
            acciones cuidan vidas{" "}
            <span>·</span> Si no es seguro, no se hace <span>·</span>
          </p>
        </Marquee>
      </footer>
    </>
  );
}
