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

export const formatTimeAMPM = (dateString) => {
  const d = new Date(dateString);

  let hour = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

export const toTimeInputValue = (dateString) => {
  const d = new Date(dateString);

  const hours = d.getUTCHours().toString().padStart(2, "0");
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");

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
