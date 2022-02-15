

export default function Chat({chat}) {

  return (
    <p className="mb-3">
      ({chat[1]})<strong>{chat[0]}님으로부터: </strong>
      {chat[2]}
    </p>
  );
}
