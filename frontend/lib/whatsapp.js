export const whatsappUrl = (message) => {
  const number = "918015300905";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
};
