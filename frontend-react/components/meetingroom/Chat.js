export default function Chat({ chat }) {
  return (
    <p className="mb-3">
      <strong>{chat[0]}</strong>&nbsp;{chat[1]} <br />
      {chat[2]}
    </p>
  );
}
