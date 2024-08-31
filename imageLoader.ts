export default function ImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `https://astradefi.sachingurjar.me/${src}`;
}
