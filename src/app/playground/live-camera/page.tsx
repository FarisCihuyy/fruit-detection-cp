import LiveCamera from "@/components/LiveCamera";

export default function Page() {
  return (
    <section className="grid place-items-center border w-full">
      <LiveCamera maxHeight={350} maxWidth={480} />
    </section>
  );
}

// Tanpa deteksi

// Dengan deteksi (dari model seperti YOLO/TensorFlow.js)
// const [boxes, setBoxes] = useState<BoundingBox[]>([]);

// <LiveCamera
//   maxWidth={660}
//   maxHeight={480}
//   captureInterval={200}
//   detections={boxes}
//   onFrame={(blob, canvas) => {
//   }}
// />;
