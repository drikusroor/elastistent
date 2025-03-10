import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Canvas } from "@react-three/fiber";

import { TeethModel3D } from "../components/3d/TeethModel3D";
import TeethModel3DViewer from "../components/3d/TeethModel3DViewer";
import { Backdrop } from "@react-three/drei";

// TeethModel stories
const teethModelMeta = {
  title: "Components/TeethModelV2",
  component: TeethModel3D,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onToothClick: fn(),
    camZoom: 3.5,
    camPosition: [0, 0, 5],
    camFov: 50,
    objPosition: [0, 1.33, 0],
  },
} satisfies Meta<typeof TeethModel3D>;

export const TeethModelMeta = teethModelMeta;

type TeethModelStory = StoryObj<typeof teethModelMeta>;

// For 3D components, we need to wrap them in a Canvas
export const DefaultTeethModel: TeethModelStory = {
  render: (args) => {
    const { camZoom, camPosition, camFov, objPosition } = args;

    return (
      <div style={{ width: "600px", height: "400px" }}>
        <Canvas camera={{ position: camPosition, fov: camFov, zoom: camZoom }}>
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} />
          <TeethModel3D {...args} position={objPosition} />
        </Canvas>
      </div>
    );
  },
};

export const WithClickHandler: TeethModelStory = {
  args: {
    onToothClick: (toothNumber: number) =>
      console.log(`Tooth ${toothNumber} clicked`),
  },
  render: (args) => (
    <div style={{ width: "600px", height: "400px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50, zoom: 5 }}>
        <color attach="background" args={["#eee"]} />
        <ambientLight intensity={1.2} />
        <pointLight position={[2.5, 0, 1]} intensity={15} />
        <pointLight position={[-2.5, 0, 1]} intensity={15} />
        <TeethModel3D {...args} />
      </Canvas>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "TeethModel with a click handler that will show up in the Actions panel when a tooth is clicked.",
      },
    },
  },
};

export const Viewer: TeethModelStory = {
  render: () => <TeethModel3DViewer />,
};

export default teethModelMeta;
