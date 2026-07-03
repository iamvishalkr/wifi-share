import { useMyContext } from "../provider/MyContext";

const Messages = () => {
  const { messages, setMessages, socket } = useMyContext();
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>
  ) => {
    setMessages(e.target.value);
  };

  const emmitMsg = () => {
    if (!socket) return;
    socket.emit("my_messages", {
      messages: messages + "\n",
    });
  };
  return (
    <div className="field label border">
      <textarea
        style={{ minHeight: "85vh" }}
        value={messages}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            emmitMsg();
          }
        }}
      ></textarea>
      <label>Write or paste something and press enter</label>
    </div>
  );
};

export default Messages;
