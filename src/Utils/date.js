export const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T ${hours}:${minutes}`;
};

export const formatTimeAMPM = (time) =>
  new Date(time)
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(":", ".");

export const toTimeInputValue = (date) => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const toDateTimeLocal = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const pad = (n) => n.toString().padStart(2, "0");

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
};
