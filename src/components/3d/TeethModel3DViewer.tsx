import { Canvas, ThreeEvent } from "@react-three/fiber";
import { TeethModel3D } from "./TeethModel3D";

type TeethModel3DViewerProps = JSX.IntrinsicElements["group"] & {
  onToothClick?: (toothNumber: number, event?: ThreeEvent<MouseEvent>) => void;
};

export function TeethModel3DViewer(props: TeethModel3DViewerProps) {
  const { onToothClick, ...args } = props;
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50, zoom: 5 }}>
      <ambientLight intensity={1} />
      <pointLight position={[2.5, 0, 0]} intensity={10} />
      <pointLight position={[-2.5, 0, 0]} intensity={10} />
      <TeethModel3D {...args} onToothClick={onToothClick} />
    </Canvas>
  );
}

export default TeethModel3DViewer;
