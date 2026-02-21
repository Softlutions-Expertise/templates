/* eslint-disable prefer-spread */
export function decode(hexString) {
  hexString = hexString.replace(/[^0-9A-Fa-f]/g, '');

  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }

  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  const decodedString = decodeURIComponent(
    encodeURIComponent(String.fromCharCode.apply(String, bytes)),
  );
  return decodedString;
}
