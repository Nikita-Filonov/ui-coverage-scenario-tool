export const capitalizeFirstLetter = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1);

export const hexToRGBA = (hex: string, alpha: number): string => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);

  return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${alpha})`;
};
