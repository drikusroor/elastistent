import { Canvas, ThreeEvent } from "@react-three/fiber";
import { TeethModel3D } from "./TeethModel3D";
import { ElasticPoint } from "../../types";

type TeethModel3DViewerProps = JSX.IntrinsicElements["group"] & {
  onToothClick?: (toothNumber: number, event?: ThreeEvent<MouseEvent>) => void;
  currentElastic: ElasticPoint[];
};

export function TeethModel3DViewer(props: TeethModel3DViewerProps) {
  return (
    <div className="w-full aspect-square">
      <Canvas camera={{ position: [0, 0, 5], fov: 50, zoom: 4.5 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[2.5, 0, 1]} intensity={15} />
        <pointLight position={[-2.5, 0, 1]} intensity={15} />
        <TeethModel3D {...props} />
      </Canvas>
    </div>
  );
}

export default TeethModel3DViewer;
