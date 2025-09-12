const LostConnectionModal = ({ setScreen, setMenu }) => {
  const handleClick = () => {
    setMenu("connect");
    setScreen("home");
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-4 text-2xl font-bold">Connection Lost</h2>
        <p className="text-center">You have been disconnected from the server.</p>
        <p className="text-center">If you are on a mobile device, please do not navigate away from the game screen while playing.</p>
        <div className="grid justify-center p-3">
          <button onClick={handleClick}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default LostConnectionModal;
