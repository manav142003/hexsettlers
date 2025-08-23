const GameAbortedModal = ({ username, onClose }) => {
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="flex flex-col">
          <h2 className={`text-center pb-3 pt-2 text-2xl font-bold`}>Game Over</h2>
          <p className={`text-center pb-5 font-semibold`}>{username} disconnected.</p>
          <button onClick={onClose}>Return to Lobby</button>
        </div>
      </div>
    </div>
  );
};

export default GameAbortedModal;
