export default function DisclaimerModal({ onComplete }) {
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="flex flex-col justify-center">
          <h2 className="text-center p-4 text-2xl font-bold">Disclaimer</h2>
          <p className="pb-5">
            "Hex Settlers" is an independent, fan-made project developed for educational and portfolio purposes only. This project is not affiliated with, endorsed by, or associated with Catan GmbH, Kosmos, Asmodee, or any of their respective brands, products, or trademarks. All references to
            "Catan" and its related assets, including but not limited to game mechanics, designs, and terminology, are solely for illustrative and demonstrative purposes.
          </p>
          <p className="pb-5">
            This project is intended as a personal showcase of web development skills using React and Node.js and is hosted online for non-commercial, informational purposes only. No financial gain is derived from this project, and no copyrighted assets from the original game are distributed or
            sold.
          </p>
          <p className="pb-5">If you are a rights holder and believe that this project infringes upon your intellectual property, please contact me directly at aw22bh@brocku.ca, and I will promptly address any concerns, including removing the project if necessary.</p>
          <div className="flex justify-center">
            <button onClick={() => onComplete()}>Okay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
