export default str => {
  let lowerStr = str.toLowerCase();
  // uppercase first character
  lowerStr = lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
  // uppercase characters after spaces
  return lowerStr.replace(/\W\S/g, t => t.toUpperCase());
};
