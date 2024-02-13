import { useEffect, useState } from "react";
import Image from "next/image";

export default function ModalW() {
  const [description, setDescription] = useState("");
  const fetchWapsi = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/advertiser`);
      if (response.ok) {
        const jsonData = await response.json();
        const descriptions = jsonData.map(item => item.description);
        setDescription(descriptions);
      } else {
        console.error("Error en la petición");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchWapsi();
  }, []);

  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showModal && (
        <div
          className="MSG-modal"
          style={{
            opacity: showModal ? "1" : "0",
            visibility: showModal ? "visible" : "hidden",
            transition: "opacity 1s ease-in-out, visibility 1s ease-in-out",
          }}
        >
          <div className="modal-container">
            <Image
              src="/imgs/buena.svg"
              alt="Image-BUENAVENTURA"
              width={100}
              height={30}
              quality={50}
              priority
            />

            <svg width="100%" height="100%">
              <rect x="0" y="0" width="100%" height="100%" rx="1" ry="10" />
            </svg>
            <div className="cd"></div>
            <div className="cd2"></div>
            <div className="cd3"></div>
            <div className="cd4"></div>
            <span className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p>{description}</p>
            <Image
              src="/imgs/logo.svg"
              alt="Image-GUNJOP"
              width={100}
              height={30}
              quality={50}
              priority
              className="logo-gunjop"
            />
          </div>
        </div>
      )}
    </>
  );
}
